/**
 * Templates d'emails professionnels pour Sionohmair Insight Academy
 * Tous les templates sont responsive et adaptatifs
 */

interface EmailTemplateData {
  customerName: string;
  [key: string]: any;
}

/**
 * Template de base HTML responsive
 */
const getBaseTemplate = (content: string) => `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Sionohmair Insight Academy</title>
  <style>
    body {
      margin: 0;
      padding: 0;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background-color: #f5f5f5;
      color: #1a1a1a;
    }
    .container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
    }
    .header {
      background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%);
      padding: 40px 20px;
      text-align: center;
    }
    .logo {
      color: #F59E0B;
      font-size: 24px;
      font-weight: bold;
      margin: 0;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      padding: 14px 32px;
      background-color: #F59E0B;
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      background-color: #d97706;
    }
    .footer {
      background-color: #f9fafb;
      padding: 30px;
      text-align: center;
      font-size: 14px;
      color: #6b7280;
      border-top: 1px solid #e5e7eb;
    }
    .highlight {
      background-color: #fef3c7;
      padding: 20px;
      border-left: 4px solid #F59E0B;
      margin: 20px 0;
    }
    .stats {
      display: flex;
      justify-content: space-around;
      margin: 30px 0;
      text-align: center;
    }
    .stat-item {
      flex: 1;
      padding: 20px;
    }
    .stat-value {
      font-size: 32px;
      font-weight: bold;
      color: #F59E0B;
    }
    .stat-label {
      font-size: 14px;
      color: #6b7280;
      margin-top: 5px;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
      .stats {
        flex-direction: column;
      }
      .stat-item {
        margin-bottom: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">✨ Sionohmair Insight Academy</h1>
      <p style="color: #F59E0B; margin: 10px 0 0 0; font-size: 14px;">L'Ingénierie du Génie</p>
    </div>
    ${content}
    <div class="footer">
      <p><strong>Sionohmair Insight Academy</strong></p>
      <p>Fondateur : Bruno Coldold</p>
      <p>Email : <a href="mailto:insight.sionohmair@gmail.com" style="color: #F59E0B;">insight.sionohmair@gmail.com</a></p>
      <p style="margin-top: 20px; font-size: 12px;">
        Vous recevez cet email car vous avez interagi avec Sionohmair Insight Academy.<br>
        <a href="#" style="color: #6b7280;">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * Email de confirmation de commande
 */
export const getOrderConfirmationEmail = (data: {
  customerName: string;
  customerEmail: string;
  serviceName: string;
  amount: number;
  orderDate: string;
  orderId: string;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">Commande confirmée ! 🎉</h2>
      
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      
      <p>Nous avons bien reçu votre paiement pour le <strong>${data.serviceName}</strong>. Merci de votre confiance !</p>
      
      <div class="highlight">
        <h3 style="margin-top: 0; color: #0A1929;">Détails de votre commande</h3>
        <p><strong>Service :</strong> ${data.serviceName}</p>
        <p><strong>Montant :</strong> ${data.amount} €</p>
        <p><strong>Date :</strong> ${data.orderDate}</p>
        <p><strong>Numéro de commande :</strong> #${data.orderId}</p>
      </div>
      
      <h3 style="color: #0A1929;">Prochaines étapes</h3>
      
      <p><strong>📋 Étape 1 : Réception de votre formulaire</strong><br>
      Vous allez recevoir un email séparé avec le formulaire de diagnostic à compléter.</p>
      
      <p><strong>⏱️ Étape 2 : Analyse (48h)</strong><br>
      Notre équipe analyse vos réponses selon la méthodologie PFPMA.</p>
      
      <p><strong>📦 Étape 3 : Livraison (7 jours)</strong><br>
      Vous recevrez vos artefacts de clarté directement dans votre dashboard.</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://sionohmair-insight-academy.manus.space/dashboard" class="button">
          Accéder à mon Dashboard
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        <strong>Une question ?</strong> Répondez simplement à cet email, nous vous répondrons sous 24h.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
};

/**
 * Email de bienvenue newsletter
 */
export const getNewsletterWelcomeEmail = (data: {
  email: string;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">Bienvenue dans la communauté Sionohmair ! 🎯</h2>
      
      <p>Bonjour,</p>
      
      <p>Merci de vous être inscrit(e) à notre newsletter ! Vous faites maintenant partie d'une communauté de professionnels qui transforment leur communication en science de la performance.</p>
      
      <div class="highlight">
        <h3 style="margin-top: 0; color: #0A1929;">🎁 Votre cadeau de bienvenue</h3>
        <p>Téléchargez gratuitement le <strong>Manuel PFPMA</strong> : la grammaire complète de la clarté en 310 pages.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="https://sionohmair-insight-academy.manus.space/ressources" class="button">
            Télécharger le Manuel Gratuit
          </a>
        </div>
      </div>
      
      <h3 style="color: #0A1929;">Ce que vous allez recevoir</h3>
      
      <p>📧 <strong>Chaque semaine</strong> : Une étude de cas réelle avec scores AVANT/APRÈS<br>
      💡 <strong>Insights exclusifs</strong> : Les coulisses de la méthodologie Sionohmair<br>
      🎯 <strong>Offres prioritaires</strong> : Accès anticipé aux nouveaux services</p>
      
      <div class="highlight" style="background-color: #fef3c7; border-left: 4px solid #F59E0B; padding: 20px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #0A1929;">🎯 Le Facteur Alpha (α = 22.67)</h3>
        <p style="font-size: 16px; margin: 10px 0;">
          Vous ne corrigez pas 15% de friction. Vous activez un <strong style="color: #F59E0B;">gain de 340%</strong> grâce au Facteur d'Amplification Sionohmair.
        </p>
        <p style="font-size: 14px; color: #6b7280; margin: 10px 0 0 0;">
          C'est la <strong>Loi de la Clarté</strong> : 340% = 15% × 22.67
        </p>
      </div>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">+340%</div>
          <div class="stat-label">Gain réel (α = 22.67)</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">7 jours</div>
          <div class="stat-label">Livraison Sprint</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">20/20</div>
          <div class="stat-label">Score de Clarté</div>
        </div>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        <strong>Envie d'aller plus loin ?</strong> Découvrez le Sprint de Clarté à 490 € : diagnostic complet en 7 jours avec activation du <strong style="color: #F59E0B;">Facteur α = 22.67</strong> pour un gain de <strong style="color: #F59E0B;">340%</strong>.
      </p>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://sionohmair-insight-academy.manus.space/sprint-clarte" class="button">
          Découvrir le Sprint de Clarté
        </a>
      </div>
    </div>
  `;
  
  return getBaseTemplate(content);
};

