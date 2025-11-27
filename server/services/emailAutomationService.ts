import { getDb } from "../db";
import { eq, and, lte, isNull } from "drizzle-orm";
import {
  presumedRoyalties,
  nftBeneficiaries,
  users,
} from "../../drizzle/schema";
import {
  getNotificationEmail,
  getReminderEmail,
  getFormalNoticeEmail,
  getPaymentConfirmationEmail,
  type EmailData,
} from "../templates/honoficationEmails";

/**
 * Service d'Automatisation des Emails d'Honofication
 * 
 * Gère l'envoi automatique des emails selon le cycle de recouvrement :
 * - J+0 : Notification initiale
 * - J+20 : Rappel amiable
 * - J+30 : Mise en demeure
 * - Confirmation de paiement (immédiat)
 */

/**
 * Envoyer un email (fonction générique)
 * En production, utiliser un service d'emailing (SendGrid, Mailgun, etc.)
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text: string
): Promise<boolean> {
  try {
    // En production, utiliser un vrai service d'emailing
    // const sgMail = require('@sendgrid/mail');
    // sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    // await sgMail.send({ to, from: 'noreply@sionohmair.com', subject, html, text });
    
    // Pour la démo, logger l'email
    console.log(`
📧 EMAIL ENVOYÉ
To: ${to}
Subject: ${subject}
---
${text}
---
    `);
    
    return true;
  } catch (error: any) {
    console.error("Email sending error:", error);
    return false;
  }
}

/**
 * Envoyer la notification initiale de redevance présumée
 */
export async function sendRoyaltyNotification(
  royaltyId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    // Récupérer la redevance avec les données du bénéficiaire
    const [royalty] = await db.select({
      royalty: presumedRoyalties,
      beneficiary: nftBeneficiaries,
      user: users,
    })
      .from(presumedRoyalties)
      .leftJoin(nftBeneficiaries, eq(presumedRoyalties.beneficiaryId, nftBeneficiaries.id))
      .leftJoin(users, eq(presumedRoyalties.userId, users.id))
      .where(eq(presumedRoyalties.id, royaltyId));

    if (!royalty || !royalty.user) {
      console.error("Royalty or user not found");
      return false;
    }

    const emailData: EmailData = {
      recipientName: royalty.user.name || "Utilisateur",
      recipientEmail: royalty.user.email || "",
      royaltyAmount: royalty.royalty.presumedRoyaltyAmount,
      presumedBenefit: royalty.royalty.presumedBenefit,
      royaltyRate: royalty.royalty.royaltyRate,
      confidenceScore: (parseFloat(royalty.royalty.confidenceCoefficient) * 100).toFixed(0),
      indicesSummary: royalty.royalty.indicesSummary || "Indices détectés automatiquement",
      dueDate: new Date(royalty.royalty.dueDate).toLocaleDateString("fr-FR"),
      dashboardUrl: "https://sionohmair.com/dashboard/honofication",
      contestUrl: "https://sionohmair.com/dashboard/honofication?action=contest",
      paymentUrl: `https://sionohmair.com/dashboard/honofication?action=pay&royaltyId=${royaltyId}`,
    };

    const email = getNotificationEmail(emailData);
    
    return await sendEmail(
      emailData.recipientEmail,
      email.subject,
      email.html,
      email.text
    );
  } catch (error: any) {
    console.error("Error sending royalty notification:", error);
    return false;
  }
}

/**
 * Envoyer un rappel amiable (J+20)
 */
