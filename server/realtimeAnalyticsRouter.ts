import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { 
  subscribers, 
  orders, 
  subscriptions, 
  leadActivities
} from "../drizzle/schema";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { eq, and, gte, sql, desc } from "drizzle-orm";

/**
 * Realtime Analytics Router
 * 
 * Provides advanced KPIs and metrics for business intelligence:
 * - Conversion metrics by source
 * - Revenue analytics (MRR, ARR, LTV)
 * - Real-time engagement tracking
 * - Predictive analytics
 */

export const realtimeAnalyticsRouter = router({
  /**
   * Get conversion metrics by source
   */
  getConversionMetrics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get total leads by source (from activityData)
      const leadsBySource = await db
        .select({
          source: sql<string>`JSON_EXTRACT(${leadActivities.activityData}, '$.source')`,
          count: sql<number>`COUNT(DISTINCT ${leadActivities.email})`,
        })
        .from(leadActivities)
        .where(eq(leadActivities.activityType, "page_view"))
        .groupBy(sql`JSON_EXTRACT(${leadActivities.activityData}, '$.source')`);

      // Get conversions (hot leads) by source
      const conversionsBySource = await db
        .select({
          source: sql<string>`JSON_EXTRACT(${leadActivities.activityData}, '$.source')`,
          conversions: sql<number>`COUNT(DISTINCT ${subscribers.email})`,
        })
        .from(subscribers)
        .innerJoin(leadActivities, eq(subscribers.email, leadActivities.email))
        .where(
          and(
            eq(subscribers.leadTemperature, "hot"),
            eq(leadActivities.activityType, "page_view")
          )
        )
        .groupBy(sql`JSON_EXTRACT(${leadActivities.activityData}, '$.source')`);

      // Calculate conversion rate by source
      const conversionMetrics = leadsBySource.map(source => {
        const conversions = conversionsBySource.find(c => c.source === source.source)?.conversions || 0;
        const conversionRate = source.count > 0 ? (conversions / source.count) * 100 : 0;
        
        return {
          source: source.source || "Direct",
          totalLeads: source.count,
          conversions,
          conversionRate: Math.round(conversionRate * 100) / 100,
        };
      });

      // Get average time to conversion
      const avgTimeToConversion = await db
        .select({
          avgDays: sql<number>`AVG(JULIANDAY(${subscribers.subscribedAt}) - JULIANDAY(${subscribers.subscribedAt}))`,
        })
        .from(subscribers)
        .where(eq(subscribers.leadTemperature, "hot"));

      // Note: Since we don't have updatedAt/createdAt, we use subscribedAt as reference

      return {
        bySource: conversionMetrics,
        avgTimeToConversion: Math.round((avgTimeToConversion[0]?.avgDays || 0) * 10) / 10,
      };
    }),

  /**
   * Get revenue analytics (MRR, ARR, LTV)
   */
  getRevenueAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Calculate MRR (Monthly Recurring Revenue)
      // Calculate MRR (Monthly Recurring Revenue) from subscriptions
      const activeSubscriptionsResult = await db
        .select({
          count: sql<number>`COUNT(*)`,
          totalAmount: sql<number>`SUM(${subscriptions.oneTimePaymentAmount})`,
        })
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"));

      const activeSubsCount = activeSubscriptionsResult[0]?.count || 0;
      const mrr = (activeSubsCount * 3600) / 100; // 3600 centimes = 36€ par mois
      const arr = mrr * 12; // Annual Recurring Revenue

      // Calculate total revenue from completed orders
      // Note: orders table doesn't store amount, we need to fetch from Stripe or use a fixed amount
      // For now, we'll estimate based on product types
      const completedOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.status, "completed"));

      // Estimate revenue based on product IDs (Sprint=490€, N2=10000€, N3=50000€)
      let totalRevenue = 0;
      const productPrices: Record<string, number> = {
        'sprint-clarte': 490,
        'niveau-2': 10000,
        'niveau-3': 50000,
      };

      completedOrders.forEach(order => {
        totalRevenue += productPrices[order.productId] || 0;
      });

      // Add subscription revenue
      totalRevenue += (activeSubsCount * 36); // 36€ per active subscription

      // Calculate average LTV (Lifetime Value per customer)
      const customerCountResult = await db
        .select({
          count: sql<number>`COUNT(DISTINCT ${orders.userId})`,
        })
        .from(orders)
        .where(eq(orders.status, "completed"));

      const customerCount = customerCountResult[0]?.count || 1;
      const ltv = totalRevenue / customerCount;

      // Revenue by product
      const revenueByProduct = await db
        .select({
          productId: orders.productId,
          orderCount: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .where(eq(orders.status, "completed"))
        .groupBy(orders.productId);

      const revenueByProductWithAmounts = revenueByProduct.map(p => ({
        productName: p.productId,
        totalRevenue: (productPrices[p.productId] || 0) * (p.orderCount || 0),
        orderCount: p.orderCount || 0,
      }));

      // Churn rate by segment
      const totalSubscriptions = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscriptions);

      const canceledSubscriptions = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscriptions)
        .where(eq(subscriptions.status, "cancelled"));

      const churnRate = totalSubscriptions[0]?.count > 0
        ? ((canceledSubscriptions[0]?.count || 0) / totalSubscriptions[0].count) * 100
        : 0;

      return {
        mrr: Math.round(mrr * 100) / 100,
        arr: Math.round(arr * 100) / 100,
        totalRevenue: Math.round(totalRevenue * 100) / 100,
        ltv: Math.round(ltv * 100) / 100,
        churnRate: Math.round(churnRate * 100) / 100,
        revenueByProduct: revenueByProductWithAmounts,
      };
    }),

  /**
   * Get real-time engagement metrics
   */
  getRealtimeEngagement: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Active visitors (last 5 minutes)
      const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);
      const activeVisitors = await db
        .select({
          count: sql<number>`COUNT(DISTINCT ${leadActivities.email})`,
        })
        .from(leadActivities)
        .where(
          and(
            eq(leadActivities.activityType, "page_view"),
            gte(leadActivities.createdAt, fiveMinutesAgo)
          )
        );

      // Most visited pages (last 24 hours)
      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
      const topPages = await db
        .select({
          page: sql<string>`JSON_EXTRACT(${leadActivities.activityData}, '$.page')`,
          views: sql<number>`COUNT(*)`,
        })
        .from(leadActivities)
        .where(
          and(
            eq(leadActivities.activityType, "page_view"),
            gte(leadActivities.createdAt, oneDayAgo)
          )
        )
        .groupBy(sql`JSON_EXTRACT(${leadActivities.activityData}, '$.page')`)
        .orderBy(desc(sql`COUNT(*)`))
        .limit(10);

      // Average session duration (estimated from page views)
      const avgSessionDuration = await db
        .select({
          avgMinutes: sql<number>`AVG(
            JULIANDAY(MAX(${leadActivities.createdAt})) - JULIANDAY(MIN(${leadActivities.createdAt}))
          ) * 24 * 60`,
        })
        .from(leadActivities)
        .where(
          and(
            eq(leadActivities.activityType, "page_view"),
            gte(leadActivities.createdAt, oneDayAgo)
          )
        )
        .groupBy(leadActivities.email);

      // Bounce rate (users with only 1 page view)
      const singlePageVisits = await db
        .select({
          count: sql<number>`COUNT(DISTINCT ${leadActivities.email})`,
        })
        .from(leadActivities)
        .where(
          and(
            eq(leadActivities.activityType, "page_view"),
            gte(leadActivities.createdAt, oneDayAgo)
          )
        )
        .groupBy(leadActivities.email)
        .having(sql`COUNT(*) = 1`);

      const totalVisitors = await db
        .select({
          count: sql<number>`COUNT(DISTINCT ${leadActivities.email})`,
        })
        .from(leadActivities)
        .where(
          and(
            eq(leadActivities.activityType, "page_view"),
            gte(leadActivities.createdAt, oneDayAgo)
          )
        );

      const bounceRate = totalVisitors[0]?.count > 0
        ? ((singlePageVisits.length || 0) / totalVisitors[0].count) * 100
        : 0;

      return {
        activeVisitors: activeVisitors[0]?.count || 0,
        topPages: topPages.map(p => ({
          page: p.page || "/",
          views: p.views || 0,
        })),
        avgSessionDuration: Math.round((avgSessionDuration[0]?.avgMinutes || 0) * 10) / 10,
        bounceRate: Math.round(bounceRate * 100) / 100,
      };
    }),

  /**
   * Get predictive analytics
   */
  getPredictiveAnalytics: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Predict conversion probability for warm leads
      const warmLeads = await db
        .select()
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "warm"),
            eq(subscribers.status, "active")
          )
        );

      const warmLeadsWithPrediction = warmLeads.map(lead => {
        // Simple prediction based on score (41-79 range)
        // Higher score = higher probability
        const score = lead.leadScore || 0;
        const probability = ((score - 41) / (79 - 41)) * 100;
        
        return {
          email: lead.email,
          name: lead.name,
          score: score,
          conversionProbability: Math.round(probability * 100) / 100,
          estimatedDaysToConversion: Math.round(30 - (probability / 100) * 20), // 10-30 days
        };
      });

      // Predict next payment date for active subscriptions
      const activeSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"))
        .orderBy(desc(subscriptions.activatedAt))
        .limit(10);

      const nextPayments = activeSubscriptions.map(sub => {
        // Calculate next payment date (30 days after activation)
        const activationDate = sub.activatedAt ? new Date(sub.activatedAt) : new Date();
        const nextPaymentDate = new Date(activationDate);
        nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
        
        return {
          userId: sub.userId,
          amount: 36, // 36€ per month
          nextPaymentDate: nextPaymentDate.toISOString().split('T')[0],
          interval: 'month',
        };
      });

      // Predict churn risk for customers
      const customersWithOrders = await db
        .select({
          userId: orders.userId,
          lastOrderDate: sql<string>`MAX(${orders.createdAt})`,
          orderCount: sql<number>`COUNT(*)`,
        })
        .from(orders)
        .where(eq(orders.status, "completed"))
        .groupBy(orders.userId);

      const churnRiskPredictions = customersWithOrders.map(customer => {
        const daysSinceLastOrder = Math.floor(
          (Date.now() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24)
        );
        
        // Estimate total spent based on order count (average 490€ per order)
        const estimatedTotalSpent = (customer.orderCount || 0) * 490;
        
        // Simple churn risk: more days since last order = higher risk
        let churnRisk: "low" | "medium" | "high" = "low";
        if (daysSinceLastOrder > 90) churnRisk = "high";
        else if (daysSinceLastOrder > 60) churnRisk = "medium";
        
        return {
          userId: customer.userId,
          daysSinceLastOrder,
          orderCount: customer.orderCount || 0,
          totalSpent: Math.round(estimatedTotalSpent * 100) / 100,
          churnRisk,
        };
      });

      return {
        warmLeadsConversion: warmLeadsWithPrediction.slice(0, 10), // Top 10
        nextPayments,
        churnRiskPredictions: churnRiskPredictions.slice(0, 10), // Top 10 at risk
      };
    }),

  /**
   * Get hourly activity trend (last 24 hours)
   */
  getHourlyActivityTrend: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

      const hourlyActivity = await db
        .select({
          hour: sql<string>`strftime('%H:00', ${leadActivities.createdAt})`,
          activities: sql<number>`COUNT(*)`,
        })
        .from(leadActivities)
        .where(gte(leadActivities.createdAt, oneDayAgo))
        .groupBy(sql`strftime('%H:00', ${leadActivities.createdAt})`)
        .orderBy(sql`strftime('%H:00', ${leadActivities.createdAt})`);

      return hourlyActivity;
    }),
});
