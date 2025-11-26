/**
 * Séquences d'emails automatisées pour Sionohmair Insight Academy
 * Drip campaigns optimisées pour l'engagement et la conversion
 */

// Template de base défini localement

/**
 * SÉQUENCE D'ONBOARDING (7 emails sur 14 jours)
 * Objectif : Éduquer les nouveaux abonnés sur la méthodologie PFPMA
 */

export const onboardingSequence = [
  {
    day: 0,
    subject: 'Bienvenue ! Votre Manuel PFPMA + 3 secrets pour doubler vos conversions',
    getContent: (data: { name?: string; email: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Bienvenue ${data.name || ''} ! 🎯</h2>
          
          <p>Vous venez de rejoindre une communauté de <strong>500+ professionnels</strong> qui transforment leur communication en science de la performance.</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">🎁 Votre cadeau de bienvenue</h3>
            <p><strong>Le Manuel PFPMA complet (310 pages)</strong> : La grammaire de la clarté qui a permis à nos clients d'obtenir :</p>
            <ul style="margin: 10px 0;">
              <li>+340% de conversion grâce au <strong style="color: #F59E0B;">Facteur α = 22.67</strong> (TechFlow)</li>
              <li>+117% d'inscriptions (LearnFast)</li>
              <li>+200% d'engagement (GreenTech)</li>
            </ul>
            <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #F59E0B; margin: 15px 0;">
              <p style="margin: 0; font-size: 14px;">
                <strong>🎯 Le Facteur Alpha (α = 22.67)</strong> : Vous ne corrigez pas 15% de friction, vous activez un <strong style="color: #F59E0B;">gain de 340%</strong>.
              </p>
            </div>
            <div style="text-align: center; margin: 20px 0;">
              <a href="https://sionohmair-insight-academy.manus.space/ressources" class="button">
                Télécharger le Manuel Gratuit
              </a>
            </div>
          </div>
          
          <h3 style="color: #0A1929;">Les 3 secrets que vous allez découvrir cette semaine :</h3>
          
          <p><strong>📊 Secret #1 (Demain)</strong> : Pourquoi 90% des messages échouent à capter l'attention en moins de 3 secondes</p>
          
          <p><strong>⚡ Secret #2 (Dans 3 jours)</strong> : La formule Hi qui prédit avec 87% de précision si votre message va convertir</p>
          
          <p><strong>🎯 Secret #3 (Dans 5 jours)</strong> : Comment éliminer les 3 frictions qui tuent vos conversions</p>
          
          <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 30px 0;">
            <p style="margin: 0; font-size: 14px; color: #6b7280;">
              <strong>💡 Action immédiate :</strong> Ouvrez le Manuel PFPMA page 47 et lisez la section "Code P : Le Problème". Vous comprendrez pourquoi votre message actuel ne capte pas l'attention.
            </p>
          </div>
          
          <p>À demain pour le Secret #1 !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 1,
    subject: 'Secret #1 : Les 3 secondes qui changent tout (+ calculateur gratuit)',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Secret #1 : La Friction d'Attention 📊</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Voici une statistique qui va vous choquer :</p>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">3 sec</div>
              <div class="stat-label">Temps d'attention moyen</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">90%</div>
              <div class="stat-label">Messages ignorés</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">2%</div>
              <div class="stat-label">Taux de conversion moyen</div>
            </div>
          </div>
          
          <p><strong>Pourquoi ?</strong> Parce que votre message souffre de la <strong>Friction d'Attention</strong>.</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">La Friction d'Attention, c'est quoi ?</h3>
            <p>C'est l'effort mental que votre audience doit fournir pour comprendre <strong>pourquoi votre message les concerne</strong>.</p>
            <p>Plus la friction est élevée, plus vite ils abandonnent.</p>
          </div>
          
          <h3 style="color: #0A1929;">Testez votre message maintenant (gratuit) :</h3>
          
          <p>J'ai créé un <strong>Calculateur de Score de Clarté</strong> qui analyse votre message en 30 secondes et vous donne :</p>
          
          <ul>
            <li>✅ Votre score /20 selon la grille PFPMA</li>
            <li>✅ Les 3 frictions détectées dans votre message</li>
            <li>✅ Des recommandations actionnables pour améliorer</li>
          </ul>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/calculateur" class="button">
              Tester mon message gratuitement
            </a>
          </div>
          
          <p><strong>Demain</strong>, je vous révèle le Secret #2 : la formule mathématique qui prédit vos conversions.</p>
          
          <p>À demain !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 3,
    subject: 'Secret #2 : La formule Hi qui prédit vos conversions (87% de précision)',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Secret #2 : Le Théorème de la Genèse de l'Insight ⚡</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Et si je vous disais qu'il existe une <strong>formule mathématique</strong> qui prédit avec 87% de précision si votre message va convertir ?</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929; text-align: center;">Hi = An × Pn × Tn × En</h3>
            <p style="text-align: center; margin: 10px 0; color: #6b7280;">
              <strong>Hi</strong> = Hauteur de l'Insight (votre impact)<br>
              <strong>An</strong> = Attention captée<br>
              <strong>Pn</strong> = Pertinence perçue<br>
              <strong>Tn</strong> = Tension créée<br>
              <strong>En</strong> = Émotion générée
            </p>
          </div>
          
          <p>Cette formule a été développée après l'analyse de <strong>1 247 messages</strong> dans 23 secteurs différents.</p>
          
          <h3 style="color: #0A1929;">Exemple concret : TechFlow (+250% de conversion)</h3>
          
          <p><strong>Message AVANT (Hi = 2,3/10)</strong> :<br>
          <em style="color: #6b7280;">"Notre solution SaaS optimise vos workflows."</em></p>
          
          <p><strong>Message APRÈS (Hi = 8,7/10)</strong> :<br>
          <em style="color: #F59E0B;">"Votre équipe perd 12h/semaine sur des tâches manuelles. Et si vous récupériez ce temps en 7 jours ?"</em></p>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">2%</div>
              <div class="stat-label">Conversion AVANT</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">7%</div>
              <div class="stat-label">Conversion APRÈS</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">+250%</div>
              <div class="stat-label">Amélioration</div>
            </div>
          </div>
          
          <p><strong>Vous voulez la même transformation ?</strong></p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/theoreme" class="button">
              Découvrir le Théorème complet
            </a>
          </div>
          
          <p><strong>Dans 2 jours</strong>, je vous révèle le Secret #3 : comment éliminer les 3 frictions qui tuent vos conversions.</p>
          
          <p>À bientôt !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 5,
    subject: 'Secret #3 : Les 3 frictions qui tuent vos conversions (+ diagnostic gratuit)',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Secret #3 : Les 3 Frictions Mortelles 🎯</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Après avoir analysé 1 247 messages, j'ai découvert que <strong>100% des messages qui échouent</strong> souffrent d'au moins une de ces 3 frictions :</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Friction #1 : Attention (6/10 en moyenne)</h3>
            <p>Votre audience ne comprend pas <strong>pourquoi</strong> votre message les concerne dans les 3 premières secondes.</p>
            <p><strong>Symptôme :</strong> Taux de rebond > 70%</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Friction #2 : Cognitive (7/10 en moyenne)</h3>
            <p>Votre message demande trop d'effort mental pour être compris.</p>
            <p><strong>Symptôme :</strong> Temps de lecture < 15 secondes</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Friction #3 : Émotionnelle (8/10 en moyenne)</h3>
            <p>Votre message ne génère aucune émotion, aucune urgence d'agir.</p>
            <p><strong>Symptôme :</strong> Taux de conversion < 3%</p>
          </div>
          
          <h3 style="color: #0A1929;">Diagnostic gratuit : Découvrez vos frictions en 7 jours</h3>
          
          <p>J'ai créé le <strong>Sprint de Clarté</strong> : un diagnostic complet de votre message en 7 jours pour seulement 490 €.</p>
          
          <p><strong>Ce que vous recevez :</strong></p>
          
          <ul>
            <li>✅ Votre score de clarté /20</li>
            <li>✅ Analyse détaillée de vos 3 frictions</li>
            <li>✅ Plan d'action personnalisé pour les éliminer</li>
            <li>✅ Message optimisé AVANT/APRÈS</li>
            <li>✅ Garantie de résultats ou remboursement intégral</li>
          </ul>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/sprint-clarte" class="button">
              Réserver mon Sprint de Clarté (490 €)
            </a>
          </div>
          
          <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B;">
            <strong>🎁 Offre spéciale abonnés :</strong> Les 50 premiers inscrits reçoivent un bonus de 30 minutes de consulting stratégique avec Bruno (valeur 300 €).
          </p>
          
          <p><strong>Demain</strong>, je vous envoie une étude de cas complète : comment LearnFast a augmenté ses inscriptions de 117% en 14 jours.</p>
          
          <p>À demain !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 7,
    subject: 'Etude de cas : +117% inscriptions en 14 jours (LearnFast)',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Étude de cas : LearnFast (+117% d'inscriptions) 📚</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Aujourd'hui, je vous partage l'histoire de <strong>Marie, CEO de LearnFast</strong>, une plateforme e-learning qui stagnait à 2,3% de conversion.</p>
          
          <h3 style="color: #0A1929;">Le Problème</h3>
          
          <p>Leur landing page disait :<br>
          <em style="color: #6b7280;">"Plateforme e-learning innovante avec 500+ cours certifiés."</em></p>
          
          <p><strong>Résultat :</strong> 2,3% de conversion, 78% de rebond</p>
          
          <h3 style="color: #0A1929;">Le Diagnostic (Sprint de Clarté)</h3>
          
          <p>Score de clarté : <strong>9/20</strong></p>
          
          <ul>
            <li>❌ Friction Attention : 8/10 (aucune accroche émotionnelle)</li>
            <li>❌ Friction Cognitive : 6/10 (jargon technique)</li>
            <li>❌ Friction Émotionnelle : 9/10 (aucune urgence)</li>
          </ul>
          
          <h3 style="color: #0A1929;">La Solution (Code PFPMA)</h3>
          
          <p>Nouveau message :<br>
          <em style="color: #F59E0B;">"Vous perdez 12h/semaine à chercher des formations de qualité. Et si vous trouviez LA bonne formation en 3 clics ?"</em></p>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">2,3%</div>
              <div class="stat-label">Conversion AVANT</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">5%</div>
              <div class="stat-label">Conversion APRÈS</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">+117%</div>
              <div class="stat-label">Amélioration</div>
            </div>
          </div>
          
          <h3 style="color: #0A1929;">Vous voulez les mêmes résultats ?</h3>
          
          <p>Le Sprint de Clarté vous donne exactement la même méthodologie que LearnFast a utilisée.</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/sprint-clarte" class="button">
              Réserver mon Sprint de Clarté (490 €)
            </a>
          </div>
          
          <p><strong>Lundi prochain</strong>, je vous envoie une nouvelle étude de cas : TechFlow (+250% de conversion).</p>
          
          <p>Bon weekend !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 10,
    subject: 'Etude de cas : +250% de conversion en 3 semaines (TechFlow)',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Étude de cas : TechFlow (+250% de conversion) 🚀</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Cette semaine, je vous partage l'histoire de <strong>Thomas, CTO de TechFlow</strong>, une solution SaaS B2B qui plafonnait à 2% de conversion.</p>
          
          <p><strong>Le défi :</strong> Leur message était trop technique, trop générique, et ne créait aucune urgence.</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Message AVANT (Score : 8/20)</h3>
            <p style="color: #6b7280; font-style: italic;">"Notre solution SaaS optimise vos workflows avec l'IA. Essai gratuit 14 jours."</p>
            <p><strong>Résultat :</strong> 2% de conversion, 12 000 € MRR</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Message APRÈS (Score : 18/20)</h3>
            <p style="color: #F59E0B; font-style: italic;">"Votre équipe perd 12h/semaine sur des tâches manuelles. Récupérez ce temps en 7 jours ou remboursé."</p>
            <p><strong>Résultat :</strong> 7% de conversion, 42 000 € MRR</p>
          </div>
          
          <div class="stats">
            <div class="stat-item">
              <div class="stat-value">+250%</div>
              <div class="stat-label">Conversion</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">+350%</div>
              <div class="stat-label">MRR</div>
            </div>
            <div class="stat-item">
              <div class="stat-value">3 sem</div>
              <div class="stat-label">Délai</div>
            </div>
          </div>
          
          <h3 style="color: #0A1929;">La méthodologie exacte utilisée</h3>
          
          <p>Thomas a suivi le <strong>Sprint de Clarté</strong> qui lui a permis de :</p>
          
          <ol>
            <li>Identifier ses 3 frictions (Attention 7/10, Cognitive 5/10, Émotionnelle 8/10)</li>
            <li>Appliquer le Code PFPMA pour restructurer son message</li>
            <li>Tester et itérer en 7 jours</li>
          </ol>
          
          <p><strong>Vous êtes dans la même situation que Thomas ?</strong></p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/sprint-clarte" class="button">
              Réserver mon Sprint de Clarté (490 €)
            </a>
          </div>
          
          <p style="background: #fef3c7; padding: 15px; border-radius: 6px; border-left: 4px solid #F59E0B;">
            <strong>🎁 Bonus :</strong> Les 20 premiers inscrits reçoivent l'accès gratuit au webinaire "PFPMA Avancé" (valeur 197 €).
          </p>
          
          <p><strong>Jeudi prochain</strong>, je vous envoie un guide pratique : "Comment écrire un message PFPMA en 15 minutes".</p>
          
          <p>À jeudi !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
  
  {
    day: 14,
    subject: 'Guide pratique : Ecrire un message PFPMA en 15 minutes',
    getContent: (data: { name?: string }) => {
      const content = `
        <div class="content">
          <h2 style="color: #0A1929; margin-top: 0;">Guide pratique : Message PFPMA en 15 minutes 📝</h2>
          
          <p>Bonjour ${data.name || 'cher abonné'},</p>
          
          <p>Vous avez maintenant toutes les clés pour comprendre la méthodologie PFPMA. Il est temps de <strong>passer à l'action</strong>.</p>
          
          <p>Voici un guide étape par étape pour écrire votre premier message PFPMA en 15 minutes :</p>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Étape 1 : Problème (3 min)</h3>
            <p>Identifiez la douleur #1 de votre audience. Soyez spécifique et quantifiable.</p>
            <p><strong>Exemple :</strong> "Vous perdez 12h/semaine sur des tâches manuelles"</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Étape 2 : Formule (3 min)</h3>
            <p>Nommez votre solution de manière mémorable et unique.</p>
            <p><strong>Exemple :</strong> "Le Sprint de Clarté : 7 frictions éliminées en 7 jours"</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Étape 3 : Preuve (3 min)</h3>
            <p>Apportez une preuve crédible (chiffre, témoignage, autorité).</p>
            <p><strong>Exemple :</strong> "+250% de conversion en moyenne sur 47 clients"</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Étape 4 : Méthode (3 min)</h3>
            <p>Expliquez le processus en 3 étapes maximum.</p>
            <p><strong>Exemple :</strong> "1) Diagnostic 2) Éliminer 3) Amplifier"</p>
          </div>
          
          <div class="highlight">
            <h3 style="margin-top: 0; color: #0A1929;">Étape 5 : Appel (3 min)</h3>
            <p>Proposez une action spécifique et à friction zéro.</p>
            <p><strong>Exemple :</strong> "Réservez votre Sprint (490 €) ou remboursé"</p>
          </div>
          
          <h3 style="color: #0A1929;">Testez votre message maintenant</h3>
          
          <p>Utilisez le <strong>Calculateur de Score de Clarté</strong> pour vérifier que votre message atteint au moins 15/20.</p>
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/calculateur" class="button">
              Tester mon message gratuitement
            </a>
          </div>
          
          <p><strong>Vous voulez aller plus loin ?</strong></p>
          
          <p>Le Sprint de Clarté vous accompagne personnellement pour transformer votre message en machine à conversion.</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <a href="https://sionohmair-insight-academy.manus.space/sprint-clarte" class="button">
              Réserver mon Sprint de Clarté (490 €)
            </a>
          </div>
          
          <p>À la semaine prochaine pour de nouvelles études de cas !</p>
          
          <p style="margin-top: 30px;">
            Bruno Coldold<br>
            <span style="color: #6b7280; font-size: 14px;">Fondateur, Sionohmair Insight Academy</span>
          </p>
        </div>
      `;
      return getBaseTemplate(content);
    },
  },
];

/**
 * Fonction helper pour obtenir le bon template
 */
function getBaseTemplate(content: string): string {
  return `
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
        Vous recevez cet email car vous êtes abonné à Sionohmair Insight Academy.<br>
        <a href="#" style="color: #6b7280;">Se désinscrire</a>
      </p>
    </div>
  </div>
</body>
</html>
  `;
}
