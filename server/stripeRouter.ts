import Stripe from 'stripe';
import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from './_core/trpc';
import { ProductId, getProduct } from './products';
import { ENV } from './_core/env';
import { getDb } from './db';
import { orders, users, subscriptions } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

export const stripeRouter = router({
  /**
   * Créer une session de paiement Stripe Checkout
   */
  createCheckoutSession: protectedProcedure
    .input(
      z.object({
        productId: z.enum(['SPRINT_CLARTE', 'ARCHITECTURE_INSIGHT', 'PARTENARIAT_STRATEGIQUE', 'FORMATION_SPRINT_CLARTE']),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const product = getProduct(input.productId as ProductId);
      const db = await getDb();

      if (!db) {
        throw new Error('Database not available');
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

      // Créer la session Checkout
      const session = await stripe.checkout.sessions.create({
        customer: stripeCustomerId,
        line_items: [
          {
            price_data: {
              currency: product.currency,
              product_data: {
                name: product.name,
                description: product.description,
              },
              unit_amount: product.price,
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: `${ctx.req.headers.origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${ctx.req.headers.origin}/payment/cancel`,
        allow_promotion_codes: true,
        client_reference_id: ctx.user.id.toString(),
        metadata: {
          user_id: ctx.user.id.toString(),
          product_id: input.productId,
          customer_email: ctx.user.email || '',
          customer_name: ctx.user.name || '',
        },
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Créer une session de paiement pour l'abonnement mensuel (36€/mois)
   */
  createSubscriptionCheckout: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();

      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier si l'utilisateur a déjà un abonnement
      const existingSubscription = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, ctx.user.id))
        .limit(1);

      if (existingSubscription.length > 0 && existingSubscription[0].status === 'active') {
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
            price_data: {
              currency: 'eur',
              product_data: {
                name: 'Abonnement Sionohmair Insight Academy',
                description: 'Accès complet à tous les outils de Content Marketing & Copywriting',
              },
              unit_amount: 3600, // 36€ en centimes
              recurring: {
                interval: 'month',
              },
            },
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
        },
      });

      return {
        checkoutUrl: session.url,
        sessionId: session.id,
      };
    }),

  /**
   * Récupérer l'historique des commandes de l'utilisateur
   */
  getMyOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();

    if (!db) {
      return [];
    }

    const userOrders = await db
      .select()
      .from(orders)
      .where(eq(orders.userId, ctx.user.id))
      .orderBy(desc(orders.createdAt));

    // Enrichir avec les détails du produit
    const enrichedOrders = userOrders.map((order) => {
      const product = getProduct(order.productId as ProductId);
      return {
        ...order,
        productName: product.name,
        productDescription: product.description,
      };
    });

    return enrichedOrders;
  }),

  /**
   * Récupérer toutes les commandes (admin uniquement)
   */
  getAllOrders: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    // Récupérer toutes les commandes avec les informations utilisateur
    const allOrders = await db
      .select({
        order: orders,
        user: users,
      })
      .from(orders)
      .leftJoin(users, eq(orders.userId, users.id))
      .orderBy(desc(orders.createdAt));

    return allOrders.map((row) => ({
      ...row.order,
      user: row.user,
    }));
  }),

  /**
   * Récupérer les détails d'une commande spécifique
   */
  getOrderDetails: protectedProcedure
    .input(z.object({ orderId: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();

      if (!db) {
        throw new Error('Database not available');
      }

      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (!order || order.userId !== ctx.user.id) {
        throw new Error('Order not found');
      }

      // Récupérer les détails du paiement depuis Stripe
      const paymentIntent = await stripe.paymentIntents.retrieve(order.stripePaymentIntentId, {
        expand: ['latest_charge'],
      });

      const product = getProduct(order.productId as ProductId);

      // Récupérer le receipt_url depuis le charge
      let receiptUrl: string | null = null;
      if (paymentIntent.latest_charge && typeof paymentIntent.latest_charge !== 'string') {
        receiptUrl = paymentIntent.latest_charge.receipt_url;
      }

      return {
        ...order,
        productName: product.name,
        productDescription: product.description,
        productFeatures: product.features,
        paymentDetails: {
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          status: paymentIntent.status,
          created: paymentIntent.created,
          receipt_url: receiptUrl,
        },
      };
    }),
});
