import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import * as schema from '../drizzle/schema.js';

const connectionString = process.env.DATABASE_URL;
if (!connectionString) {
  throw new Error('DATABASE_URL environment variable is not set');
}

const client = postgres(connectionString);
const db = drizzle(client, { schema });

const templates = [
  {
    name: "Bienvenue - Nouveau Subscriber",
    category: "bienvenue",
    subject: "Bienvenue chez Sionohmair Insight Academy ! 🎯",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f97316;">Bienvenue {{nom}} ! 👋</h1>
  
  <p>Merci de rejoindre la communauté Sionohmair Insight Academy.</p>
  
  <p>Vous avez fait le premier pas vers l'excellence en ingénierie du génie. Voici ce qui vous attend :</p>
  
  <ul>
    <li>📚 Accès à nos ressources exclusives</li>
    <li>🎓 Méthodologies éprouvées (Théorème de l'Insight)</li>
    <li>🚀 Opportunités de transformation</li>
  </ul>
  
  <p>Pour commencer, je vous recommande de découvrir notre <strong>Sprint de Clarté</strong> - une méthodologie révolutionnaire pour clarifier vos objectifs en 5 jours.</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://sionohmair.com/sprint" style="background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Découvrir le Sprint de Clarté</a>
  </div>
  
  <p>À très bientôt,<br>
  L'équipe Sionohmair Insight Academy</p>
</div>
    `,
    variables: ["nom"]
  },
  {
    name: "Ressource Gratuite - Calculateur ROI",
    category: "ressource",
    subject: "🎁 Votre calculateur ROI personnalisé est prêt",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f97316;">Calculez votre ROI en 2 minutes ⏱️</h1>
  
  <p>Bonjour {{nom}},</p>
  
  <p>Vous vous demandez quel impact pourrait avoir une transformation de votre organisation ?</p>
  
  <p>J'ai créé pour vous un <strong>calculateur ROI interactif</strong> qui vous permet de :</p>
  
  <ul>
    <li>📊 Estimer vos gains potentiels</li>
    <li>💰 Calculer le retour sur investissement</li>
    <li>⏰ Identifier les économies de temps</li>
  </ul>
  
  <div style="background-color: #fef3c7; padding: 20px; border-left: 4px solid #f97316; margin: 20px 0;">
    <p style="margin: 0;"><strong>Exemple concret :</strong> Une entreprise de 50 personnes peut économiser jusqu'à <strong>250 000€/an</strong> en optimisant ses processus.</p>
  </div>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://sionohmair.com/calculateur" style="background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Calculer mon ROI maintenant</a>
  </div>
  
  <p>C'est gratuit et sans engagement.</p>
  
  <p>Cordialement,<br>
  L'équipe Sionohmair</p>
</div>
    `,
    variables: ["nom"]
  },
  {
    name: "Promotion Sprint de Clarté",
    category: "promotion",
    subject: "🚀 Transformez votre vision en 5 jours avec le Sprint de Clarté",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f97316;">Le Sprint de Clarté : 5 jours pour tout changer 🎯</h1>
  
  <p>Bonjour {{nom}},</p>
  
  <p>Vous avez une vision, mais vous manquez de clarté sur comment la concrétiser ?</p>
  
  <p>Le <strong>Sprint de Clarté</strong> est une méthodologie intensive de 5 jours qui vous permet de :</p>
  
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="color: #3b82f6; margin-top: 0;">Ce que vous obtiendrez :</h3>
    <ul>
      <li>✅ Une vision cristalline de vos objectifs</li>
      <li>✅ Un plan d'action concret et actionnable</li>
      <li>✅ Les outils pour maintenir le cap</li>
      <li>✅ Un accompagnement personnalisé</li>
    </ul>
  </div>
  
  <p><strong>Score actuel : {{score}}/100</strong> - Vous êtes prêt pour le Sprint !</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://sionohmair.com/sprint" style="background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Démarrer mon Sprint de Clarté</a>
  </div>
  
  <p>Places limitées - Réservez maintenant.</p>
  
  <p>À bientôt,<br>
  L'équipe Sionohmair</p>
</div>
    `,
    variables: ["nom", "score"]
  },
  {
    name: "Relance Inactifs - Réengagement",
    category: "relance",
    subject: "On vous a manqué {{nom}} ! 💙",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f97316;">Vous nous manquez ! 💙</h1>
  
  <p>Bonjour {{nom}},</p>
  
  <p>Cela fait un moment que nous n'avons pas eu de vos nouvelles...</p>
  
  <p>Peut-être que la vie vous a emmené ailleurs, ou que nos contenus ne correspondaient plus à vos attentes ?</p>
  
  <div style="background-color: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">🎁 Pour votre retour, nous vous offrons :</h3>
    <ul>
      <li>Un accès gratuit à notre webinaire exclusif</li>
      <li>Le guide "Les 7 Piliers de l'Excellence"</li>
      <li>Une session de consultation offerte</li>
    </ul>
  </div>
  
  <p>Si vous souhaitez continuer l'aventure avec nous, cliquez ci-dessous :</p>
  
  <div style="text-align: center; margin: 30px 0;">
    <a href="https://sionohmair.com/ressources" style="background-color: #f97316; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">Je reviens ! 🚀</a>
  </div>
  
  <p style="font-size: 12px; color: #666; margin-top: 40px;">Si vous préférez ne plus recevoir nos emails, vous pouvez vous <a href="{{unsubscribe_link}}">désabonner ici</a>.</p>
  
  <p>Avec toute notre estime,<br>
  L'équipe Sionohmair</p>
</div>
    `,
    variables: ["nom"]
  },
  {
    name: "Newsletter Mensuelle - Insights & Actualités",
    category: "newsletter",
    subject: "📬 Newsletter {{mois}} : Nouveautés & Insights exclusifs",
    content: `
<div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
  <h1 style="color: #f97316;">Newsletter {{mois}} 📬</h1>
  
  <p>Bonjour {{nom}},</p>
  
  <p>Voici votre dose mensuelle d'insights et d'actualités de Sionohmair Insight Academy !</p>
  
  <h2 style="color: #3b82f6;">🎯 À la une ce mois-ci</h2>
  
  <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
    <h3 style="margin-top: 0;">Nouvel article : "L'Art de la Transformation"</h3>
    <p>Découvrez comment les plus grandes organisations réussissent leurs transformations grâce au Théorème de l'Insight.</p>
    <a href="https://sionohmair.com/blog/art-transformation" style="color: #f97316; text-decoration: none; font-weight: bold;">Lire l'article →</a>
  </div>
  
  <h2 style="color: #3b82f6;">📚 Ressources du mois</h2>
  <ul>
    <li><a href="https://sionohmair.com/niveau3">Architecture de l'Insight Niveau 3</a></li>
    <li><a href="https://sionohmair.com/automatisation-ia">Guide Automatisation IA</a></li>
    <li><a href="https://sionohmair.com/calculateur">Calculateur ROI</a></li>
  </ul>
  
  <h2 style="color: #3b82f6;">💡 Insight de la semaine</h2>
  <div style="background-color: #fef3c7; padding: 15px; border-left: 4px solid #f97316; margin: 20px 0;">
    <p style="margin: 0; font-style: italic;">"La clarté n'est pas un luxe, c'est une nécessité stratégique."</p>
  </div>
  
  <p>À très bientôt,<br>
  L'équipe Sionohmair Insight Academy</p>
  
  <p style="font-size: 12px; color: #666; margin-top: 40px; text-align: center;">
    <a href="{{unsubscribe_link}}" style="color: #666;">Se désabonner</a>
  </p>
</div>
    `,
    variables: ["nom", "mois"]
  }
];

async function seedTemplates() {
  console.log('🌱 Seeding email templates...');
  
  try {
    for (const template of templates) {
      await db.insert(schema.emailTemplates).values({
        ...template,
        variables: JSON.stringify(template.variables),
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log(`✅ Created template: ${template.name}`);
    }
    
    console.log('\n🎉 All email templates created successfully!');
  } catch (error) {
    console.error('❌ Error seeding templates:', error);
    throw error;
  } finally {
    await client.end();
  }
}

seedTemplates();
