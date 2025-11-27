import express, { Express, Request, Response } from 'express';
import Stripe from 'stripe';
import { ENV } from './_core/env';
import { getDb } from './db';
import { orders, users, formationAccess, moduleProgress, subscriptions } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendOrderConfirmationEmail } from './emailService';

const stripe = new Stripe(ENV.stripeSecretKey, {
  apiVersion: '2025-11-17.clover',
});

/**
 * Enregistrer le webhook Stripe
 * CRITICAL: Doit être enregistré AVANT express.json() pour que la vérification de signature fonctionne
 */
export function registerStripeWebhook(app: Express) {
  app.post(
    '/api/stripe/webhook',
    express.raw({ type: 'application/json' }),
    async (req: Request, res: Response) => {
      const sig = req.headers['stripe-signature'];

      if (!sig) {
        console.error('[Stripe Webhook] Missing signature');
        return res.status(400).send('Missing signature');
      }

      let event: Stripe.Event;

      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          sig,
          ENV.stripeWebhookSecret
        );
      } catch (err: any) {
        console.error('[Stripe Webhook] Signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      // CRITICAL: Détecter les événements de test et retourner la réponse de vérification
      if (event.id.startsWith('evt_test_')) {
        console.log('[Stripe Webhook] Test event detected, returning verification response');
        return res.json({
          verified: true,
        });
      }

      console.log('[Stripe Webhook] Event received:', event.type, event.id);

      try {
        // Traiter les événements Stripe
        switch (event.type) {
          case 'checkout.session.completed': {
            const session = event.data.object as Stripe.Checkout.Session;
            await handleCheckoutSessionCompleted(session);
            break;
          }

          case 'payment_intent.succeeded': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.log('[Stripe Webhook] Payment succeeded:', paymentIntent.id);
            break;
          }

          case 'payment_intent.payment_failed': {
            const paymentIntent = event.data.object as Stripe.PaymentIntent;
            console.error('[Stripe Webhook] Payment failed:', paymentIntent.id);
            break;
          }

          case 'customer.subscription.created': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionCreated(subscription);
            break;
          }

          case 'customer.subscription.updated': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionUpdated(subscription);
            break;
          }

          case 'customer.subscription.deleted': {
            const subscription = event.data.object as Stripe.Subscription;
            await handleSubscriptionDeleted(subscription);
            break;
          }

          case 'invoice.payment_succeeded': {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentSucceeded(invoice);
            break;
          }

          case 'invoice.payment_failed': {
            const invoice = event.data.object as Stripe.Invoice;
            await handleInvoicePaymentFailed(invoice);
            break;
          }

          default:
            console.log('[Stripe Webhook] Unhandled event type:', event.type);
        }

        res.json({ received: true });
      } catch (error: any) {
        console.error('[Stripe Webhook] Error processing event:', error);
        res.status(500).json({ error: error.message });
      }
    }
  );
}