/**
 * Email de livraison d'artefacts
 */
export const getArtefactDeliveryEmail = (data: {
  customerName: string;
  serviceName: string;
  artefactCount: number;
  dashboardUrl: string;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">Vos artefacts sont prêts ! 📦</h2>
      
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      
      <p>Excellente nouvelle ! Vos artefacts de clarté pour le <strong>${data.serviceName}</strong> sont maintenant disponibles dans votre dashboard.</p>
      
      <div class="highlight">
        <h3 style="margin-top: 0; color: #0A1929;">📋 Ce que vous allez trouver</h3>
        <p>✅ <strong>${data.artefactCount} artefacts</strong> prêts à télécharger<br>
        ✅ Rapport de diagnostic complet (PDF)<br>
        ✅ Calcul du <strong style="color: #F59E0B;">Joule Informatique</strong> perdu<br>
        ✅ Projection du <strong style="color: #F59E0B;">gain de 340%</strong> (α = 22.67)<br>
        ✅ Plan d'action personnalisé<br>
        ✅ Recommandations IA actionnables</p>
      </div>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${data.dashboardUrl}" class="button">
          Télécharger mes artefacts
        </a>
      </div>
      
      <h3 style="color: #0A1929;">Prochaines étapes recommandées</h3>
      
      <p><strong>1. Lisez le rapport de diagnostic</strong><br>
      Comprenez vos 3 frictions principales et votre score de clarté.</p>
      
      <p><strong>2. Implémentez le plan d'action</strong><br>
      Suivez les recommandations dans l'ordre de priorité.</p>
      
      <p><strong>3. Mesurez les résultats</strong><br>
      Utilisez le calculateur de score pour suivre vos progrès.</p>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        <strong>Besoin d'aide ?</strong> Réservez un appel de 30 minutes avec Bruno pour discuter de votre stratégie d'implémentation.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
};

/**
 * Email de rappel (3 jours après commande)
 */
export const getReminderEmail = (data: {
  customerName: string;
  serviceName: string;
  daysRemaining: number;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">N'oubliez pas de compléter votre formulaire ! ⏰</h2>
      
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      
      <p>Nous avons remarqué que vous n'avez pas encore complété le formulaire de diagnostic pour votre <strong>${data.serviceName}</strong>.</p>
      
      <div class="highlight">
        <p style="margin: 0;"><strong>⏱️ Temps restant :</strong> ${data.daysRemaining} jours pour profiter pleinement de votre Sprint</p>
      </div>
      
      <p>Le formulaire ne prend que <strong>10 minutes</strong> à compléter et nous permet de :</p>
      
      <p>✅ Analyser précisément vos 3 frictions<br>
      ✅ Calibrer les recommandations IA<br>
      ✅ Livrer vos artefacts dans les délais</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="https://sionohmair-insight-academy.manus.space/dashboard" class="button">
          Compléter le formulaire
        </a>
      </div>
      
      <p style="color: #6b7280; font-size: 14px;">
        <strong>Besoin d'aide ?</strong> Répondez à cet email, nous vous guiderons.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
};

/**
 * Email de demande d'avis client
 */
export const getFeedbackRequestEmail = (data: {
  customerName: string;
  serviceName: string;
  feedbackUrl: string;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">Votre avis nous intéresse ! ⭐</h2>
      
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      
      <p>Cela fait maintenant 2 semaines que vous avez reçu vos artefacts pour le <strong>${data.serviceName}</strong>.</p>
      
      <p>Nous aimerions savoir :</p>
      
      <p>📊 Avez-vous implémenté les recommandations ?<br>
      📈 Quels résultats avez-vous observés ?<br>
      💡 Comment pouvons-nous améliorer notre service ?</p>
      
      <div style="text-align: center; margin: 40px 0;">
        <a href="${data.feedbackUrl}" class="button">
          Partager mon expérience (2 min)
        </a>
      </div>
      
      <div class="highlight">
        <h3 style="margin-top: 0; color: #0A1929;">🎁 Merci d'avance !</h3>
        <p>En remerciement, vous recevrez un accès gratuit à notre prochain webinaire exclusif sur l'optimisation PFPMA avancée.</p>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        Votre témoignage nous aide à améliorer continuellement notre méthodologie.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
};

/**
 * Email de suivi post-Sprint
 */
export const getFollowUpEmail = (data: {
  customerName: string;
  scoreAvant: number;
  scoreApres: number;
  nextService: string;
  nextServiceUrl: string;
}) => {
  const content = `
    <div class="content">
      <h2 style="color: #0A1929; margin-top: 0;">Félicitations pour vos progrès ! 🎯</h2>
      
      <p>Bonjour <strong>${data.customerName}</strong>,</p>
      
      <p>Nous avons suivi vos progrès depuis votre Sprint de Clarté. Voici vos résultats :</p>
      
      <div class="stats">
        <div class="stat-item">
          <div class="stat-value">${data.scoreAvant}/20</div>
          <div class="stat-label">Score AVANT</div>
        </div>
        <div class="stat-item">
          <div class="stat-value" style="color: #10b981;">${data.scoreApres}/20</div>
          <div class="stat-label">Score APRÈS</div>
        </div>
        <div class="stat-item">
          <div class="stat-value">+${((data.scoreApres - data.scoreAvant) / data.scoreAvant * 100).toFixed(0)}%</div>
          <div class="stat-label">Progression</div>
        </div>
      </div>
      
      <p>C'est un excellent début ! Pour aller encore plus loin, nous vous recommandons :</p>
      
      <div class="highlight">
        <h3 style="margin-top: 0; color: #0A1929;">🚀 Prochaine étape : ${data.nextService}</h3>
        <p>Structurez toute votre communication avec les 5 Artefacts de Clarté, la Carte PFPMA, et une Roadmap 12 mois personnalisée.</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${data.nextServiceUrl}" class="button">
            Découvrir ${data.nextService}
          </a>
        </div>
      </div>
      
      <p style="color: #6b7280; font-size: 14px; margin-top: 40px;">
        <strong>Questions ?</strong> Réservez un appel stratégique gratuit de 30 minutes avec Bruno.
      </p>
    </div>
  `;
  
  return getBaseTemplate(content);
};
