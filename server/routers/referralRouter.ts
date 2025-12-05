import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { referrals, referralCredits } from "../../drizzle/schema-referrals";
import { subscriptions } from "../../drizzle/schema";
import { eq, and, sql } from "drizzle-orm";
import { nanoid } from "nanoid";

export const referralRouter = router({
  /**
   * Générer un lien de parrainage unique pour l'utilisateur connecté
   * Si un lien existe déjà, le retourner
   */
  getMyReferralLink: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    // Vérifier si un lien existe déjà
    const [existingReferral] = await ctx.db
      .select()
      .from(referrals)
      .where(and(eq(referrals.referrerId, ctx.user.id), eq(referrals.status, "pending")))
      .limit(1);

    if (existingReferral) {
      return {
        referralCode: existingReferral.referralCode,
        referralUrl: `${process.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3000"}/signup?ref=${existingReferral.referralCode}`,
      };
    }

    // Créer un nouveau code de parrainage
    const referralCode = `${ctx.user.name?.substring(0, 5).toUpperCase() || "USER"}${nanoid(8)}`;

    await ctx.db.insert(referrals).values({
      referrerId: ctx.user.id,
      referralCode,
      status: "pending",
    });

    return {
      referralCode,
      referralUrl: `${process.env.VITE_OAUTH_PORTAL_URL || "http://localhost:3000"}/signup?ref=${referralCode}`,
    };
  }),

  /**
   * Obtenir les statistiques de parrainage de l'utilisateur connecté
   */
  getMyReferralStats: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    const myReferrals = await ctx.db
      .select()
      .from(referrals)
      .where(eq(referrals.referrerId, ctx.user.id))
      .orderBy(referrals.createdAt);

    const totalClicks = myReferrals.filter((r: any) => r.clickedAt).length;
    const totalSignups = myReferrals.filter((r: any) => r.status === "signed_up" || r.status === "converted").length;
    const totalConversions = myReferrals.filter((r: any) => r.status === "converted").length;
    const totalCreditsEarned = myReferrals
      .filter((r: any) => r.creditApplied)
      .reduce((sum: number, r: any) => sum + (r.creditDays || 0), 0);

    return {
      totalClicks,
      totalSignups,
      totalConversions,
      totalCreditsEarned,
      conversionRate: totalSignups > 0 ? (totalConversions / totalSignups) * 100 : 0,
      referrals: myReferrals.map((r: any) => ({
        id: r.id,
        referredUserEmail: r.referredUserEmail,
        status: r.status,
        signedUpAt: r.signedUpAt,
        convertedAt: r.convertedAt,
        creditApplied: r.creditApplied,
        creditDays: r.creditDays,
      })),
    };
  }),

  /**
   * Enregistrer un clic sur un lien de parrainage
   * Appelé lors de l'arrivée sur la page d'inscription avec ?ref=CODE
   */
  trackReferralClick: publicProcedure
    .input(z.object({ referralCode: z.string() }))
    .mutation(async ({ ctx, input }: { ctx: any; input: { referralCode: string } }) => {
      const [referral] = await ctx.db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, input.referralCode))
        .limit(1);

      if (!referral) {
        throw new Error("Code de parrainage invalide");
      }

      // Mettre à jour la date de clic si pas déjà cliqué
      if (!referral.clickedAt) {
        await ctx.db
          .update(referrals)
          .set({ clickedAt: new Date() })
          .where(eq(referrals.id, referral.id));
      }

      return { success: true, referrerId: referral.referrerId };
    }),

  /**
   * Enregistrer une inscription via un lien de parrainage
   * Appelé après la création du compte utilisateur
   */
  trackReferralSignup: protectedProcedure
    .input(z.object({ referralCode: z.string() }))
    .mutation(async ({ ctx, input }: { ctx: any; input: { referralCode: string } }) => {
      const [referral] = await ctx.db
        .select()
        .from(referrals)
        .where(eq(referrals.referralCode, input.referralCode))
        .limit(1);

      if (!referral) {
        throw new Error("Code de parrainage invalide");
      }

      // Mettre à jour avec l'ID du filleul
      await ctx.db
        .update(referrals)
        .set({
          referredUserId: ctx.user.id,
          referredUserEmail: ctx.user.email,
          status: "signed_up",
          signedUpAt: new Date(),
        })
        .where(eq(referrals.id, referral.id));

      return { success: true };
    }),

  /**
   * Enregistrer une conversion (abonnement payant)
   * Appelé après un paiement Stripe réussi
   * Accorde automatiquement 1 mois gratuit au parrain
   */
  trackReferralConversion: protectedProcedure
    .input(
      z.object({
        referralCode: z.string(),
        stripeSubscriptionId: z.string(),
      })
    )
    .mutation(
      async ({
        ctx,
        input,
      }: {
        ctx: any;
        input: { referralCode: string; stripeSubscriptionId: string };
      }) => {
        const [referral] = await ctx.db
          .select()
          .from(referrals)
          .where(eq(referrals.referralCode, input.referralCode))
          .limit(1);

        if (!referral) {
          throw new Error("Code de parrainage invalide");
        }

        // Mettre à jour le statut de conversion
        await ctx.db
          .update(referrals)
          .set({
            status: "converted",
            convertedAt: new Date(),
            stripeSubscriptionId: input.stripeSubscriptionId,
            creditApplied: true,
            creditAppliedAt: new Date(),
          })
          .where(eq(referrals.id, referral.id));

        // Accorder 30 jours de crédit au parrain
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 365); // Crédit valable 1 an

        await ctx.db.insert(referralCredits).values({
          userId: referral.referrerId,
          referralId: referral.id,
          creditDays: 30,
          expiresAt,
          used: false,
        });

        // Prolonger l'abonnement du parrain de 30 jours
        const [subscription] = await ctx.db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.userId, referral.referrerId))
          .limit(1);

        if (subscription) {
          const currentEndDate = subscription.currentPeriodEnd
            ? new Date(subscription.currentPeriodEnd)
            : new Date();
          currentEndDate.setDate(currentEndDate.getDate() + 30);

          await ctx.db
            .update(subscriptions)
            .set({
              currentPeriodEnd: currentEndDate,
            })
            .where(eq(subscriptions.userId, referral.referrerId));
        }

        return { success: true, creditDays: 30 };
      }
    ),

  /**
   * Obtenir tous les crédits de parrainage de l'utilisateur
   */
  getMyReferralCredits: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    const credits = await ctx.db
      .select()
      .from(referralCredits)
      .where(eq(referralCredits.userId, ctx.user.id))
      .orderBy(referralCredits.createdAt);

    const totalCredits = credits.reduce((sum: number, c: any) => sum + c.creditDays, 0);
    const usedCredits = credits.filter((c: any) => c.used).reduce((sum: number, c: any) => sum + c.creditDays, 0);
    const availableCredits = totalCredits - usedCredits;

    return {
      credits,
      totalCredits,
      usedCredits,
      availableCredits,
    };
  }),

  /**
   * Admin : Obtenir toutes les statistiques de parrainage
   */
  getAllReferralStats: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    const allReferrals = await ctx.db.select().from(referrals).orderBy(referrals.createdAt);

    const totalReferrals = allReferrals.length;
    const totalConversions = allReferrals.filter((r: any) => r.status === "converted").length;
    const totalCreditsGiven = allReferrals
      .filter((r: any) => r.creditApplied)
      .reduce((sum: number, r: any) => sum + (r.creditDays || 0), 0);

    return {
      totalReferrals,
      totalConversions,
      totalCreditsGiven,
      conversionRate: totalReferrals > 0 ? (totalConversions / totalReferrals) * 100 : 0,
      referrals: allReferrals,
    };
  }),
});
