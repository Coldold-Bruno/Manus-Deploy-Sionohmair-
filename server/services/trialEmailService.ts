import { getDb } from "../db";
import { eq, and, lte, gte, sql } from "drizzle-orm";
import { subscriptions } from "../../drizzle/schema";
import {
  sendTrialReminderJ7,
  sendTrialReminderJ3,
  sendTrialReminderJ1,
  sendTrialReminderJ0,
  sendWelcomeAfterSubscription
} from "../emailTemplates/trialNotifications";

/**
 * Service d'envoi automatique des emails de notification d'essai
 * 
 * Envoie les emails aux moments clés :
 * - J-7 : Il vous reste 7 jours d'essai gratuit
 * - J-3 : Il vous reste 3 jours d'essai gratuit
 * - J-1 : Dernier jour d'essai gratuit
 * - J-0 : Votre essai se termine aujourd'hui - Abonnez-vous
 * - Bienvenue après inscription : Guide complet d'utilisation
 */

/**
 * Vérifie et envoie les emails de notification d'essai
 * À exécuter quotidiennement via cron job
 */
export async function checkAndSendTrialNotifications() {
  const db = await getDb();
  if (!db) {
    console.error("[Trial Emails] Database not available");
    return { success: false, error: "Database not available" };
  }

  const now = new Date();
  const results = {
    j7: { sent: 0, failed: 0 },
    j3: { sent: 0, failed: 0 },
    j1: { sent: 0, failed: 0 },
    j0: { sent: 0, failed: 0 }
  };

  try {
    // Récupérer tous les abonnements en essai
    const trialSubscriptions = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.status, 'trial'));

    for (const subscription of trialSubscriptions) {
      if (!subscription.trialEndDate) continue;

      const daysRemaining = Math.ceil(
        (subscription.trialEndDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );

      // J-7 : 7 jours restants
      if (daysRemaining === 7) {
        try {
          await sendTrialReminderJ7(subscription.userId, subscription.trialEndDate);
          results.j7.sent++;
          console.log(`[Trial Emails] J-7 sent to user ${subscription.userId}`);
        } catch (error) {
          results.j7.failed++;
          console.error(`[Trial Emails] J-7 failed for user ${subscription.userId}:`, error);
        }
      }

      // J-3 : 3 jours restants
      if (daysRemaining === 3) {
        try {
          await sendTrialReminderJ3(subscription.userId, subscription.trialEndDate);
          results.j3.sent++;
          console.log(`[Trial Emails] J-3 sent to user ${subscription.userId}`);
        } catch (error) {
          results.j3.failed++;
          console.error(`[Trial Emails] J-3 failed for user ${subscription.userId}:`, error);
        }
      }

      // J-1 : 1 jour restant
      if (daysRemaining === 1) {
        try {
          await sendTrialReminderJ1(subscription.userId, subscription.trialEndDate);
          results.j1.sent++;
          console.log(`[Trial Emails] J-1 sent to user ${subscription.userId}`);
        } catch (error) {
          results.j1.failed++;
          console.error(`[Trial Emails] J-1 failed for user ${subscription.userId}:`, error);
        }
      }

      // J-0 : Dernier jour (essai se termine aujourd'hui)
      if (daysRemaining === 0) {
        try {
          await sendTrialReminderJ0(subscription.userId);
          results.j0.sent++;
          console.log(`[Trial Emails] J-0 sent to user ${subscription.userId}`);

          // Mettre à jour le statut de l'abonnement en trial_expired
          await db
            .update(subscriptions)
            .set({ status: 'trial_expired' })
            .where(eq(subscriptions.userId, subscription.userId));
        } catch (error) {
          results.j0.failed++;
          console.error(`[Trial Emails] J-0 failed for user ${subscription.userId}:`, error);
        }
      }
    }

    console.log("[Trial Emails] Daily check completed:", results);
    return { success: true, results };
  } catch (error) {
    console.error("[Trial Emails] Error during daily check:", error);
    return { success: false, error: String(error) };
  }
}

/**
 * Envoie l'email de bienvenue après inscription à l'abonnement
 */
export async function sendWelcomeEmailAfterSubscription(userId: number) {
  try {
    await sendWelcomeAfterSubscription(userId);
    console.log(`[Trial Emails] Welcome email sent to user ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`[Trial Emails] Welcome email failed for user ${userId}:`, error);
    return { success: false, error: String(error) };
  }
}
