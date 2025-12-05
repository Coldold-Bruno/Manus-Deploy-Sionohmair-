import { router, protectedProcedure } from "../_core/trpc";
import { z } from "zod";
import { subscriptions } from "../../drizzle/schema";
import { eq, and, gte, lte, sql } from "drizzle-orm";

export const subscriptionAnalyticsRouter = router({
  /**
   * Obtenir les métriques clés d'abonnement (MRR, conversions, churn)
   */
  getMetrics: protectedProcedure
    .input(
      z.object({
        period: z.enum(["7d", "30d", "90d", "1y", "all"]).default("30d"),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: { period: string } }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      // Calculer la date de début selon la période
      const now = new Date();
      let startDate = new Date();

      switch (input.period) {
        case "7d":
          startDate.setDate(now.getDate() - 7);
          break;
        case "30d":
          startDate.setDate(now.getDate() - 30);
          break;
        case "90d":
          startDate.setDate(now.getDate() - 90);
          break;
        case "1y":
          startDate.setFullYear(now.getFullYear() - 1);
          break;
        case "all":
          startDate = new Date(0); // Depuis le début
          break;
      }

      // Récupérer tous les abonnements
      const allSubscriptions = await ctx.db
        .select()
        .from(subscriptions)
        .where(gte(subscriptions.createdAt, startDate))
        .orderBy(subscriptions.createdAt);

      // Récupérer tous les abonnements actifs
      const activeSubscriptions = await ctx.db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.status, "active"));

      // Calculer le MRR (Monthly Recurring Revenue)
      // Prix par durée : Mensuel 29€, Trimestriel 78€ (26€/mois), Semestriel 148€ (24.67€/mois), Annuel 278€ (23.17€/mois)
      const priceMapping: Record<string, number> = {
        price_1QfzfnE4uS69NTe4nXJpg9Aw: 29, // Mensuel
        price_1Qg0MIE4uS69NTe4Y9gZqPzX: 26, // Trimestriel (78€ / 3)
        price_1Qg0MIE4uS69NTe4Y9gZqPzY: 24.67, // Semestriel (148€ / 6)
        price_1Qg0MIE4uS69NTe4Y9gZqPzZ: 23.17, // Annuel (278€ / 12)
      };

      const mrr = activeSubscriptions.reduce((sum: number, sub: any) => {
        const priceId = sub.stripePriceId || "";
        return sum + (priceMapping[priceId] || 29);
      }, 0);

      // Calculer le nombre d'abonnements par durée
      const subscriptionsByDuration = {
        monthly: activeSubscriptions.filter((s: any) => s.stripePriceId === "price_1QfzfnE4uS69NTe4nXJpg9Aw")
          .length,
        quarterly: activeSubscriptions.filter((s: any) => s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzX")
          .length,
        semiannual: activeSubscriptions.filter(
          (s: any) => s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzY"
        ).length,
        annual: activeSubscriptions.filter((s: any) => s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzZ")
          .length,
      };

      // Calculer le taux de conversion (essais gratuits → abonnements payants)
      const totalTrials = allSubscriptions.filter((s: any) => s.status === "trial").length;
      const totalActive = allSubscriptions.filter((s: any) => s.status === "active").length;
      const conversionRate = totalTrials + totalActive > 0 ? (totalActive / (totalTrials + totalActive)) * 100 : 0;

      // Calculer le churn rate (taux de désabonnement)
      const cancelledSubscriptions = allSubscriptions.filter((s: any) => s.status === "cancelled").length;
      const totalSubscriptions = allSubscriptions.length;
      const churnRate = totalSubscriptions > 0 ? (cancelledSubscriptions / totalSubscriptions) * 100 : 0;

      // Calculer l'évolution du MRR sur la période
      const mrrHistory: Array<{ date: string; mrr: number }> = [];
      const daysInPeriod = input.period === "7d" ? 7 : input.period === "30d" ? 30 : input.period === "90d" ? 90 : input.period === "1y" ? 365 : 365;
      const intervalDays = Math.max(1, Math.floor(daysInPeriod / 10)); // 10 points de données

      for (let i = 0; i <= daysInPeriod; i += intervalDays) {
        const date = new Date(startDate);
        date.setDate(date.getDate() + i);

        const subsAtDate = allSubscriptions.filter((s: any) => {
          const createdAt = new Date(s.createdAt);
          return createdAt <= date && (s.status === "active" || s.status === "trial");
        });

        const mrrAtDate = subsAtDate.reduce((sum: number, sub: any) => {
          const priceId = sub.stripePriceId || "";
          return sum + (priceMapping[priceId] || 29);
        }, 0);

        mrrHistory.push({
          date: date.toISOString().split("T")[0],
          mrr: Math.round(mrrAtDate),
        });
      }

      // Calculer les conversions par durée
      const conversionsByDuration = {
        monthly: allSubscriptions.filter(
          (s: any) => s.status === "active" && s.stripePriceId === "price_1QfzfnE4uS69NTe4nXJpg9Aw"
        ).length,
        quarterly: allSubscriptions.filter(
          (s: any) => s.status === "active" && s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzX"
        ).length,
        semiannual: allSubscriptions.filter(
          (s: any) => s.status === "active" && s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzY"
        ).length,
        annual: allSubscriptions.filter(
          (s: any) => s.status === "active" && s.stripePriceId === "price_1Qg0MIE4uS69NTe4Y9gZqPzZ"
        ).length,
      };

      return {
        mrr: Math.round(mrr),
        arr: Math.round(mrr * 12), // Annual Recurring Revenue
        totalActiveSubscriptions: activeSubscriptions.length,
        totalTrials,
        totalCancelled: cancelledSubscriptions,
        conversionRate: Math.round(conversionRate * 10) / 10,
        churnRate: Math.round(churnRate * 10) / 10,
        subscriptionsByDuration,
        conversionsByDuration,
        mrrHistory,
        period: input.period,
      };
    }),

  /**
   * Obtenir la liste des abonnements récents
   */
  getRecentSubscriptions: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(20),
      })
    )
    .query(async ({ ctx, input }: { ctx: any; input: { limit: number } }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const recentSubscriptions = await ctx.db
        .select()
        .from(subscriptions)
        .orderBy(sql`${subscriptions.createdAt} DESC`)
        .limit(input.limit);

      return recentSubscriptions;
    }),

  /**
   * Obtenir les statistiques de rétention
   */
  getRetentionStats: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    // Récupérer tous les abonnements
    const allSubscriptions = await ctx.db.select().from(subscriptions);

    // Calculer la durée moyenne d'abonnement
    const activeSubscriptions = allSubscriptions.filter((s: any) => s.status === "active");
    const averageLifetime =
      activeSubscriptions.reduce((sum: number, sub: any) => {
        const createdAt = new Date(sub.createdAt);
        const now = new Date();
        const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
        return sum + diffDays;
      }, 0) / (activeSubscriptions.length || 1);

    // Calculer le taux de rétention à 30, 60, 90 jours
    const now = new Date();
    const retention30 = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 30 && s.status === "active";
    }).length;

    const retention60 = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 60 && s.status === "active";
    }).length;

    const retention90 = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 90 && s.status === "active";
    }).length;

    const total30Plus = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 30;
    }).length;

    const total60Plus = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 60;
    }).length;

    const total90Plus = allSubscriptions.filter((s: any) => {
      const createdAt = new Date(s.createdAt);
      const diffDays = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
      return diffDays >= 90;
    }).length;

    return {
      averageLifetimeDays: Math.round(averageLifetime),
      retention30Days: total30Plus > 0 ? Math.round((retention30 / total30Plus) * 100) : 0,
      retention60Days: total60Plus > 0 ? Math.round((retention60 / total60Plus) * 100) : 0,
      retention90Days: total90Plus > 0 ? Math.round((retention90 / total90Plus) * 100) : 0,
    };
  }),
});
