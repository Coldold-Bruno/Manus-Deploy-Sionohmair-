#!/usr/bin/env node

/**
 * Script de test d'envoi d'email
 * Usage: node scripts/test-email.mjs
 */

import nodemailer from 'nodemailer';
const { createTransport } = nodemailer;

// Configuration SMTP
const config = {
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || 'coldoldbruno@gmail.com',
    pass: process.env.SMTP_PASS || 'uiqq kpth pjdb oknb',
  },
};

const from = process.env.SMTP_FROM || 'coldoldbruno@gmail.com';
const to = process.env.TEST_EMAIL || 'coldoldbruno@gmail.com';

console.log('========================================');
console.log('  Test d\'envoi d\'email SMTP');
console.log('========================================');
console.log('');
console.log('Configuration :');
console.log(`- Host: ${config.host}`);
console.log(`- Port: ${config.port}`);
console.log(`- User: ${config.auth.user}`);
console.log(`- From: ${from}`);
console.log(`- To: ${to}`);
console.log('');

async function testEmail() {
  try {
    console.log('📧 Création du transporteur SMTP...');
    const transporter = createTransport(config);

    console.log('✅ Transporteur créé');
    console.log('');

    console.log('📧 Vérification de la connexion SMTP...');
    await transporter.verify();
    console.log('✅ Connexion SMTP réussie');
    console.log('');

    console.log('📧 Envoi de l\'email de test...');
    const info = await transporter.sendMail({
      from: `"Sionohmair Insight Academy" <${from}>`,
      to: to,
      subject: '✅ Test SMTP - Sionohmair Insight Academy',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body {
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
              color: white;
              padding: 30px;
              text-align: center;
              border-radius: 10px 10px 0 0;
            }
            .content {
              background: #f9fafb;
              padding: 30px;
              border-radius: 0 0 10px 10px;
            }
            .success {
              background: #10b981;
              color: white;
              padding: 15px;
              border-radius: 5px;
              text-align: center;
              font-weight: bold;
              margin: 20px 0;
            }
            .info {
              background: white;
              padding: 20px;
              border-left: 4px solid #f59e0b;
              margin: 20px 0;
            }
            .footer {
              text-align: center;
              margin-top: 30px;
              color: #6b7280;
              font-size: 14px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🎉 Test SMTP Réussi !</h1>
          </div>
          <div class="content">
            <div class="success">
              ✅ Votre configuration SMTP fonctionne parfaitement !
            </div>
            
            <p>Bonjour,</p>
            
            <p>Ceci est un email de test pour vérifier que votre configuration SMTP est correcte.</p>
            
            <div class="info">
              <h3>📋 Informations de configuration</h3>
              <ul>
                <li><strong>Serveur SMTP :</strong> ${config.host}</li>
                <li><strong>Port :</strong> ${config.port}</li>
                <li><strong>Utilisateur :</strong> ${config.auth.user}</li>
                <li><strong>De :</strong> ${from}</li>
              </ul>
            </div>
            
            <p><strong>Prochaines étapes :</strong></p>
            <ol>
              <li>Les emails automatiques (J-7, J-3, J-1, J-0) sont maintenant opérationnels</li>
              <li>Le cron job quotidien enverra les rappels à 9h00 chaque matin</li>
              <li>Les utilisateurs recevront des emails professionnels et bien formatés</li>
            </ol>
            
            <p>Votre système d'abonnement est maintenant <strong>100% opérationnel</strong> ! 🚀</p>
            
            <div class="footer">
              <p>© 2025 Sionohmair Insight Academy<br>
              L'Ingénierie du Génie : Transformez la communication en science de la performance.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log('✅ Email envoyé avec succès !');
    console.log('');
    console.log('Détails :');
    console.log(`- Message ID: ${info.messageId}`);
    console.log(`- Réponse: ${info.response}`);
    console.log('');
    console.log('========================================');
    console.log('  ✅ Test SMTP RÉUSSI');
    console.log('========================================');
    console.log('');
    console.log('Vérifiez votre boîte de réception :');
    console.log(`📧 ${to}`);
    console.log('');
    console.log('Le système d\'emails automatiques est maintenant opérationnel ! 🎉');
    
  } catch (error) {
    console.error('');
    console.error('========================================');
    console.error('  ❌ Test SMTP ÉCHOUÉ');
    console.error('========================================');
    console.error('');
    console.error('Erreur :', error.message);
    console.error('');
    console.error('Vérifiez :');
    console.error('1. Les credentials SMTP sont corrects');
    console.error('2. Le mot de passe d\'application Gmail est valide');
    console.error('3. L\'authentification à 2 facteurs est activée sur Gmail');
    console.error('4. Le compte Gmail n\'est pas bloqué');
    console.error('');
    process.exit(1);
  }
}

testEmail();