export async function sendReminderEmail(
  royaltyId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const [royalty] = await db.select({
      royalty: presumedRoyalties,
      user: users,
    })
      .from(presumedRoyalties)
      .leftJoin(users, eq(presumedRoyalties.userId, users.id))
      .where(eq(presumedRoyalties.id, royaltyId));

    if (!royalty || !royalty.user) return false;

    const emailData: EmailData = {
      recipientName: royalty.user.name || "Utilisateur",
      recipientEmail: royalty.user.email || "",
      royaltyAmount: royalty.royalty.presumedRoyaltyAmount,
      presumedBenefit: royalty.royalty.presumedBenefit,
      royaltyRate: royalty.royalty.royaltyRate,
      confidenceScore: (parseFloat(royalty.royalty.confidenceCoefficient) * 100).toFixed(0),
      indicesSummary: royalty.royalty.indicesSummary || "",
      dueDate: new Date(royalty.royalty.dueDate).toLocaleDateString("fr-FR"),
      dashboardUrl: "https://sionohmair.com/dashboard/honofication",
      contestUrl: "https://sionohmair.com/dashboard/honofication?action=contest",
      paymentUrl: `https://sionohmair.com/dashboard/honofication?action=pay&royaltyId=${royaltyId}`,
    };

    const email = getReminderEmail(emailData);
    
    return await sendEmail(
      emailData.recipientEmail,
      email.subject,
      email.html,
      email.text
    );
  } catch (error: any) {
    console.error("Error sending reminder:", error);
    return false;
  }
}

/**
 * Envoyer une mise en demeure (J+30)
 */
export async function sendFormalNoticeEmail(
  royaltyId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const [royalty] = await db.select({
      royalty: presumedRoyalties,
      user: users,
    })
      .from(presumedRoyalties)
      .leftJoin(users, eq(presumedRoyalties.userId, users.id))
      .where(eq(presumedRoyalties.id, royaltyId));

    if (!royalty || !royalty.user) return false;

    const originalAmount = parseFloat(royalty.royalty.presumedRoyaltyAmount);
    const newAmount = originalAmount * 1.05;
    const bonusAmount = newAmount - originalAmount;

    const emailData: EmailData = {
      recipientName: royalty.user.name || "Utilisateur",
      recipientEmail: royalty.user.email || "",
      royaltyAmount: originalAmount.toFixed(2),
      newAmount: newAmount.toFixed(2),
      bonusAmount: bonusAmount.toFixed(2),
      presumedBenefit: royalty.royalty.presumedBenefit,
      royaltyRate: royalty.royalty.royaltyRate,
      confidenceScore: (parseFloat(royalty.royalty.confidenceCoefficient) * 100).toFixed(0),
      indicesSummary: royalty.royalty.indicesSummary || "",
      dueDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toLocaleDateString("fr-FR"),
      dashboardUrl: "https://sionohmair.com/dashboard/honofication",
      contestUrl: "https://sionohmair.com/dashboard/honofication?action=contest",
      paymentUrl: `https://sionohmair.com/dashboard/honofication?action=pay&royaltyId=${royaltyId}`,
    };

    const email = getFormalNoticeEmail(emailData);
    
    return await sendEmail(
      emailData.recipientEmail,
      email.subject,
      email.html,
      email.text
    );
  } catch (error: any) {
    console.error("Error sending formal notice:", error);
    return false;
  }
}

/**
 * Envoyer une confirmation de paiement
 */
export async function sendPaymentConfirmation(
  royaltyId: number
): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    const [royalty] = await db.select({
      royalty: presumedRoyalties,
      user: users,
    })
      .from(presumedRoyalties)
      .leftJoin(users, eq(presumedRoyalties.userId, users.id))
      .where(eq(presumedRoyalties.id, royaltyId));

    if (!royalty || !royalty.user) return false;

    const emailData: EmailData = {
      recipientName: royalty.user.name || "Utilisateur",
      recipientEmail: royalty.user.email || "",
      royaltyAmount: royalty.royalty.paidAmount || royalty.royalty.presumedRoyaltyAmount,
      presumedBenefit: royalty.royalty.presumedBenefit,
      royaltyRate: royalty.royalty.royaltyRate,
      confidenceScore: (parseFloat(royalty.royalty.confidenceCoefficient) * 100).toFixed(0),
      indicesSummary: royalty.royalty.indicesSummary || "",
      dueDate: new Date(royalty.royalty.dueDate).toLocaleDateString("fr-FR"),
      dashboardUrl: "https://sionohmair.com/dashboard/nft-gratitude",
      contestUrl: "",
      paymentUrl: "",
    };

    const email = getPaymentConfirmationEmail(emailData);
    
    return await sendEmail(
      emailData.recipientEmail,
      email.subject,
      email.html,
      email.text
    );
  } catch (error: any) {
    console.error("Error sending payment confirmation:", error);
    return false;
  }
}

