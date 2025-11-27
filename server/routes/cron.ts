/**
 * Routes de cron jobs pour les tâches automatiques
 * À exécuter quotidiennement via un service externe (cron, scheduler, etc.)
 */

import { Router } from "express";
import { checkAndSendTrialNotifications } from "../services/trialEmailService";

const router = Router();

/**
 * Cron job quotidien : Vérifier les essais et envoyer les emails de notification
 * À exécuter tous les jours à 9h00
 * 
 * Endpoint: GET /api/cron/check-trial-expirations
 */
router.get("/check-trial-expirations", async (req, res) => {
  try {
    console.log("[Cron] Starting daily trial expiration check...");
    
    const result = await checkAndSendTrialNotifications();
    
    if (result.success) {
      console.log("[Cron] Daily trial expiration check completed successfully");
      res.json({
        success: true,
        message: "Trial expiration check completed",
        results: result.results
      });
    } else {
      console.error("[Cron] Daily trial expiration check failed:", result.error);
      res.status(500).json({
        success: false,
        error: result.error
      });
    }
  } catch (error: any) {
    console.error("[Cron] Error during trial expiration check:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Unknown error"
    });
  }
});

export default router;
