import { Resend } from 'resend';
import {
  getOrderConfirmationEmail,
  getNewsletterWelcomeEmail,
  getArtefactDeliveryEmail,
  getReminderEmail,
  getFeedbackRequestEmail,
  getFollowUpEmail,
} from './emailTemplates';

/**
 * Service d'envoi d'emails avec Resend
 * Plus fiable et professionnel que SMTP classique
 */

// Initialiser Resend avec la clé API
const resend = new Resend(process.env.RESEND_API_KEY);

// Configuration de l'expéditeur par défaut
const DEFAULT_FROM = process.env.SMTP_FROM_EMAIL || 'sionohmair@academy.com';
const DEFAULT_FROM_NAME = process.env.SMTP_FROM_NAME || 'Sionohmair Insight Academy';

/**
 * Envoyer un email générique via Resend
 */
export async function sendEmail(params: {
  to: string;
  subject: string;
  html: string;
  from?: string;
}) {
  const { to, subject, html, from } = params;

  try {
    const data = await resend.emails.send({
      from: from || `${DEFAULT_FROM_NAME} <${DEFAULT_FROM}>`,
      to: [to],
      subject,
      html,
    });

    console.log('✅ Email sent via Resend:', data.data?.id || data);
    return { success: true, messageId: data.data?.id || 'sent' };
  } catch (error) {
    console.error('❌ Error sending email via Resend:', error);
    return { success: false, error };
  }
}

/**
 * Envoyer l'email de confirmation de commande
 */
export async function sendOrderConfirmation(params: {
  to: string;
  orderId: string;
  serviceName: string;
  amount: number;
  customerName?: string;
}) {
  const htmlContent = getOrderConfirmationEmail({
    customerName: params.customerName || 'Client',
    customerEmail: params.to,
    serviceName: params.serviceName,
    amount: params.amount,
    orderDate: new Date().toLocaleDateString('fr-FR'),
    orderId: params.orderId,
  });

  return sendEmail({
    to: params.to,
    subject: `✅ Confirmation de commande #${params.orderId}`,
    html: htmlContent,
  });
}

/**
 * Envoyer l'email de bienvenue newsletter
 */
export async function sendNewsletterWelcome(params: {
  to: string;
}) {
  const htmlContent = getNewsletterWelcomeEmail({
    email: params.to,
  });

  return sendEmail({
    to: params.to,
    subject: '🎉 Bienvenue dans la communauté Sionohmair !',
    html: htmlContent,
  });
}

/**
 * Envoyer l'email de livraison d'artefact
 */
export async function sendArtefactDelivery(params: {
  to: string;
  serviceName: string;
  artefactCount: number;
  dashboardUrl: string;
  customerName?: string;
}) {
  const htmlContent = getArtefactDeliveryEmail({
    customerName: params.customerName || 'Client',
    serviceName: params.serviceName,
    artefactCount: params.artefactCount,
    dashboardUrl: params.dashboardUrl,
  });

  return sendEmail({
    to: params.to,
    subject: `📦 Vos artefacts sont prêts !`,
    html: htmlContent,
  });
}

/**
 * Envoyer un email de rappel
 */
export async function sendReminder(params: {
  to: string;
  customerName: string;
  serviceName: string;
  daysRemaining: number;
}) {
  const htmlContent = getReminderEmail({
    customerName: params.customerName,
    serviceName: params.serviceName,
    daysRemaining: params.daysRemaining,
  });

  return sendEmail({
    to: params.to,
    subject: `⏰ Rappel : ${params.serviceName} - ${params.daysRemaining} jours restants`,
    html: htmlContent,
  });
}

/**
 * Envoyer une demande de feedback
 */
export async function sendFeedbackRequest(params: {
  to: string;
  customerName: string;
  serviceName: string;
  feedbackUrl: string;
}) {
  const htmlContent = getFeedbackRequestEmail({
    customerName: params.customerName,
    serviceName: params.serviceName,
    feedbackUrl: params.feedbackUrl,
  });

  return sendEmail({
    to: params.to,
    subject: '💭 Votre avis nous intéresse !',
    html: htmlContent,
  });
}

/**
 * Envoyer un email de suivi
 */
export async function sendFollowUp(params: {
  to: string;
  customerName: string;
  scoreAvant: number;
  scoreApres: number;
  nextService: string;
  nextServiceUrl: string;
}) {
  const htmlContent = getFollowUpEmail({
    customerName: params.customerName,
    scoreAvant: params.scoreAvant,
    scoreApres: params.scoreApres,
    nextService: params.nextService,
    nextServiceUrl: params.nextServiceUrl,
  });

  return sendEmail({
    to: params.to,
    subject: `🎯 Résultats de votre ${params.nextService}`,
    html: htmlContent,
  });
}

/**
 * Envoyer un email de test pour vérifier la configuration
 */
export async function sendTestEmail(to: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h1 style="color: #0A1929;">✅ Test Resend Réussi !</h1>
      <p>Félicitations ! Votre configuration Resend fonctionne parfaitement.</p>
      <p>Vous pouvez maintenant envoyer des emails professionnels depuis votre application Sionohmair Insight Academy.</p>
      <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 20px 0;">
      <p style="color: #6b7280; font-size: 14px;">
        Cet email a été envoyé depuis <strong>${DEFAULT_FROM}</strong> via Resend.
      </p>
    </div>
  `;

  return sendEmail({
    to,
    subject: '✅ Test de configuration Resend',
    html,
  });
}
