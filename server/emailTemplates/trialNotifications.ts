/**
 * Templates d'emails de notification d'essai gratuit
 * Envoyés automatiquement à J-7, J-3, J-1, J-0 et après inscription
 */

import { getDb } from "../db";
import { eq } from "drizzle-orm";
import { users } from "../../drizzle/schema";
import { sendEmail } from "../services/emailAutomationService";

/**
 * Template de base pour les emails de notification d'essai
 */
const getTrialEmailTemplate = (content: string, urgencyColor: string = "#F59E0B") => `
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
      background-color: ${urgencyColor};
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .button:hover {
      opacity: 0.9;
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
      border-left: 4px solid ${urgencyColor};
      margin: 20px 0;
    }
    @media only screen and (max-width: 600px) {
      .content {
        padding: 30px 20px;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 class="logo">SIONOHMAIR INSIGHT ACADEMY</h1>
      <p style="color: #ffffff; margin: 10px 0 0 0;">L'Ingénierie du Génie</p>
    </div>
    <div class="content">
      ${content}
    </div>
    <div class="footer">
      <p>© 2025 Sionohmair Insight Academy. Tous droits réservés.</p>
      <p style="margin-top: 10px;">
        <a href="https://sionohmair.com" style="color: #F59E0B; text-decoration: none;">Site web</a> •
        <a href="https://sionohmair.com/guide" style="color: #F59E0B; text-decoration: none;">Guide d'utilisation</a> •
        <a href="https://sionohmair.com/contact" style="color: #F59E0B; text-decoration: none;">Contact</a>
      </p>
    </div>
  </div>
</body>
</html>
`;

/**
 * J-7 : Il vous reste 7 jours d'essai gratuit
 */
export async function sendTrialReminderJ7(userId: number, trialEndDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error("User not found");

  const userName = user[0].name || "Utilisateur";
  const userEmail = user[0].email || "";
  const endDate = trialEndDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const content = `
    <h2 style="color: #0A1929; margin-bottom: 20px;">Bonjour ${userName},</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Votre essai gratuit de <strong>30 jours</strong> se termine dans <strong style="color: #F59E0B;">7 jours</strong>, le <strong>${endDate}</strong>.
    </p>

    <div class="highlight">
      <p style="margin: 0; font-size: 16px; line-height: 1.6;">
        <strong>Vous avez encore 7 jours pour profiter gratuitement de :</strong>
      </p>
      <ul style="margin: 15px 0 0 20px; padding: 0;">
        <li>Analyseur de Contenu (5 dimensions)</li>
        <li>Générateur de Copy IA (8 frameworks)</li>
        <li>Persona Builder (avatars clients)</li>
        <li>Analyseur de Scripts (détection automatique)</li>
        <li>Chat IA personnalisé</li>
        <li>Éditeur en temps réel avec suggestions IA</li>
        <li>Templates et exemples AVANT/APRÈS</li>
      </ul>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Après l'essai, continuez à utiliser tous les outils pour seulement <strong style="color: #F59E0B;">36€/mois</strong> (sans engagement, annulez quand vous voulez).
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sionohmair.com/subscription" class="button">
        S'abonner maintenant (36€/mois)
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Vous recevrez d'autres rappels à J-3, J-1 et le jour J.
    </p>
  `;

  const html = getTrialEmailTemplate(content, "#F59E0B");
  const text = `Bonjour ${userName},\n\nVotre essai gratuit se termine dans 7 jours, le ${endDate}.\n\nAprès l'essai, continuez à utiliser tous les outils pour seulement 36€/mois (sans engagement).\n\nS'abonner : https://sionohmair.com/subscription\n\nÀ bientôt,\nL'équipe Sionohmair`;

  await sendEmail(
    userEmail,
    "⏰ Il vous reste 7 jours d'essai gratuit",
    html,
    text
  );
}

/**
 * J-3 : Il vous reste 3 jours d'essai gratuit
 */
