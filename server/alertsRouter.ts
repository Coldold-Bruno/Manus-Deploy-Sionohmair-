/**
 * Router tRPC pour gérer les alertes intelligentes
 */

import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { sendAlert, Alert, AlertType, AlertPriority } from './services/alertService';
import { getDb } from './db';
import { sql } from 'drizzle-orm';

export const alertsRouter = router({
  /**
   * Envoyer une alerte manuelle
   */
  sendManualAlert: protectedProcedure
    .input(z.object({
      type: z.enum(['hot_lead', 'payment_failed', 'churn_risk', 'new_conversion', 'goal_reached', 'trial_expiring', 'high_value_action', 'system_error']),
      priority: z.enum(['low', 'medium', 'high', 'critical']),
      title: z.string(),
      message: z.string(),
      data: z.record(z.string(), z.any()).optional()
    }))
    .mutation(async ({ input }) => {
      const alert: Alert = {
        type: input.type as AlertType,
        priority: input.priority as AlertPriority,
        title: input.title,
        message: input.message,
        data: input.data,
        timestamp: new Date()
      };

      const results = await sendAlert(alert);
      
      return {
        success: results.slack || results.discord,
        slack: results.slack,
        discord: results.discord
      };
    }),

  /**
   * Tester la configuration des webhooks
   */
  testWebhooks: protectedProcedure
    .mutation(async () => {
      const testAlert: Alert = {
        type: 'system_error',
        priority: 'low',
        title: 'Test de Configuration',
        message: 'Ceci est un message de test pour vérifier que les webhooks Slack et Discord fonctionnent correctement.',
        data: {
          'Statut': 'Test réussi',
          'Plateforme': 'Sionohmair Insight Academy'
        },
        timestamp: new Date()
      };

      const results = await sendAlert(testAlert);
      
      return {
        slack: {
          configured: !!process.env.SLACK_WEBHOOK_URL,
          sent: results.slack
        },
        discord: {
          configured: !!process.env.DISCORD_WEBHOOK_URL,
          sent: results.discord
        }
      };
    }),

  /**
   * Récupérer les statistiques d'alertes envoyées
   */
  getAlertStats: protectedProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) {
        return {
          totalLeads: 0,
          hotLeads: 0,
          conversions: 0,
          churnRisks: 0
        };
      }

      // Statistiques des leads
      const leadsStats = await db.execute(sql`
        SELECT 
          COUNT(*) as total,
          SUM(CASE WHEN leadScore >= 80 THEN 1 ELSE 0 END) as hot
        FROM subscribers
      `) as any[];

      // Statistiques des conversions (derniers 30 jours)
      const conversionsStats = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM subscriptions
        WHERE status = 'active'
        AND createdAt >= DATE_SUB(NOW(), INTERVAL 30 DAY)
      `) as any[];

      // Statistiques des risques de churn (essais expirant dans 3 jours)
      const churnStats = await db.execute(sql`
        SELECT COUNT(*) as count
        FROM subscriptions
        WHERE status = 'trial'
        AND trialEndDate <= DATE_ADD(NOW(), INTERVAL 3 DAY)
        AND trialEndDate >= NOW()
      `) as any[];

      return {
        totalLeads: Number((leadsStats as any)[0]?.total || 0),
        hotLeads: Number((leadsStats as any)[0]?.hot || 0),
        conversions: Number((conversionsStats as any)[0]?.count || 0),
        churnRisks: Number((churnStats as any)[0]?.count || 0)
      };
    }),

  /**
   * Récupérer la configuration actuelle des webhooks
   */
  getWebhookConfig: protectedProcedure
    .query(async () => {
      return {
        slack: {
          configured: !!process.env.SLACK_WEBHOOK_URL,
          url: process.env.SLACK_WEBHOOK_URL ? '***' + process.env.SLACK_WEBHOOK_URL.slice(-10) : null
        },
        discord: {
          configured: !!process.env.DISCORD_WEBHOOK_URL,
          url: process.env.DISCORD_WEBHOOK_URL ? '***' + process.env.DISCORD_WEBHOOK_URL.slice(-10) : null
        }
      };
    })
});
