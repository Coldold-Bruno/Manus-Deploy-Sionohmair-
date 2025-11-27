/**
 * Templates d'Emails pour le Système d'Honofication
 * 
 * Emails automatiques pour :
 * - Notification de redevance présumée (J+0)
 * - Rappel amiable (J+20)
 * - Mise en demeure (J+30)
 * - Confirmation de paiement
 * - Réponse à contestation
 * - Décision arbitrale
 */

export interface EmailTemplate {
  subject: string;
  html: string;
  text: string;
}

export interface EmailData {
  recipientName: string;
  recipientEmail: string;
  royaltyAmount: string;
  presumedBenefit: string;
  royaltyRate: string;
  confidenceScore: string;
  indicesSummary: string;
  dueDate: string;
  dashboardUrl: string;
  contestUrl: string;
  paymentUrl: string;
  newAmount?: string;
  bonusAmount?: string;
  contestationResponse?: string;
  arbitrationDecision?: string;
}

/**
 * Email de notification initiale (J+0)
 */
export function getNotificationEmail(data: EmailData): EmailTemplate {
  return {
    subject: `🔔 Redevance de Gratitude Détectée : ${data.royaltyAmount} €`,
    
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #667eea; }
    .amount { font-size: 32px; font-weight: bold; color: #667eea; margin: 10px 0; }
    .button { display: inline-block; background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .button-secondary { background: #6b7280; }
    .footer { text-align: center; margin-top: 30px; color: #6b7280; font-size: 14px; }
    .highlight { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🌟 Redevance de Gratitude Détectée</h1>
      <p>Système d'Honofication Sionohmair</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.recipientName},</p>
      
      <p>Nous avons détecté des <strong>bénéfices générés</strong> grâce aux ressources gratuites de Sionohmair Insight Academy que vous avez utilisées.</p>
      
      <div class="card">
        <h2>📊 Détails de la Redevance</h2>
        <p><strong>Bénéfice présumé détecté :</strong> ${data.presumedBenefit} €</p>
        <p><strong>Taux de redevance :</strong> ${data.royaltyRate}%</p>
        <p><strong>Coefficient de confiance :</strong> ${data.confidenceScore}%</p>
        <p><strong>Redevance due :</strong></p>
        <div class="amount">${data.royaltyAmount} €</div>
        <p><strong>Date limite de paiement :</strong> ${data.dueDate}</p>
      </div>
      
      <div class="card">
        <h3>🔍 Indices détectés :</h3>
        <p>${data.indicesSummary}</p>
      </div>
      
      <div class="highlight">
        <strong>💡 Bonus de Paiement Rapide :</strong> Payez dans les 7 jours et bénéficiez d'une réduction de 10% !
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.paymentUrl}" class="button">💳 Payer ${data.royaltyAmount} €</a>
        <a href="${data.contestUrl}" class="button button-secondary">📝 Contester</a>
      </div>
      
      <div class="card">
        <h3>ℹ️ Principe de l'Honofication</h3>
        <p>L'honofication repose sur le principe de <strong>gratitude économique</strong> : les ressources sont gratuites au départ, mais si elles génèrent des bénéfices, une contribution proportionnelle (${data.royaltyRate}%) est attendue.</p>
        <p>Cette contribution enrichit le NFT Source (×22.67) et augmente votre niveau de gratitude, vous donnant accès à des avantages exclusifs.</p>
      </div>
      
      <div class="card">
        <h3>🤝 Vos Options</h3>
        <ol>
          <li><strong>Payer maintenant</strong> : Réglez ${data.royaltyAmount} € et enrichissez votre NFT de Gratitude</li>
          <li><strong>Contester</strong> : Si vous pensez que cette redevance est incorrecte, vous avez 30 jours pour contester</li>
          <li><strong>Déclarer volontairement</strong> : Déclarez vos bénéfices vous-même et bénéficiez d'un bonus de 10%</li>
        </ol>
      </div>
      
      <p>Pour plus de détails, consultez votre <a href="${data.dashboardUrl}">Dashboard d'Honofication</a>.</p>
      
      <div class="footer">
        <p>Sionohmair Insight Academy - L'Ingénierie du Génie</p>
        <p>Cet email est envoyé automatiquement par le système d'honofication.</p>
        <p>En cas de question, consultez les <a href="https://sionohmair.com/lois-honofication">Lois d'Honofication</a>.</p>
      </div>
    </div>
  </div>
</body>
</html>
    `,
    
    text: `
Bonjour ${data.recipientName},

Nous avons détecté des bénéfices générés grâce aux ressources gratuites de Sionohmair Insight Academy.

DÉTAILS DE LA REDEVANCE :
- Bénéfice présumé : ${data.presumedBenefit} €
- Taux de redevance : ${data.royaltyRate}%
- Coefficient de confiance : ${data.confidenceScore}%
- Redevance due : ${data.royaltyAmount} €
- Date limite : ${data.dueDate}

INDICES DÉTECTÉS :
${data.indicesSummary}

BONUS : Payez dans les 7 jours et bénéficiez d'une réduction de 10% !

VOS OPTIONS :
1. Payer maintenant : ${data.paymentUrl}
2. Contester : ${data.contestUrl}
3. Voir le dashboard : ${data.dashboardUrl}

Sionohmair Insight Academy - L'Ingénierie du Génie
    `,
  };
}

/**
 * Email de rappel amiable (J+20)
 */
export function getReminderEmail(data: EmailData): EmailTemplate {
  return {
    subject: `⏰ Rappel : Redevance de ${data.royaltyAmount} € à régler avant le ${data.dueDate}`,
    
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #f59e0b; }
    .amount { font-size: 32px; font-weight: bold; color: #f59e0b; margin: 10px 0; }
    .button { display: inline-block; background: #f59e0b; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .warning { background: #fef3c7; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #f59e0b; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>⏰ Rappel Amiable</h1>
      <p>Redevance de Gratitude en Attente</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.recipientName},</p>
      
      <p>Nous vous rappelons qu'une redevance de gratitude est en attente de règlement.</p>
      
      <div class="card">
        <h2>💰 Montant à Régler</h2>
        <div class="amount">${data.royaltyAmount} €</div>
        <p><strong>Date limite :</strong> ${data.dueDate}</p>
        <p><strong>Jours restants :</strong> 10 jours</p>
      </div>
      
      <div class="warning">
        <strong>⚠️ Attention :</strong> Si cette redevance n'est pas réglée ou contestée avant le ${data.dueDate}, une mise en demeure sera envoyée avec une majoration de 5%.
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.paymentUrl}" class="button">💳 Payer Maintenant</a>
      </div>
      
      <p>Pour toute question, consultez votre <a href="${data.dashboardUrl}">Dashboard d'Honofication</a>.</p>
      
      <p>Cordialement,<br>L'équipe Sionohmair</p>
    </div>
  </div>
</body>
</html>
    `,
    
    text: `
Bonjour ${data.recipientName},

RAPPEL AMIABLE

Une redevance de gratitude est en attente de règlement :
- Montant : ${data.royaltyAmount} €
- Date limite : ${data.dueDate}
- Jours restants : 10 jours

⚠️ ATTENTION : Si cette redevance n'est pas réglée ou contestée avant le ${data.dueDate}, une mise en demeure sera envoyée avec une majoration de 5%.

Payer maintenant : ${data.paymentUrl}
Dashboard : ${data.dashboardUrl}

L'équipe Sionohmair
    `,
  };
}

/**
 * Email de mise en demeure (J+30)
 */
export function getFormalNoticeEmail(data: EmailData): EmailTemplate {
  return {
    subject: `🚨 MISE EN DEMEURE : Redevance de ${data.newAmount} € (majoration appliquée)`,
    
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #dc2626; }
    .amount { font-size: 32px; font-weight: bold; color: #dc2626; margin: 10px 0; }
    .button { display: inline-block; background: #dc2626; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 10px 5px; }
    .critical { background: #fee2e2; padding: 15px; border-radius: 6px; margin: 15px 0; border-left: 4px solid #dc2626; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🚨 MISE EN DEMEURE</h1>
      <p>Dernier Délai Avant Arbitrage</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.recipientName},</p>
      
      <p><strong>Ceci est une mise en demeure formelle.</strong></p>
      
      <p>La redevance de gratitude notifiée le [DATE] n'a pas été réglée dans les délais impartis. Conformément aux Lois d'Honofication, une majoration de 5% a été appliquée.</p>
      
      <div class="card">
        <h2>💰 Nouveau Montant à Régler</h2>
        <p><s>Montant initial : ${data.royaltyAmount} €</s></p>
        <p><strong>Majoration 5% :</strong> +${data.bonusAmount} €</p>
        <div class="amount">${data.newAmount} €</div>
        <p><strong>Dernier délai :</strong> 15 jours à compter de la réception de cet email</p>
      </div>
      
      <div class="critical">
        <strong>⚠️ CONSÉQUENCES EN CAS DE NON-PAIEMENT :</strong>
        <ul>
          <li>Saisine du Tribunal Arbitral d'Honofication</li>
          <li>Frais d'arbitrage supplémentaires (600 €)</li>
          <li>Majoration additionnelle possible</li>
          <li>Inscription au registre des redevances impayées</li>
        </ul>
      </div>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="${data.paymentUrl}" class="button">💳 Payer ${data.newAmount} € MAINTENANT</a>
      </div>
      
      <div class="card">
        <h3>📋 Vos Droits</h3>
        <p>Vous conservez le droit de contester cette redevance en saisissant le Tribunal Arbitral d'Honofication dans un délai de 15 jours.</p>
        <p><a href="${data.contestUrl}">Formulaire de contestation</a></p>
      </div>
      
      <p>Cette mise en demeure est envoyée conformément aux articles 8 et 9 des Lois d'Honofication des Redevances.</p>
      
      <p>Cordialement,<br>Le Service Recouvrement<br>Sionohmair Insight Academy</p>
    </div>
  </div>
</body>
</html>
    `,
    
    text: `
MISE EN DEMEURE

Bonjour ${data.recipientName},

Ceci est une mise en demeure formelle.

La redevance de gratitude n'a pas été réglée dans les délais. Une majoration de 5% a été appliquée.

NOUVEAU MONTANT :
- Montant initial : ${data.royaltyAmount} €
- Majoration 5% : +${data.bonusAmount} €
- TOTAL : ${data.newAmount} €

DERNIER DÉLAI : 15 jours

⚠️ CONSÉQUENCES EN CAS DE NON-PAIEMENT :
- Saisine du Tribunal Arbitral
- Frais d'arbitrage (600 €)
- Majoration additionnelle
- Inscription au registre des impayés

Payer maintenant : ${data.paymentUrl}
Contester : ${data.contestUrl}

Le Service Recouvrement
Sionohmair Insight Academy
    `,
  };
}

/**
 * Email de confirmation de paiement
 */
export function getPaymentConfirmationEmail(data: EmailData): EmailTemplate {
  return {
    subject: `✅ Paiement Confirmé : ${data.royaltyAmount} € - Merci pour votre Gratitude !`,
    
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
    .card { background: white; padding: 20px; margin: 20px 0; border-radius: 8px; border-left: 4px solid #10b981; }
    .success { background: #d1fae5; padding: 15px; border-radius: 6px; margin: 15px 0; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>✅ Paiement Confirmé !</h1>
      <p>Merci pour votre Gratitude</p>
    </div>
    
    <div class="content">
      <p>Bonjour ${data.recipientName},</p>
      
      <p>Nous avons bien reçu votre paiement de <strong>${data.royaltyAmount} €</strong>. Merci pour votre contribution à l'écosystème Sionohmair !</p>
      
      <div class="success">
        <strong>🎉 Votre NFT de Gratitude a été enrichi !</strong>
        <p>Enrichissement : ${data.royaltyAmount} € × 22.67 = ${(parseFloat(data.royaltyAmount) * 22.67).toFixed(2)} € de valeur ajoutée</p>
      </div>
      
      <div class="card">
        <h3>📊 Récapitulatif</h3>
        <p><strong>Montant payé :</strong> ${data.royaltyAmount} €</p>
        <p><strong>Date de paiement :</strong> ${new Date().toLocaleDateString("fr-FR")}</p>
        <p><strong>Nouveau niveau de gratitude :</strong> [À calculer selon totalContributed]</p>
      </div>
      
      <p>Consultez votre <a href="${data.dashboardUrl}">Dashboard NFT de Gratitude</a> pour voir votre progression.</p>
      
      <p>Avec gratitude,<br>L'équipe Sionohmair</p>
    </div>
  </div>
</body>
</html>
    `,
    
    text: `
Paiement Confirmé !

Bonjour ${data.recipientName},

Nous avons bien reçu votre paiement de ${data.royaltyAmount} €. Merci !

🎉 Votre NFT de Gratitude a été enrichi !
Enrichissement : ${data.royaltyAmount} € × 22.67 = ${(parseFloat(data.royaltyAmount) * 22.67).toFixed(2)} €

Consultez votre dashboard : ${data.dashboardUrl}

Avec gratitude,
L'équipe Sionohmair
    `,
  };
}
