import { publicProcedure, router } from "./_core/trpc";
import { z } from "zod";
import {
  cronDailyHonoficationTasks,
  cronSendReminders,
  cronSendFormalNotices,
} from "./services/emailAutomationService";
import {
  runAllIntegrations,
} from "./services/apiIntegrationService";
import {
  runOSINTForAllBeneficiaries,
} from "./services/osintScrapingService";

/**
 * Router pour les Cron Jobs d'Honofication
 * 
 * Endpoints publics (protégés par secret key) pour exécuter les tâches automatiques :
 * - /api/cron/honofication-daily : Tâche quotidienne complète (emails + détections)
 * - /api/cron/send-reminders : Envoyer les rappels (J+20)
 * - /api/cron/send-formal-notices : Envoyer les mises en demeure (J+30)
 * - /api/cron/run-integrations : Exécuter toutes les intégrations API
 * - /api/cron/run-osint : Exécuter le scraping OSINT
 */

export const cronRouter = router({
  /**
   * Tâche quotidienne complète d'honofication
   * À exécuter tous les jours à 9h00
   * 
   * Crontab : 0 9 * * * curl "https://sionohmair.com/api/cron/honofication-daily?secret=YOUR_SECRET"
   */
  honoficationDaily: publicProcedure
    .input(z.object({
      secret: z.string(),
    }))
    .mutation(async ({ input }: { input: { secret: string } }) => {
      // Vérifier le secret
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      console.log("🤖 Starting daily honofication cron job...");
      
      const result = await cronDailyHonoficationTasks();
      
      console.log("✅ Daily honofication cron job completed");
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        reminders: result.reminders,
        formalNotices: result.formalNotices,
      };
    }),

  /**
   * Envoyer uniquement les rappels (J+20)
   */
  sendReminders: publicProcedure
    .input(z.object({
      secret: z.string(),
    }))
    .mutation(async ({ input }: { input: { secret: string } }) => {
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      console.log("📧 Sending reminders...");
      
      const result = await cronSendReminders();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        ...result,
      };
    }),

  /**
   * Envoyer uniquement les mises en demeure (J+30)
   */
  sendFormalNotices: publicProcedure
    .input(z.object({
      secret: z.string(),
    }))
    .mutation(async ({ input }: { input: { secret: string } }) => {
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      console.log("🚨 Sending formal notices...");
      
      const result = await cronSendFormalNotices();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        ...result,
      };
    }),

  /**
   * Exécuter toutes les intégrations API pour tous les utilisateurs
   * À exécuter quotidiennement ou hebdomadairement
   */
  runIntegrations: publicProcedure
    .input(z.object({
      secret: z.string(),
      userId: z.number().optional(), // Si fourni, exécuter uniquement pour cet utilisateur
    }))
    .mutation(async ({ input }: { input: { secret: string; userId?: number } }) => {
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      console.log("🔌 Running API integrations...");
      
      if (input.userId) {
        // Exécuter pour un utilisateur spécifique
        const result = await runAllIntegrations(input.userId);
        return {
          success: true,
          timestamp: new Date().toISOString(),
          userId: input.userId,
          ...result,
        };
      } else {
        // Exécuter pour tous les utilisateurs (à implémenter)
        // Pour l'instant, retourner un message
        return {
          success: false,
          message: "Global integration run not yet implemented. Please provide userId.",
        };
      }
    }),

  /**
   * Exécuter le scraping OSINT pour tous les bénéficiaires
   * À exécuter hebdomadairement
   * 
   * Crontab : 0 10 * * 1 curl "https://sionohmair.com/api/cron/run-osint?secret=YOUR_SECRET"
   */
  runOSINT: publicProcedure
    .input(z.object({
      secret: z.string(),
    }))
    .mutation(async ({ input }: { input: { secret: string } }) => {
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      console.log("🔍 Running OSINT scraping...");
      
      const result = await runOSINTForAllBeneficiaries();
      
      return {
        success: true,
        timestamp: new Date().toISOString(),
        ...result,
      };
    }),

  /**
   * Obtenir le statut des cron jobs (dernières exécutions, statistiques)
   */
  getStatus: publicProcedure
    .input(z.object({
      secret: z.string(),
    }))
    .query(async ({ input }: { input: { secret: string } }) => {
      const CRON_SECRET = process.env.CRON_SECRET || "dev-secret-change-in-production";
      if (input.secret !== CRON_SECRET) {
        throw new Error("Unauthorized: Invalid cron secret");
      }

      // Pour l'instant, retourner un statut simple
      // À améliorer avec des logs stockés en base de données
      return {
        success: true,
        timestamp: new Date().toISOString(),
        status: "operational",
        message: "Cron jobs are configured and ready. Check server logs for execution history.",
      };
    }),
});