export async function sendTrialReminderJ3(userId: number, trialEndDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error("User not found");

  const userName = user[0].name || "Utilisateur";
  const userEmail = user[0].email || "";
  const endDate = trialEndDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const content = `
    <h2 style="color: #0A1929; margin-bottom: 20px;">Bonjour ${userName},</h2>
    
    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Votre essai gratuit se termine dans <strong style="color: #ea580c;">3 jours</strong>, le <strong>${endDate}</strong>.
    </p>

    <div class="highlight">
      <p style="margin: 0; font-size: 18px; font-weight: bold; color: #ea580c;">
        ⚠️ Plus que 3 jours pour profiter gratuitement de tous les outils !
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Ne perdez pas l'accès à vos outils de Content Marketing & Copywriting :
    </p>

    <ul style="margin: 15px 0 0 20px; padding: 0; font-size: 16px; line-height: 1.8;">
      <li><strong>Analyseur de Contenu</strong> : Analyse en 5 dimensions (SEO, Conversion, Engagement, Lisibilité, Psychologie)</li>
      <li><strong>Générateur de Copy IA</strong> : 8 frameworks (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST)</li>
      <li><strong>Persona Builder</strong> : Créez des avatars clients détaillés</li>
      <li><strong>Chat IA personnalisé</strong> : Conversations adaptées à votre audience</li>
      <li><strong>Éditeur en temps réel</strong> : Suggestions IA pendant la rédaction</li>
    </ul>

    <p style="font-size: 16px; line-height: 1.6; color: #374151; margin-top: 20px;">
      Continuez à utiliser tous les outils pour seulement <strong style="color: #ea580c;">36€/mois</strong> (sans engagement, annulez quand vous voulez).
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sionohmair.com/subscription" class="button">
        S'abonner maintenant (36€/mois)
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Vous recevrez d'autres rappels à J-1 et le jour J.
    </p>
  `;

  const html = getTrialEmailTemplate(content, "#ea580c");
  const text = `Bonjour ${userName},\n\nVotre essai gratuit se termine dans 3 jours, le ${endDate}.\n\nNe perdez pas l'accès à tous les outils de Content Marketing & Copywriting.\n\nContinuez pour seulement 36€/mois (sans engagement).\n\nS'abonner : https://sionohmair.com/subscription\n\nÀ bientôt,\nL'équipe Sionohmair`;

  await sendEmail(
    userEmail,
    "⚠️ Il vous reste 3 jours d'essai gratuit",
    html,
    text
  );
}

/**
 * J-1 : Dernier jour d'essai gratuit
 */
export async function sendTrialReminderJ1(userId: number, trialEndDate: Date) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error("User not found");

  const userName = user[0].name || "Utilisateur";
  const userEmail = user[0].email || "";
  const endDate = trialEndDate.toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" });

  const content = `
    <h2 style="color: #0A1929; margin-bottom: 20px;">Bonjour ${userName},</h2>
    
    <p style="font-size: 18px; line-height: 1.6; color: #dc2626; font-weight: bold;">
      🚨 Votre essai gratuit se termine <strong>demain</strong>, le ${endDate}.
    </p>

    <div class="highlight">
      <p style="margin: 0; font-size: 20px; font-weight: bold; color: #dc2626;">
        ⏰ DERNIER JOUR pour profiter gratuitement de tous les outils !
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Après demain, vous perdrez l'accès à :
    </p>

    <ul style="margin: 15px 0 0 20px; padding: 0; font-size: 16px; line-height: 1.8;">
      <li><strong>Analyseur de Contenu</strong> (5 dimensions)</li>
      <li><strong>Générateur de Copy IA</strong> (8 frameworks)</li>
      <li><strong>Persona Builder</strong> (avatars clients)</li>
      <li><strong>Analyseur de Scripts</strong> (détection automatique)</li>
      <li><strong>Chat IA personnalisé</strong></li>
      <li><strong>Éditeur en temps réel</strong> avec suggestions IA</li>
      <li><strong>Templates et exemples AVANT/APRÈS</strong></li>
    </ul>

    <p style="font-size: 18px; line-height: 1.6; color: #374151; margin-top: 20px; font-weight: bold;">
      Gardez l'accès pour seulement <strong style="color: #dc2626;">36€/mois</strong>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
      Sans engagement • Annulez quand vous voulez • Toutes les mises à jour incluses
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sionohmair.com/subscription" class="button">
        S'abonner maintenant (36€/mois)
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Vous recevrez un dernier rappel demain (jour J).
    </p>
  `;

  const html = getTrialEmailTemplate(content, "#dc2626");
  const text = `Bonjour ${userName},\n\nVotre essai gratuit se termine DEMAIN, le ${endDate}.\n\nAprès demain, vous perdrez l'accès à tous les outils de Content Marketing & Copywriting.\n\nGardez l'accès pour seulement 36€/mois (sans engagement).\n\nS'abonner : https://sionohmair.com/subscription\n\nÀ bientôt,\nL'équipe Sionohmair`;

  await sendEmail(
    userEmail,
    "🚨 Dernier jour d'essai gratuit",
    html,
    text
  );
}

