import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { router, protectedProcedure } from './_core/trpc';
import { getDb } from './db';
import { getOrCreateQuota, activatePremium, deactivatePremium } from './lib/quotas';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-11-17.clover',
});

/**
 * Router tRPC pour la gestion Premium et Stripe
 * Sionohmair Insight Academy
 */

export const premiumRouter = router({
  
  /**
   * Obtenir le statut Premium de l'utilisateur actuel
   */
  getMyPremiumStatus: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      const quota = await getOrCreateQuota(userId);
      
      const isPremium = quota.isPremium && quota.premiumUntil && new Date(quota.premiumUntil) > new Date();
      
      return {
        isPremium,
        premiumUntil: quota.premiumUntil,
        stripeCustomerId: quota.stripeCustomerId,
        stripeSubscriptionId: quota.stripeSubscriptionId,
        quotas: {
          copyGenerations: {
            used: quota.copyGenerationsUsed,
            limit: quota.copyGenerationsLimit,
            remaining: quota.copyGenerationsLimit - quota.copyGenerationsUsed,
          },
          contentAnalyses: {
            used: quota.contentAnalysesUsed,
            limit: quota.contentAnalysesLimit,
            remaining: quota.contentAnalysesLimit - quota.contentAnalysesUsed,
          },
          avatars: {
            used: quota.avatarsCount,
            limit: quota.avatarsLimit,
            remaining: quota.avatarsLimit - quota.avatarsCount,
          },
          corrections: {
            used: quota.correctionsUsed,
            limit: quota.correctionsLimit,
            remaining: quota.correctionsLimit - quota.correctionsUsed,
          },
          quotes: {
            used: quota.quotesUsed,
            limit: quota.quotesLimit,
            remaining: quota.quotesLimit - quota.quotesUsed,
          },
        },
        resetAt: quota.resetAt,
      };
    }),
  
  /**
   * Créer une session de paiement Stripe pour passer Premium
   */
  createCheckoutSession: protectedProcedure
    .input(z.object({
      priceId: z.string(),
      successUrl: z.string(),
      cancelUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const user = ctx.user;
      
      try {
        // Créer ou récupérer le customer Stripe
        let customerId: string | undefined;
        const quota = await getOrCreateQuota(userId);
        
        if (quota.stripeCustomerId) {
          customerId = quota.stripeCustomerId;
        } else {
          const customer = await stripe.customers.create({
            email: user.email || undefined,
            metadata: {
              userId: userId.toString(),
            },
          });
          customerId = customer.id;
          
          // Mettre à jour le quota avec le customer ID
          const db = await getDb();
          if (db) {
            await db
              .update(require('../../drizzle/schema_quotas').userQuotas)
              .set({ stripeCustomerId: customerId })
              .where(require('drizzle-orm').eq(require('../../drizzle/schema_quotas').userQuotas.id, quota.id));
          }
        }
        
        // Créer la session de paiement
        const session = await stripe.checkout.sessions.create({
          customer: customerId,
          mode: 'subscription',
          payment_method_types: ['card'],
          line_items: [
            {
              price: input.priceId,
              quantity: 1,
            },
          ],
          success_url: input.successUrl,
          cancel_url: input.cancelUrl,
          metadata: {
            userId: userId.toString(),
          },
        });
        
        return {
          sessionId: session.id,
          url: session.url,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erreur lors de la création de la session de paiement: ${error.message}`,
        });
      }
    }),
  
  /**
   * Créer un portail de gestion de l'abonnement Stripe
   */
  createPortalSession: protectedProcedure
    .input(z.object({
      returnUrl: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      const quota = await getOrCreateQuota(userId);
      
      if (!quota.stripeCustomerId) {
        throw new TRPCError({
          code: 'BAD_REQUEST',
          message: 'Aucun abonnement Stripe trouvé',
        });
      }
      
      try {
        const session = await stripe.billingPortal.sessions.create({
          customer: quota.stripeCustomerId,
          return_url: input.returnUrl,
        });
        
        return {
          url: session.url,
        };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erreur lors de la création du portail: ${error.message}`,
        });
      }
    }),
  
  /**
   * Webhook Stripe pour gérer les événements de paiement
   * Note: Cette procédure doit être appelée depuis un endpoint HTTP séparé
   */
  handleWebhook: protectedProcedure
    .input(z.object({
      event: z.any(),
    }))
    .mutation(async ({ input }) => {
      const event = input.event;
      
      try {
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            const userId = parseInt(session.metadata?.userId || '0');
            
            if (userId && session.subscription) {
              const subscription = await stripe.subscriptions.retrieve(session.subscription as string);
              
              // Activer Premium pour 1 mois (ou selon la période de l'abonnement)
              await activatePremium(
                userId,
                1, // 1 mois par défaut
                session.customer as string,
                subscription.id,
                subscription.items.data[0].price.id
              );
            }
            break;
          }
          
          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            
            // Récupérer l'utilisateur via le customer ID
            const db = await getDb();
            if (db) {
              const quotas = await db
                .select()
                .from(require('../../drizzle/schema_quotas').userQuotas)
                .where(require('drizzle-orm').eq(require('../../drizzle/schema_quotas').userQuotas.stripeCustomerId, customerId))
                .limit(1);
              
              if (quotas.length > 0) {
                const quota = quotas[0];
                
                if (subscription.status === 'active') {
                  // Renouveler Premium
                  await activatePremium(
                    quota.userId,
                    1,
                    customerId,
                    subscription.id,
                    subscription.items.data[0].price.id
                  );
                } else if (subscription.status === 'canceled' || subscription.status === 'unpaid') {
                  // Désactiver Premium
                  await deactivatePremium(quota.userId);
                }
              }
            }
            break;
          }
          
          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            const customerId = subscription.customer as string;
            
            // Désactiver Premium
            const db = await getDb();
            if (db) {
              const quotas = await db
                .select()
                .from(require('../../drizzle/schema_quotas').userQuotas)
                .where(require('drizzle-orm').eq(require('../../drizzle/schema_quotas').userQuotas.stripeCustomerId, customerId))
                .limit(1);
              
              if (quotas.length > 0) {
                await deactivatePremium(quotas[0].userId);
              }
            }
            break;
          }
        }
        
        return { received: true };
      } catch (error: any) {
        throw new TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: `Erreur lors du traitement du webhook: ${error.message}`,
        });
      }
    }),
});
