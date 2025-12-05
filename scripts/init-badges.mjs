import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Charger les variables d'environnement
dotenv.config({ path: resolve(__dirname, '../.env.local') });
dotenv.config({ path: resolve(__dirname, '../.env') });

/**
 * Script d'initialisation des badges de fidélité
 * Insère les 10 badges par défaut dans la base de données
 */
async function initBadges() {
  console.log('🎯 Initialisation des badges de fidélité...\n');

  // Connexion à la base de données
  const connection = await mysql.createConnection(process.env.DATABASE_URL);

  const badgesData = [
    // Badges d'inscription
    {
      badgeCode: 'NOUVEAU_MEMBRE',
      name: '🎓 Nouveau Membre',
      description: 'Bienvenue dans la communauté Sionohmair !',
      icon: '🎓',
      category: 'engagement',
      criteria: 'Créer un compte et démarrer l\'essai gratuit',
      prestigePoints: 10,
    },
    {
      badgeCode: 'ABONNE_ACTIF',
      name: '⭐ Abonné Actif',
      description: 'Vous avez souscrit à l\'abonnement payant',
      icon: '⭐',
      category: 'engagement',
      criteria: 'Effectuer le premier paiement d\'abonnement',
      prestigePoints: 50,
    },

    // Badges de parrainage
    {
      badgeCode: 'PARRAIN_BRONZE',
      name: '🥉 Parrain Bronze',
      description: 'Votre premier filleul s\'est abonné',
      icon: '🥉',
      category: 'referral',
      criteria: 'Parrainer 1 personne qui s\'abonne',
      prestigePoints: 100,
    },
    {
      badgeCode: 'PARRAIN_ARGENT',
      name: '🥈 Parrain Argent',
      description: 'Vous avez parrainé 3 personnes',
      icon: '🥈',
      category: 'referral',
      criteria: 'Parrainer 3 personnes qui s\'abonnent',
      prestigePoints: 250,
    },
    {
      badgeCode: 'PARRAIN_OR',
      name: '🥇 Parrain d\'Or',
      description: 'Vous avez parrainé 5 personnes',
      icon: '🥇',
      category: 'referral',
      criteria: 'Parrainer 5 personnes qui s\'abonnent',
      prestigePoints: 500,
    },
    {
      badgeCode: 'PARRAIN_PLATINE',
      name: '💎 Parrain Platine',
      description: 'Vous êtes un ambassadeur de la communauté',
      icon: '💎',
      category: 'referral',
      criteria: 'Parrainer 10 personnes qui s\'abonnent',
      prestigePoints: 1000,
    },

    // Badges d'ancienneté
    {
      badgeCode: 'VETERAN_1MOIS',
      name: '📅 Vétéran 1 Mois',
      description: 'Vous êtes membre depuis 1 mois',
      icon: '📅',
      category: 'loyalty',
      criteria: 'Être abonné depuis 30 jours',
      prestigePoints: 50,
    },
    {
      badgeCode: 'VETERAN_3MOIS',
      name: '📆 Vétéran 3 Mois',
      description: 'Vous êtes membre depuis 3 mois',
      icon: '📆',
      category: 'loyalty',
      criteria: 'Être abonné depuis 90 jours',
      prestigePoints: 150,
    },
    {
      badgeCode: 'VETERAN_6MOIS',
      name: '🗓️ Vétéran 6 Mois',
      description: 'Vous êtes membre depuis 6 mois',
      icon: '🗓️',
      category: 'loyalty',
      criteria: 'Être abonné depuis 180 jours',
      prestigePoints: 300,
    },
    {
      badgeCode: 'VETERAN_1AN',
      name: '🏆 Vétéran 1 An',
      description: 'Vous êtes membre depuis 1 an !',
      icon: '🏆',
      category: 'loyalty',
      criteria: 'Être abonné depuis 365 jours',
      prestigePoints: 1000,
    },
  ];

  let inserted = 0;
  let skipped = 0;

  for (const badge of badgesData) {
    try {
      // Vérifier si le badge existe déjà
      const [existing] = await connection.execute(
        'SELECT id FROM loyalty_badges WHERE badge_code = ?',
        [badge.badgeCode]
      );

      if (existing.length > 0) {
        console.log(`⏭️  Badge "${badge.name}" existe déjà, ignoré.`);
        skipped++;
      } else {
        // Insérer le badge
        await connection.execute(
          `INSERT INTO loyalty_badges (badge_code, name, description, icon, category, criteria, prestige_points, is_active)
           VALUES (?, ?, ?, ?, ?, ?, ?, 1)`,
          [
            badge.badgeCode,
            badge.name,
            badge.description,
            badge.icon,
            badge.category,
            badge.criteria,
            badge.prestigePoints,
          ]
        );
        console.log(`✅ Badge "${badge.name}" créé avec succès.`);
        inserted++;
      }
    } catch (error) {
      console.error(`❌ Erreur lors de la création du badge "${badge.name}":`, error.message);
    }
  }

  await connection.end();

  console.log(`\n🎉 Initialisation terminée !`);
  console.log(`   - ${inserted} badges créés`);
  console.log(`   - ${skipped} badges déjà existants`);
}

// Exécuter le script
initBadges().catch((error) => {
  console.error('❌ Erreur fatale:', error);
  process.exit(1);
});