/**
 * J-0 : Votre essai se termine aujourd'hui - Abonnez-vous
 */
export async function sendTrialReminderJ0(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error("User not found");

  const userName = user[0].name || "Utilisateur";
  const userEmail = user[0].email || "";

  const content = `
    <h2 style="color: #0A1929; margin-bottom: 20px;">Bonjour ${userName},</h2>
    
    <p style="font-size: 20px; line-height: 1.6; color: #dc2626; font-weight: bold;">
      🔴 Votre essai gratuit se termine <strong>AUJOURD'HUI</strong>.
    </p>

    <div class="highlight">
      <p style="margin: 0; font-size: 22px; font-weight: bold; color: #dc2626;">
        ⚠️ DERNIER JOUR pour s'abonner et garder l'accès !
      </p>
    </div>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      À partir de demain, vous ne pourrez plus utiliser :
    </p>

    <ul style="margin: 15px 0 0 20px; padding: 0; font-size: 16px; line-height: 1.8;">
      <li><strong>Analyseur de Contenu</strong> : Analyse en 5 dimensions</li>
      <li><strong>Générateur de Copy IA</strong> : 8 frameworks de copywriting</li>
      <li><strong>Persona Builder</strong> : Avatars clients détaillés</li>
      <li><strong>Analyseur de Scripts</strong> : Détection automatique des frameworks</li>
      <li><strong>Chat IA personnalisé</strong> : Conversations adaptées</li>
      <li><strong>Éditeur en temps réel</strong> : Suggestions IA pendant la rédaction</li>
      <li><strong>Templates et exemples</strong> : AVANT/APRÈS avec métriques</li>
    </ul>

    <p style="font-size: 18px; line-height: 1.6; color: #374151; margin-top: 20px; font-weight: bold;">
      Continuez pour seulement <strong style="color: #dc2626;">36€/mois</strong>
    </p>

    <p style="font-size: 14px; line-height: 1.6; color: #6b7280;">
      ✓ Sans engagement<br>
      ✓ Annulez quand vous voulez<br>
      ✓ Toutes les mises à jour incluses<br>
      ✓ Support prioritaire
    </p>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sionohmair.com/subscription" class="button">
        S'abonner maintenant (36€/mois)
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      Si vous ne souhaitez pas continuer, aucune action n'est requise. Votre accès sera automatiquement désactivé demain.
    </p>

    <p style="font-size: 14px; color: #6b7280; margin-top: 10px;">
      Vous pourrez toujours vous réabonner plus tard si vous changez d'avis.
    </p>
  `;

  const html = getTrialEmailTemplate(content, "#dc2626");
  const text = `Bonjour ${userName},\n\nVotre essai gratuit se termine AUJOURD'HUI.\n\nÀ partir de demain, vous ne pourrez plus utiliser les outils de Content Marketing & Copywriting.\n\nContinuez pour seulement 36€/mois (sans engagement, annulez quand vous voulez).\n\nS'abonner : https://sionohmair.com/subscription\n\nSi vous ne souhaitez pas continuer, aucune action n'est requise.\n\nÀ bientôt,\nL'équipe Sionohmair`;

  await sendEmail(
    userEmail,
    "🔴 Votre essai se termine AUJOURD'HUI - Abonnez-vous",
    html,
    text
  );
}

/**
 * Email de bienvenue après inscription à l'abonnement
 * Guide complet d'utilisation de la plateforme
 */
