import nodemailer from 'nodemailer';
import { ENV } from './_core/env';

/**
 * Service d'envoi d'emails
 * Utilise nodemailer avec configuration SMTP
 */

// Créer le transporteur SMTP
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true', // true pour port 465, false pour autres ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

/**
 * Envoyer un email de confirmation de commande
 */
export async function sendOrderConfirmationEmail(params: {
  to: string;
  customerName: string;
  productName: string;
  productPrice: string;
  orderId: number;
  sessionId: string;
}) {
  const { to, customerName, productName, productPrice, orderId, sessionId } = params;

  const htmlContent = `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmation de commande</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
    <h1 style="color: #F59E0B; margin: 0; font-size: 28px;">✨ Sionohmair Insight Academy</h1>
    <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">L'Ingénierie du Génie</p>
  </div>
  
  <div style="background: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-top: none; border-radius: 0 0 10px 10px;">
    <h2 style="color: #0A1929; margin-top: 0;">Confirmation de votre commande</h2>
    
    <p>Bonjour ${customerName},</p>
    
    <p>Nous vous confirmons la réception de votre paiement pour :</p>
    
    <div style="background: #f8f9fa; padding: 20px; border-left: 4px solid #F59E0B; margin: 20px 0;">
      <h3 style="margin: 0 0 10px 0; color: #0A1929;">${productName}</h3>
      <p style="margin: 5px 0; font-size: 24px; font-weight: bold; color: #F59E0B;">${productPrice}</p>
      <p style="margin: 5px 0; font-size: 12px; color: #666;">
        Numéro de commande : #${orderId}<br>
        Transaction : ${sessionId}
      </p>
    </div>
    
    <h3 style="color: #0A1929; margin-top: 30px;">Prochaines étapes :</h3>
    
    <ol style="padding-left: 20px;">
      <li style="margin-bottom: 10px;">
        <strong>Prise de contact</strong> : Bruno Coldold vous contactera sous 24-48h pour planifier le démarrage de votre projet
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Accès au Dashboard</strong> : Vous pouvez dès maintenant consulter votre commande et télécharger vos artefacts (dès qu'ils seront disponibles) sur votre dashboard client
      </li>
      <li style="margin-bottom: 10px;">
        <strong>Facture</strong> : Votre facture sera générée et envoyée dans les prochaines 24h
      </li>
    </ol>
    
    <div style="background: #e8f5e9; padding: 15px; border-radius: 5px; margin: 20px 0;">
      <p style="margin: 0; color: #2e7d32;">
        <strong>✓ Paiement sécurisé confirmé</strong><br>
        <small>Votre paiement a été traité de manière sécurisée par Stripe</small>
      </p>
    </div>
    
    <p style="margin-top: 30px;">
      Si vous avez des questions, n'hésitez pas à nous contacter à l'adresse : 
      <a href="mailto:contact@sionohmair.com" style="color: #F59E0B;">contact@sionohmair.com</a>
    </p>
    
    <p style="margin-top: 20px;">
      Cordialement,<br>
      <strong>Bruno Coldold</strong><br>
      Fondateur, Sionohmair Insight Academy
    </p>
  </div>
  
  <div style="text-align: center; padding: 20px; color: #666; font-size: 12px;">
    <p>© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés.</p>
    <p>Propriété intellectuelle protégée</p>
  </div>
</body>
</html>
  `;

  const textContent = `
Confirmation de votre commande

Bonjour ${customerName},

Nous vous confirmons la réception de votre paiement pour :

${productName} - ${productPrice}
Numéro de commande : #${orderId}
Transaction : ${sessionId}

Prochaines étapes :

1. Prise de contact : Bruno Coldold vous contactera sous 24-48h pour planifier le démarrage de votre projet
2. Accès au Dashboard : Vous pouvez dès maintenant consulter votre commande sur votre dashboard client
3. Facture : Votre facture sera générée et envoyée dans les prochaines 24h

Si vous avez des questions, n'hésitez pas à nous contacter à : contact@sionohmair.com

Cordialement,
Bruno Coldold
Fondateur, Sionohmair Insight Academy

© 2025 Bruno Coldold | Sionohmair Insight Academy. Tous droits réservés.
  `;

  try {
    const info = await transporter.sendMail({
      from: `"Sionohmair Insight Academy" <${process.env.SMTP_USER}>`,
      to: to,
      subject: `Confirmation de commande #${orderId} - ${productName}`,
      text: textContent,
      html: htmlContent,
    });

    console.log('[Email] Order confirmation sent:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error: any) {
    console.error('[Email] Error sending order confirmation:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Vérifier la configuration SMTP
 */
export async function verifyEmailConfig() {
  try {
    await transporter.verify();
    console.log('[Email] SMTP configuration verified successfully');
    return true;
  } catch (error: any) {
    console.error('[Email] SMTP configuration error:', error.message);
    return false;
  }
}