/**
 * Traiter une session de checkout complétée
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log('[Stripe Webhook] Checkout session completed:', session.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Extraire les métadonnées
  const userId = session.metadata?.user_id;
  const productId = session.metadata?.product_id;

  if (!userId || !productId) {
    console.error('[Stripe Webhook] Missing metadata in session:', session.id);
    return;
  }

  // Récupérer le Payment Intent ID
  const paymentIntentId =
    typeof session.payment_intent === 'string'
      ? session.payment_intent
      : session.payment_intent?.id;

  if (!paymentIntentId) {
    console.error('[Stripe Webhook] Missing payment intent in session:', session.id);
    return;
  }

  // Créer la commande dans la base de données
  try {
    await db.insert(orders).values({
      userId: parseInt(userId),
      stripePaymentIntentId: paymentIntentId,
      stripeSessionId: session.id,
      productId: productId,
      status: 'completed',
      notes: `Order created from checkout session ${session.id}`,
    });

    console.log('[Stripe Webhook] Order created successfully for user:', userId);
  } catch (error: any) {
    console.error('[Stripe Webhook] Error creating order:', error);
    return; // Ne pas continuer si la commande n'a pas été créée
  }

  // Récupérer la commande créée pour envoyer l'email
  const [order] = await db
    .select()
    .from(orders)
    .where(eq(orders.stripeSessionId, session.id))
    .limit(1);

  if (!order) {
    console.error('[Stripe Webhook] Order not found after creation');
    return;
  }

  // Mettre à jour le Stripe Customer ID si nécessaire
  if (session.customer && typeof session.customer === 'string') {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, parseInt(userId)))
        .limit(1);

      if (user && !user.stripeCustomerId) {
        await db
          .update(users)
          .set({ stripeCustomerId: session.customer })
          .where(eq(users.id, parseInt(userId)));

        console.log('[Stripe Webhook] Updated Stripe Customer ID for user:', userId);
      }

      // Envoyer l'email de confirmation de commande
      if (user && user.email) {
        const productNames: Record<string, string> = {
          SPRINT_CLARTE: 'Sprint de Clarté',
          ARCHITECTURE_INSIGHT: 'Architecture de l\'Insight',
          PARTENARIAT_STRATEGIQUE: 'Partenariat Stratégique',
          FORMATION_SPRINT_CLARTE: 'Formation Sprint de Clarté',
        };

        const productPrices: Record<string, string> = {
          SPRINT_CLARTE: '490 €',
          ARCHITECTURE_INSIGHT: '10 000 €',
          PARTENARIAT_STRATEGIQUE: '50 000 €',
          FORMATION_SPRINT_CLARTE: '790 €',
        };

        // Si c'est la formation, créer l'accès automatiquement
        if (productId === 'FORMATION_SPRINT_CLARTE') {
          await createFormationAccess(db, parseInt(userId), order.id);
          console.log('[Stripe Webhook] Formation access created for user:', userId);
        }

        await sendOrderConfirmationEmail({
          to: user.email,
          customerName: user.name || 'Client',
          productName: productNames[productId] || productId,
          productPrice: productPrices[productId] || 'N/A',
          orderId: order.id,
          sessionId: session.id,
        });

        console.log('[Stripe Webhook] Confirmation email sent to:', user.email);
      }
    } catch (error: any) {
      console.error('[Stripe Webhook] Error updating customer ID:', error);
    }
  }
}

/**
 * Créer un accès à la formation (90 jours) après achat
 */
async function createFormationAccess(db: any, userId: number, orderId: number) {
  try {
    // Calculer la date de fin d'accès (90 jours)
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 90);

    // Créer l'accès
    const [newAccess] = await db.insert(formationAccess).values({
      userId,
      orderId,
      accessStartDate: startDate,
      accessEndDate: endDate,
      isActive: true,
      isCompleted: false,
      completedModules: 0,
      totalExercisesCompleted: 0,
      overallScore: 0,
      lastAccessDate: startDate,
    });

    // Créer les 9 modules (seul le module 1 est débloqué)
    const modules = [
      { number: 1, name: "Le Code PFPMA (Fondations)", unlocked: true },
      { number: 2, name: "Les 3 Frictions (Diagnostic)", unlocked: false },
      { number: 3, name: "Le Facteur Alpha (α = 22.67)", unlocked: false },
      { number: 4, name: "Le Problème (P)", unlocked: false },
      { number: 5, name: "La Formule (F)", unlocked: false },
      { number: 6, name: "La Preuve (P)", unlocked: false },
      { number: 7, name: "La Méthode (M)", unlocked: false },
      { number: 8, name: "L'Appel (A)", unlocked: false },
      { number: 9, name: "Certification Finale", unlocked: false },
    ];

    for (const module of modules) {
      await db.insert(moduleProgress).values({
        userId,
        formationAccessId: newAccess.insertId,
        moduleNumber: module.number,
        moduleName: module.name,
        isUnlocked: module.unlocked,
        isStarted: false,
        isCompleted: false,
        completedExercises: 0,
        moduleScore: 0,
      });
    }

    console.log('[Formation] Access created successfully for user:', userId, 'until:', endDate);
  } catch (error: any) {
    console.error('[Formation] Error creating access:', error);
    throw error;
  }
}

/**
 * Gérer la création d'un abonnement Stripe
 */
