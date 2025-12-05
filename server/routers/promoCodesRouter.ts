import { router, protectedProcedure, publicProcedure } from "../_core/trpc";
import { z } from "zod";
import { promoCodes, promoCodeUsages } from "../../drizzle/schema-promo-codes";
import { eq, and, lte, gte, or, isNull, sql } from "drizzle-orm";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-11-17.clover",
});

export const promoCodesRouter = router({
  /**
   * Créer un nouveau code promo
   * Crée d'abord un coupon dans Stripe, puis enregistre le code en BDD
   */
  create: protectedProcedure
    .input(
      z.object({
        code: z.string().min(3).max(50).toUpperCase(),
        discountType: z.enum(["percentage", "amount"]),
        discountValue: z.number().positive(),
        description: z.string().optional(),
        validFrom: z.date(),
        validUntil: z.date().optional(),
        maxUses: z.number().int().positive().optional(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: any }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé : seuls les admins peuvent créer des codes promo");
      }

      // Créer le coupon dans Stripe
      const stripeCoupon = await stripe.coupons.create({
        id: input.code,
        name: input.code,
        ...(input.discountType === "percentage"
          ? { percent_off: input.discountValue }
          : { amount_off: Math.round(input.discountValue * 100), currency: "eur" }),
        duration: "once", // Appliqué une seule fois
        max_redemptions: input.maxUses,
        redeem_by: input.validUntil ? Math.floor(input.validUntil.getTime() / 1000) : undefined,
      });

      // Enregistrer en base de données
      const [promoCode] = await ctx.db.insert(promoCodes).values({
        code: input.code,
        stripeCouponId: stripeCoupon.id,
        discountType: input.discountType,
        discountValue: input.discountValue.toString(),
        description: input.description || null,
        validFrom: input.validFrom,
        validUntil: input.validUntil || null,
        maxUses: input.maxUses || null,
        currentUses: 0,
        isActive: true,
        createdBy: ctx.user.id,
      });

      return { success: true, promoCodeId: promoCode.insertId };
    }),

  /**
   * Valider un code promo
   * Vérifie que le code existe, est actif, et n'a pas atteint sa limite d'utilisation
   */
  validate: publicProcedure
    .input(z.object({ code: z.string() }))
    .query(async ({ ctx, input }: { ctx: any; input: { code: string } }) => {
      const now = new Date();

      const [promoCode] = await ctx.db
        .select()
        .from(promoCodes)
        .where(
          and(
            eq(promoCodes.code, input.code.toUpperCase()),
            eq(promoCodes.isActive, true),
            lte(promoCodes.validFrom, now),
            or(isNull(promoCodes.validUntil), gte(promoCodes.validUntil, now))
          )
        )
        .limit(1);

      if (!promoCode) {
        return {
          valid: false,
          error: "Code promo invalide ou expiré",
        };
      }

      // Vérifier le nombre d'utilisations
      if (promoCode.maxUses && promoCode.currentUses >= promoCode.maxUses) {
        return {
          valid: false,
          error: "Ce code promo a atteint sa limite d'utilisation",
        };
      }

      return {
        valid: true,
        promoCode: {
          id: promoCode.id,
          code: promoCode.code,
          stripeCouponId: promoCode.stripeCouponId,
          discountType: promoCode.discountType,
          discountValue: parseFloat(promoCode.discountValue),
          description: promoCode.description,
        },
      };
    }),

  /**
   * Enregistrer l'utilisation d'un code promo
   * Appelé après un paiement réussi
   */
  recordUsage: protectedProcedure
    .input(
      z.object({
        promoCodeId: z.number(),
        stripeSubscriptionId: z.string(),
        discountAmount: z.number(),
      })
    )
    .mutation(async ({ ctx, input }: { ctx: any; input: { promoCodeId: number; stripeSubscriptionId: string; discountAmount: number } }) => {
      // Enregistrer l'utilisation
      await ctx.db.insert(promoCodeUsages).values({
        promoCodeId: input.promoCodeId,
        userId: ctx.user.id,
        stripeSubscriptionId: input.stripeSubscriptionId,
        discountAmount: input.discountAmount,
      });

      // Incrémenter le compteur d'utilisations
      await ctx.db
        .update(promoCodes)
        .set({
          currentUses: sql`${promoCodes.currentUses} + 1`,
        })
        .where(eq(promoCodes.id, input.promoCodeId));

      return { success: true };
    }),

  /**
   * Lister tous les codes promo (admin)
   */
  list: protectedProcedure.query(async ({ ctx }: { ctx: any }) => {
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    const codes = await ctx.db.select().from(promoCodes).orderBy(promoCodes.createdAt);

    return codes.map((code: any) => ({
      ...code,
      discountValue: parseFloat(code.discountValue),
    }));
  }),

  /**
   * Désactiver un code promo
   */
  deactivate: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }: { ctx: any; input: { id: number } }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      await ctx.db.update(promoCodes).set({ isActive: false }).where(eq(promoCodes.id, input.id));

      return { success: true };
    }),

  /**
   * Statistiques d'utilisation d'un code promo
   */
  getStats: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }: { ctx: any; input: { id: number } }) => {
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const [promoCode] = await ctx.db
        .select()
        .from(promoCodes)
        .where(eq(promoCodes.id, input.id))
        .limit(1);

      if (!promoCode) {
        throw new Error("Code promo introuvable");
      }

      const usages = await ctx.db
        .select()
        .from(promoCodeUsages)
        .where(eq(promoCodeUsages.promoCodeId, input.id))
        .orderBy(promoCodeUsages.usedAt);

      const totalDiscount = usages.reduce((sum: number, usage: any) => sum + usage.discountAmount, 0);

      return {
        promoCode: {
          ...promoCode,
          discountValue: parseFloat(promoCode.discountValue),
        },
        usages,
        stats: {
          totalUses: usages.length,
          totalDiscountGiven: totalDiscount / 100, // En euros
          averageDiscountPerUse: usages.length > 0 ? totalDiscount / usages.length / 100 : 0,
        },
      };
    }),
});