/**
 * CRON JOB : Envoyer les rappels amiables (J+20)
 * À exécuter quotidiennement
 */
export async function cronSendReminders(): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const db = await getDb();
  if (!db) return { processed: 0, sent: 0, failed: 0 };

  try {
    // Récupérer les redevances notifiées il y a 20 jours (et pas encore rappelées)
    const twentyDaysAgo = new Date();
    twentyDaysAgo.setDate(twentyDaysAgo.getDate() - 20);

    const royaltiesToRemind = await db.select()
      .from(presumedRoyalties)
      .where(and(
        eq(presumedRoyalties.recoveryStatus, "notified"),
        lte(presumedRoyalties.notifiedAt, twentyDaysAgo),
        isNull(presumedRoyalties.remindedAt)
      ));

    let sent = 0;
    let failed = 0;

    for (const royalty of royaltiesToRemind) {
      const success = await sendReminderEmail(royalty.id);
      
      if (success) {
        // Mettre à jour le statut
        await db.update(presumedRoyalties)
          .set({
            recoveryStatus: "reminded",
            remindedAt: new Date(),
          })
          .where(eq(presumedRoyalties.id, royalty.id));
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`Cron reminders: ${sent} sent, ${failed} failed`);
    return { processed: royaltiesToRemind.length, sent, failed };
  } catch (error: any) {
    console.error("Cron reminders error:", error);
    return { processed: 0, sent: 0, failed: 0 };
  }
}

/**
 * CRON JOB : Envoyer les mises en demeure (J+30)
 * À exécuter quotidiennement
 */
export async function cronSendFormalNotices(): Promise<{
  processed: number;
  sent: number;
  failed: number;
}> {
  const db = await getDb();
  if (!db) return { processed: 0, sent: 0, failed: 0 };

  try {
    // Récupérer les redevances dont la date limite est dépassée
    const today = new Date();

    const royaltiesOverdue = await db.select()
      .from(presumedRoyalties)
      .where(and(
        eq(presumedRoyalties.recoveryStatus, "reminded"),
        lte(presumedRoyalties.dueDate, today),
        isNull(presumedRoyalties.formalNoticeAt)
      ));

    let sent = 0;
    let failed = 0;

    for (const royalty of royaltiesOverdue) {
      const success = await sendFormalNoticeEmail(royalty.id);
      
      if (success) {
        // Appliquer la majoration de 5%
        const newAmount = parseFloat(royalty.presumedRoyaltyAmount) * 1.05;
        
        await db.update(presumedRoyalties)
          .set({
            recoveryStatus: "formal_notice",
            formalNoticeAt: new Date(),
            presumedRoyaltyAmount: newAmount.toFixed(2),
          })
          .where(eq(presumedRoyalties.id, royalty.id));
        sent++;
      } else {
        failed++;
      }
    }

    console.log(`Cron formal notices: ${sent} sent, ${failed} failed`);
    return { processed: royaltiesOverdue.length, sent, failed };
  } catch (error: any) {
    console.error("Cron formal notices error:", error);
    return { processed: 0, sent: 0, failed: 0 };
  }
}

/**
 * CRON JOB PRINCIPAL : Exécuter toutes les tâches automatiques
 * À exécuter quotidiennement à 9h00
 */
export async function cronDailyHonoficationTasks(): Promise<{
  reminders: { processed: number; sent: number; failed: number };
  formalNotices: { processed: number; sent: number; failed: number };
}> {
  console.log("🤖 Starting daily honofication tasks...");
  
  const reminders = await cronSendReminders();
  const formalNotices = await cronSendFormalNotices();
  
  console.log(`✅ Daily tasks completed:
- Reminders: ${reminders.sent}/${reminders.processed} sent
- Formal notices: ${formalNotices.sent}/${formalNotices.processed} sent
  `);
  
  return { reminders, formalNotices };
}
