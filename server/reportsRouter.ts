/**
 * Router tRPC pour l'export de rapports (PDF/Excel)
 */

import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { 
  exportReportToPDF, 
  exportReportToExcel, 
  createAnalyticsReport,
  createLeadsReport,
  createFinancialReport,
  Report
} from './services/reportExportService';
import { getDb } from './db';
import { subscribers, leadActivities, orders, subscriptions } from '../drizzle/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

export const reportsRouter = router({
  /**
   * Générer un rapport d'analytics
   */
  generateAnalyticsReport: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      format: z.enum(['pdf', 'excel'])
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      // Récupérer les statistiques
      const totalLeadsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers);
      
      const hotLeadsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(eq(subscribers.leadTemperature, 'hot'));

      const warmLeadsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(eq(subscribers.leadTemperature, 'warm'));

      const coldLeadsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(eq(subscribers.leadTemperature, 'cold'));

      const conversionsResult = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscriptions)
        .where(and(
          eq(subscriptions.status, 'active'),
          gte(subscriptions.createdAt, startDate),
          lte(subscriptions.createdAt, endDate)
        ));

      const revenueResult = await db
        .select({ total: sql<number>`SUM(amount)` })
        .from(orders)
        .where(and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        ));

      const totalLeads = Number(totalLeadsResult[0]?.count || 0);
      const hotLeads = Number(hotLeadsResult[0]?.count || 0);
      const warmLeads = Number(warmLeadsResult[0]?.count || 0);
      const coldLeads = Number(coldLeadsResult[0]?.count || 0);
      const conversions = Number(conversionsResult[0]?.count || 0);
      const revenue = Number(revenueResult[0]?.total || 0);

      const conversionRate = totalLeads > 0 ? ((conversions / totalLeads) * 100).toFixed(2) : '0';

      const data = {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads,
        conversionRate: parseFloat(conversionRate),
        revenue,
        leadsChange: 0, // TODO: calculer l'évolution
        hotLeadsChange: 0,
        conversionChange: 0,
        revenueChange: 0
      };

      const report = createAnalyticsReport(data, { start: startDate, end: endDate });

      // Générer le fichier
      const buffer = input.format === 'pdf' 
        ? await exportReportToPDF(report)
        : await exportReportToExcel(report);

      // Convertir en base64 pour le transfert
      const base64 = buffer.toString('base64');
      const filename = `analytics-report-${Date.now()}.${input.format === 'pdf' ? 'pdf' : 'xlsx'}`;

      return {
        filename,
        data: base64,
        mimeType: input.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    }),

  /**
   * Générer un rapport de leads
   */
  generateLeadsReport: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      format: z.enum(['pdf', 'excel'])
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      // Top 10 leads chauds
      const topLeads = await db
        .select({
          email: subscribers.email,
          score: subscribers.leadScore,
          temperature: subscribers.leadTemperature,
          lastActivity: subscribers.subscribedAt
        })
        .from(subscribers)
        .where(eq(subscribers.leadTemperature, 'hot'))
        .orderBy(desc(subscribers.leadScore))
        .limit(10);

      // Activités par type
      const activitiesByTypeResult = await db
        .select({
          type: leadActivities.activityType,
          count: sql<number>`COUNT(*)`,
          avgScore: sql<number>`AVG(${leadActivities.score})`
        })
        .from(leadActivities)
        .where(and(
          gte(leadActivities.createdAt, startDate),
          lte(leadActivities.createdAt, endDate)
        ))
        .groupBy(leadActivities.activityType);

      const activitiesByType = activitiesByTypeResult.map(a => ({
        type: a.type,
        count: Number(a.count),
        avgScore: Number(a.avgScore).toFixed(1)
      }));

      const data = {
        topLeads,
        activitiesByType
      };

      const report = createLeadsReport(data, { start: startDate, end: endDate });

      // Générer le fichier
      const buffer = input.format === 'pdf' 
        ? await exportReportToPDF(report)
        : await exportReportToExcel(report);

      const base64 = buffer.toString('base64');
      const filename = `leads-report-${Date.now()}.${input.format === 'pdf' ? 'pdf' : 'xlsx'}`;

      return {
        filename,
        data: base64,
        mimeType: input.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    }),

  /**
   * Générer un rapport financier
   */
  generateFinancialReport: protectedProcedure
    .input(z.object({
      startDate: z.string(),
      endDate: z.string(),
      format: z.enum(['pdf', 'excel'])
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const startDate = new Date(input.startDate);
      const endDate = new Date(input.endDate);

      // Revenus total
      const revenueResult = await db
        .select({ total: sql<number>`SUM(amount)` })
        .from(orders)
        .where(and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        ));

      // MRR (Monthly Recurring Revenue)
      const mrrResult = await db
        .select({ total: sql<number>`SUM(amount)` })
        .from(subscriptions)
        .where(eq(subscriptions.status, 'active'));

      // Nombre de clients
      const customersResult = await db
        .select({ count: sql<number>`COUNT(DISTINCT userId)` })
        .from(orders)
        .where(and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        ));

      // Panier moyen
      const avgOrderResult = await db
        .select({ avg: sql<number>`AVG(amount)` })
        .from(orders)
        .where(and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        ));

      // Revenus par produit
      const revenueByProductResult = await db
        .select({
          name: orders.productId,
          sales: sql<number>`COUNT(*)`,
          revenue: sql<number>`COUNT(*) * 490`
        })
        .from(orders)
        .where(and(
          eq(orders.status, 'completed'),
          gte(orders.createdAt, startDate),
          lte(orders.createdAt, endDate)
        ))
        .groupBy(orders.productId);

      const totalRevenue = Number(revenueResult[0]?.total || 0);
      const mrr = Number(mrrResult[0]?.total || 0);
      const customers = Number(customersResult[0]?.count || 0);
      const avgOrderValue = Number(avgOrderResult[0]?.avg || 0);

      const revenueByProduct = revenueByProductResult.map(p => ({
        name: p.name,
        sales: Number(p.sales),
        revenue: Number(p.revenue)
      }));

      const data = {
        totalRevenue,
        mrr,
        customers,
        avgOrderValue: avgOrderValue.toFixed(2),
        revenueChange: 0, // TODO: calculer l'évolution
        mrrChange: 0,
        customersChange: 0,
        avgOrderChange: 0,
        revenueByProduct
      };

      const report = createFinancialReport(data, { start: startDate, end: endDate });

      // Générer le fichier
      const buffer = input.format === 'pdf' 
        ? await exportReportToPDF(report)
        : await exportReportToExcel(report);

      const base64 = buffer.toString('base64');
      const filename = `financial-report-${Date.now()}.${input.format === 'pdf' ? 'pdf' : 'xlsx'}`;

      return {
        filename,
        data: base64,
        mimeType: input.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    }),

  /**
   * Générer un rapport personnalisé
   */
  generateCustomReport: protectedProcedure
    .input(z.object({
      report: z.object({
        title: z.string(),
        subtitle: z.string().optional(),
        period: z.object({
          start: z.string(),
          end: z.string()
        }),
        sections: z.array(z.object({
          title: z.string(),
          type: z.enum(['kpi', 'table', 'chart', 'text']),
          data: z.any(),
          description: z.string().optional()
        }))
      }),
      format: z.enum(['pdf', 'excel'])
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const report: Report = {
        title: input.report.title,
        subtitle: input.report.subtitle,
        period: {
          start: new Date(input.report.period.start),
          end: new Date(input.report.period.end)
        },
        sections: input.report.sections
      };

      // Générer le fichier
      const buffer = input.format === 'pdf' 
        ? await exportReportToPDF(report)
        : await exportReportToExcel(report);

      const base64 = buffer.toString('base64');
      const filename = `custom-report-${Date.now()}.${input.format === 'pdf' ? 'pdf' : 'xlsx'}`;

      return {
        filename,
        data: base64,
        mimeType: input.format === 'pdf' ? 'application/pdf' : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      };
    })
});
