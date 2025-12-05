import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { loyaltyBadges, userLoyaltyBadges } from "../../drizzle/schema-loyalty-badges";
import { subscriptions, users } from "../../drizzle/schema";
import { referrals } from "../../drizzle/schema-referrals";
import { eq, and, sql, count } from "drizzle-orm";

/**
 * Router pour gérer les badges de fidélité
 * Attribution automatique basée sur l'engagement et l'ancienneté
 */
export const loyaltyBadgesRouter = router({
  /**
   * Obtenir tous les badges disponibles
   */
  getAllBadges: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    const badges = await ctx.db
      .select()
      .from(loyaltyBadges)
      .where(eq(loyaltyBadges.isActive, true))
      .orderBy(loyaltyBadges.category, loyaltyBadges.prestigePoints);

    return badges;
  }),

  /**
   * Obtenir les badges de l'utilisateur connecté
   */
  getMyBadges: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    const userBadges = await ctx.db
      .select({
        id: userLoyaltyBadges.id,
        badgeId: userLoyaltyBadges.badgeId,
        earnedAt: userLoyaltyBadges.earnedAt,
        badgeCode: loyaltyBadges.badgeCode,
        name: loyaltyBadges.name,
        description: loyaltyBadges.description,
        icon: loyaltyBadges.icon,
        category: loyaltyBadges.category,
        prestigePoints: loyaltyBadges.prestigePoints,
      })
      .from(userLoyaltyBadges)
      .innerJoin(loyaltyBadges, eq(userLoyaltyBadges.badgeId, loyaltyBadges.id))
      .where(eq(userLoyaltyBadges.userId, ctx.user.id))
      .orderBy(userLoyaltyBadges.earnedAt);

    const totalPrestige = userBadges.reduce((sum: number, badge: any) => sum + badge.prestigePoints, 0);

    return {
      badges: userBadges,
      totalBadges: userBadges.length,
      totalPrestige,
    };
  }),

  /**
   * Vérifier et attribuer automatiquement les badges à l'utilisateur connecté
   * Appelé après chaque action importante (abonnement, parrainage, etc.)
   */
  checkAndAwardBadges: protectedProcedure.mutation(async ({ ctx }: { ctx: any }) => {
    const newBadges: any[] = [];

    // Récupérer l'abonnement de l'utilisateur
    const [subscription] = await ctx.db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription) {
      return { newBadges: [] };
    }

    // Récupérer les badges déjà obtenus
    const existingBadges = await ctx.db
      .select()
      .from(userLoyaltyBadges)
      .where(eq(userLoyaltyBadges.userId, ctx.user.id));

    const existingBadgeCodes = new Set(
      await Promise.all(
        existingBadges.map(async (ub: any) => {
          const [badge] = await ctx.db
            .select()
            .from(loyaltyBadges)
            .where(eq(loyaltyBadges.id, ub.badgeId))
            .limit(1);
          return badge?.badgeCode;
        })
      )
    );

    // Fonction helper pour attribuer un badge
    const awardBadge = async (badgeCode: string) => {
      if (existingBadgeCodes.has(badgeCode)) return;

      const [badge] = await ctx.db
        .select()
        .from(loyaltyBadges)
        .where(eq(loyaltyBadges.badgeCode, badgeCode))
        .limit(1);

      if (badge) {
        await ctx.db.insert(userLoyaltyBadges).values({
          userId: ctx.user.id,
          badgeId: badge.id,
        });

        newBadges.push({
          badgeCode: badge.badgeCode,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          prestigePoints: badge.prestigePoints,
        });
      }
    };

    // 1. Badge "Nouveau Membre" - Dès l'inscription
    if (subscription.status === 'trial' || subscription.status === 'active') {
      await awardBadge('NOUVEAU_MEMBRE');
    }

    // 2. Badge "Abonné Actif" - Dès le premier paiement
    if (subscription.status === 'active' && subscription.paymentDate) {
      await awardBadge('ABONNE_ACTIF');
    }

    // 3. Badges de parrainage
    const myReferrals = await ctx.db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id));

    const convertedReferrals = myReferrals.filter((r: any) => r.status === 'converted');

    if (convertedReferrals.length >= 1) {
      await awardBadge('PARRAIN_BRONZE'); // 1+ filleuls
    }
    if (convertedReferrals.length >= 3) {
      await awardBadge('PARRAIN_ARGENT'); // 3+ filleuls
    }
    if (convertedReferrals.length >= 5) {
      await awardBadge('PARRAIN_OR'); // 5+ filleuls
    }
    if (convertedReferrals.length >= 10) {
      await awardBadge('PARRAIN_PLATINE'); // 10+ filleuls
    }

    // 4. Badges d'ancienneté
    const now = new Date();
    const subscriptionAge = now.getTime() - subscription.createdAt.getTime();
    const daysSubscribed = Math.floor(subscriptionAge / (1000 * 60 * 60 * 24));

    if (daysSubscribed >= 30) {
      await awardBadge('VETERAN_1MOIS'); // 1 mois
    }
    if (daysSubscribed >= 90) {
      await awardBadge('VETERAN_3MOIS'); // 3 mois
    }
    if (daysSubscribed >= 180) {
      await awardBadge('VETERAN_6MOIS'); // 6 mois
    }
    if (daysSubscribed >= 365) {
      await awardBadge('VETERAN_1AN'); // 1 an
    }

    return { newBadges };
  }),

  /**
   * Admin : Initialiser les badges par défaut dans la base de données
   */
  initializeBadges: protectedProcedure.mutation(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Accès refusé : seuls les admins peuvent initialiser les badges');
    }

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

    // Insérer les badges s'ils n'existent pas déjà
    for (const badgeData of badgesData) {
      const [existing] = await ctx.db
        .select()
        .from(loyaltyBadges)
        .where(eq(loyaltyBadges.badgeCode, badgeData.badgeCode))
        .limit(1);

      if (!existing) {
        await ctx.db.insert(loyaltyBadges).values(badgeData);
      }
    }

    return { success: true, badgesCreated: badgesData.length };
  }),

  /**
   * Admin : Obtenir les statistiques des badges
   */
  getBadgeStats: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== 'admin') {
      throw new Error('Accès refusé');
    }

    const allBadges = await ctx.db.select().from(loyaltyBadges);

    const badgeStats = await Promise.all(
      allBadges.map(async (badge: any) => {
        const [result] = await ctx.db
          .select({ count: count() })
          .from(userLoyaltyBadges)
          .where(eq(userLoyaltyBadges.badgeId, badge.id));

        return {
          badgeCode: badge.badgeCode,
          name: badge.name,
          icon: badge.icon,
          category: badge.category,
          prestigePoints: badge.prestigePoints,
          usersWithBadge: result?.count || 0,
        };
      })
    );

    return badgeStats.sort((a, b) => b.usersWithBadge - a.usersWithBadge);
  }),
});