async function handleSubscriptionCreated(stripeSubscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription created:', stripeSubscription.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Récupérer le customer ID
  const customerId = typeof stripeSubscription.customer === 'string' 
    ? stripeSubscription.customer 
    : stripeSubscription.customer?.id;

  if (!customerId) {
    console.error('[Stripe Webhook] Missing customer ID in subscription');
    return;
  }

  // Trouver l'utilisateur par Stripe Customer ID
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.stripeCustomerId, customerId))
    .limit(1);

  if (!user) {
    console.error('[Stripe Webhook] User not found for customer:', customerId);
    return;
  }

  // Vérifier si l'abonnement existe déjà
  const [existingSubscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.userId, user.id))
    .limit(1);

  const now = new Date();

  if (existingSubscription) {
    // Mettre à jour l'abonnement existant
    await db
      .update(subscriptions)
      .set({
        plan: 'paid',
        status: 'active',
        stripeSubscriptionId: stripeSubscription.id,
        paymentDate: now,
        activatedAt: now,
      })
      .where(eq(subscriptions.userId, user.id));

    console.log('[Stripe Webhook] Subscription updated for user:', user.id);
  } else {
    // Créer un nouvel abonnement
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db.insert(subscriptions).values({
      userId: user.id,
      plan: 'paid',
      status: 'active',
      trialStartDate: now,
      trialEndDate,
      stripeCustomerId: customerId,
      stripeSubscriptionId: stripeSubscription.id,
      paymentDate: now,
      activatedAt: now,
    });

    console.log('[Stripe Webhook] Subscription created for user:', user.id);
  }

  // Envoyer l'email de bienvenue après inscription
  try {
    const { sendWelcomeEmailAfterSubscription } = await import('./services/trialEmailService');
    await sendWelcomeEmailAfterSubscription(user.id);
    console.log('[Stripe Webhook] Welcome email sent to user:', user.id);
  } catch (error: any) {
    console.error('[Stripe Webhook] Error sending welcome email:', error);
  }
}

/**
 * Gérer la mise à jour d'un abonnement Stripe
 */
async function handleSubscriptionUpdated(stripeSubscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription updated:', stripeSubscription.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Récupérer l'abonnement dans la base de données
  const [subscription] = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id))
    .limit(1);

  if (!subscription) {
    console.error('[Stripe Webhook] Subscription not found:', stripeSubscription.id);
    return;
  }

  // Mettre à jour le statut en fonction du statut Stripe
  let newStatus: 'trial' | 'active' | 'trial_expired' | 'cancelled' = 'active';

  if (stripeSubscription.status === 'canceled') {
    newStatus = 'cancelled';
  } else if (stripeSubscription.status === 'past_due' || stripeSubscription.status === 'unpaid') {
    newStatus = 'trial_expired'; // Utiliser trial_expired pour indiquer un problème de paiement
  } else if (stripeSubscription.status === 'active') {
    newStatus = 'active';
  }

  await db
    .update(subscriptions)
    .set({ status: newStatus })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id));

  console.log('[Stripe Webhook] Subscription status updated to:', newStatus);
}

/**
 * Gérer la suppression d'un abonnement Stripe
 */
async function handleSubscriptionDeleted(stripeSubscription: Stripe.Subscription) {
  console.log('[Stripe Webhook] Subscription deleted:', stripeSubscription.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Mettre à jour le statut de l'abonnement à "cancelled"
  await db
    .update(subscriptions)
    .set({ status: 'cancelled' })
    .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id));

  console.log('[Stripe Webhook] Subscription marked as cancelled');
}

/**
 * Gérer le paiement réussi d'une facture
 */
async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('[Stripe Webhook] Invoice payment succeeded:', invoice.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Récupérer l'abonnement associé
  const subscriptionId = invoice.subscription as string | undefined;

  if (!subscriptionId) {
    console.log('[Stripe Webhook] No subscription associated with invoice');
    return;
  }

  // Mettre à jour le statut de l'abonnement à "active"
  await db
    .update(subscriptions)
    .set({ 
      status: 'active',
      paymentDate: new Date(),
    })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  console.log('[Stripe Webhook] Subscription payment updated');
}

/**
 * Gérer l'échec de paiement d'une facture
 */
async function handleInvoicePaymentFailed(invoice: any) {
  console.log('[Stripe Webhook] Invoice payment failed:', invoice.id);

  const db = await getDb();
  if (!db) {
    console.error('[Stripe Webhook] Database not available');
    return;
  }

  // Récupérer l'abonnement associé
  const subscriptionId = invoice.subscription as string | undefined;

  if (!subscriptionId) {
    console.log('[Stripe Webhook] No subscription associated with invoice');
    return;
  }

  // Mettre à jour le statut de l'abonnement à "trial_expired" (problème de paiement)
  await db
    .update(subscriptions)
    .set({ status: 'trial_expired' })
    .where(eq(subscriptions.stripeSubscriptionId, subscriptionId));

  console.log('[Stripe Webhook] Subscription marked as payment failed');

  // TODO: Envoyer un email à l'utilisateur pour l'informer de l'échec de paiement
}
