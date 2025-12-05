import Stripe from 'stripe';
import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { ENV } from './_core/env';
import { getDb } from './db';
import { subscriptions, users } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

/**
 * Router pour la gestion des abonnements
 */
export const subscriptionRouter = router({
  /**
   * Récupérer l'abonnement de l'utilisateur connecté
   */
  getMySubscription: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      throw new Error('Database not available');
    }

    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription) {
      return null;
    }

    // Calculer les jours restants de l'essai gratuit
    let daysRemaining = 0;
    if (subscription.status === 'trial' && subscription.trialEndDate) {
      const now = new Date();
      const endDate = new Date(subscription.trialEndDate);
      daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      daysRemaining = Math.max(0, daysRemaining); // Ne pas afficher de valeurs négatives
    }

    return {
      ...subscription,
      daysRemaining,
    };
  }),

  /**
   * Créer un essai gratuit de 30 jours pour l'utilisateur connecté
   */
  createTrialSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier si l'utilisateur a déjà un abonnement
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (existingSubscription) {
      throw new Error('Vous avez déjà un abonnement');
    }

    // Créer l'essai gratuit (30 jours)
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db.insert(subscriptions).values({
      userId: ctx.user.id,
      plan: 'trial',
      status: 'trial',
      trialStartDate: now,
      trialEndDate,
    });

    console.log('[Subscription] Trial created for user:', ctx.user.id);

    return {
      success: true,
      message: 'Essai gratuit de 30 jours activé !',
      trialEndDate,
    };
  }),

  /**
   * Créer une session Stripe Checkout pour l'abonnement avec choix de durée
   */
  createSubscriptionCheckout: protectedProcedure
    .input(
      z.object({
        priceId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
    const db = await getDb();

    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier si l'utilisateur a déjà un abonnement actif
    const [existingSubscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (existingSubscription && existingSubscription.status === 'active') {
      throw new Error('Vous avez déjà un abonnement actif');
    }

    // Récupérer ou créer le Stripe Customer ID
    let stripeCustomerId = ctx.user.stripeCustomerId;

    if (!stripeCustomerId) {
      // Créer un nouveau client Stripe
      const customer = await stripe.customers.create({
        email: ctx.user.email || undefined,
        name: ctx.user.name || undefined,
        metadata: {
          user_id: ctx.user.id.toString(),
        },
      });

      stripeCustomerId = customer.id;

      // Sauvegarder le Stripe Customer ID dans la base de données
      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, ctx.user.id));
    }

    // Créer la session Checkout pour l'abonnement
    const session = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: input.priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${ctx.req.headers.origin}/subscription?success=true`,
      cancel_url: `${ctx.req.headers.origin}/subscription?cancelled=true`,
      allow_promotion_codes: true,
      client_reference_id: ctx.user.id.toString(),
      metadata: {
        user_id: ctx.user.id.toString(),
        customer_email: ctx.user.email || '',
        customer_name: ctx.user.name || '',
        price_id: input.priceId,
      },
    });

    return {
      checkoutUrl: session.url,
      sessionId: session.id,
    };
  }),

  /**
   * Annuler l'abonnement de l'utilisateur connecté
   */
  cancelSubscription: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      throw new Error('Database not available');
    }

    // Récupérer l'abonnement de l'utilisateur
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, ctx.user.id))
      .limit(1);

    if (!subscription) {
      throw new Error('Aucun abonnement trouvé');
    }

    if (subscription.status !== 'active') {
      throw new Error('Votre abonnement n\'est pas actif');
    }

    if (!subscription.stripeSubscriptionId) {
      throw new Error('Aucun abonnement Stripe trouvé');
    }

    // Annuler l'abonnement Stripe
    await stripe.subscriptions.cancel(subscription.stripeSubscriptionId);

    // Mettre à jour le statut dans la base de données
    await db
      .update(subscriptions)
      .set({ status: 'cancelled' })
      .where(eq(subscriptions.userId, ctx.user.id));

    console.log('[Subscription] Cancelled for user:', ctx.user.id);

    return {
      success: true,
      message: 'Abonnement annulé avec succès',
    };
  }),

  /**
   * Créer une session Stripe Billing Portal pour gérer l'abonnement
   */
  createBillingPortalSession: protectedProcedure.mutation(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      throw new Error('Database not available');
    }

    // Récupérer le Stripe Customer ID
    const stripeCustomerId = ctx.user.stripeCustomerId;

    if (!stripeCustomerId) {
      throw new Error('Aucun compte Stripe trouvé');
    }

    // Créer la session Billing Portal
    const session = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${ctx.req.headers.origin}/subscription`,
    });

    return {
      portalUrl: session.url,
    };
  }),
});