export async function sendWelcomeAfterSubscription(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const user = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.length === 0) throw new Error("User not found");

  const userName = user[0].name || "Utilisateur";
  const userEmail = user[0].email || "";

  const content = `
    <h2 style="color: #0A1929; margin-bottom: 20px;">Bienvenue ${userName} ! 🎉</h2>
    
    <p style="font-size: 18px; line-height: 1.6; color: #10b981; font-weight: bold;">
      ✅ Votre abonnement est maintenant actif !
    </p>

    <p style="font-size: 16px; line-height: 1.6; color: #374151;">
      Vous avez maintenant accès à tous les outils de Content Marketing & Copywriting de Sionohmair Insight Academy.
    </p>

    <div class="highlight">
      <p style="margin: 0 0 15px 0; font-size: 18px; font-weight: bold; color: #0A1929;">
        📚 Guide complet d'utilisation
      </p>
      <p style="margin: 0; font-size: 14px; line-height: 1.6;">
        Voici comment tirer le meilleur parti de votre abonnement :
      </p>
    </div>

    <h3 style="color: #0A1929; margin-top: 30px;">🎯 1. Analyseur de Contenu</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Analysez n'importe quel contenu marketing en 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie. Obtenez un score global et des recommandations actionnables.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/content-analyzer" style="color: #F59E0B;">→ Analyser mon contenu</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">✍️ 2. Générateur de Copy IA</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Générez du copy optimisé avec 8 frameworks de copywriting (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST). Personnalisez selon votre avatar client.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/copy-generator" style="color: #F59E0B;">→ Générer du copy</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">👤 3. Persona Builder</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Créez des avatars clients détaillés (démographiques, psychographiques, comportement). Utilisez-les pour personnaliser vos analyses et générations.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/avatar-builder" style="color: #F59E0B;">→ Créer un avatar client</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">🔍 4. Analyseur de Scripts</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Identifiez automatiquement les frameworks utilisés dans vos scripts. Obtenez un score de qualité et des recommandations d'amélioration.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/scripts" style="color: #F59E0B;">→ Analyser un script</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">💬 5. Chat IA Personnalisé</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Posez n'importe quelle question sur le copywriting, le marketing de contenu, ou demandez de l'aide pour optimiser vos messages.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/chat-ia" style="color: #F59E0B;">→ Discuter avec l'IA</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">✏️ 6. Éditeur en Temps Réel</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Rédigez votre copy avec des suggestions IA en direct. Détection automatique des frameworks, score de qualité, et recommandations pendant la rédaction.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/editor" style="color: #F59E0B;">→ Utiliser l'éditeur</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">📄 7. Templates & Exemples</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Accédez à 7 templates prêts à l'emploi et 3 exemples AVANT/APRÈS avec métriques de conversion réelles.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/templates" style="color: #F59E0B;">→ Voir les templates</a> •
      <a href="https://sionohmair.com/exemples" style="color: #F59E0B;">Voir les exemples</a>
    </p>

    <h3 style="color: #0A1929; margin-top: 25px;">📊 8. Dashboard Utilisateur</h3>
    <p style="font-size: 14px; line-height: 1.6; color: #374151;">
      Suivez votre progression, consultez l'historique de vos analyses et copies générées, gérez vos avatars clients.
    </p>
    <p style="font-size: 14px;">
      <a href="https://sionohmair.com/dashboard-user" style="color: #F59E0B;">→ Voir mon dashboard</a>
    </p>

    <div style="background-color: #f0fdf4; padding: 20px; border-left: 4px solid #10b981; margin: 30px 0;">
      <p style="margin: 0; font-size: 16px; font-weight: bold; color: #10b981;">
        💡 Conseil : Commencez par créer un avatar client
      </p>
      <p style="margin: 10px 0 0 0; font-size: 14px; color: #374151;">
        Créez d'abord un avatar client détaillé, puis utilisez-le dans l'Analyseur et le Générateur pour des résultats personnalisés et ultra-ciblés.
      </p>
    </div>

    <div style="text-align: center; margin: 30px 0;">
      <a href="https://sionohmair.com/guide" class="button">
        Voir le guide complet
      </a>
    </div>

    <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
      <strong>Besoin d'aide ?</strong><br>
      Utilisez le chatbot d'aide (icône en bas à droite) sur n'importe quelle page, ou contactez-nous à <a href="mailto:contact@sionohmair.com" style="color: #F59E0B;">contact@sionohmair.com</a>
    </p>

    <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
      <strong>Gérer votre abonnement :</strong><br>
      Consultez votre <a href="https://sionohmair.com/subscription" style="color: #F59E0B;">tableau de bord d'abonnement</a> pour voir votre statut, historique de paiements, et options d'annulation.
    </p>
  `;

  const html = getTrialEmailTemplate(content, "#10b981");
  const text = `Bienvenue ${userName} !\n\nVotre abonnement est maintenant actif !\n\nVous avez accès à tous les outils de Content Marketing & Copywriting :\n\n1. Analyseur de Contenu (5 dimensions)\n2. Générateur de Copy IA (8 frameworks)\n3. Persona Builder (avatars clients)\n4. Analyseur de Scripts (détection automatique)\n5. Chat IA personnalisé\n6. Éditeur en temps réel\n7. Templates & Exemples\n8. Dashboard utilisateur\n\nCommencez : https://sionohmair.com/guide\n\nBesoin d'aide ? contact@sionohmair.com\n\nÀ bientôt,\nL'équipe Sionohmair`;

  await sendEmail(
    userEmail,
    "🎉 Bienvenue sur Sionohmair Insight Academy !",
    html,
    text
  );
}
