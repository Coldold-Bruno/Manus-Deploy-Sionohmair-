import { pgTable, serial, integer, varchar, text, boolean, timestamp } from 'drizzle-orm/pg-core';
import { users } from './schema';

/**
 * Table des abonnements NFT
 * Gère les licences NFT, périodes d'essai, et états d'abonnement
 */
export const nftSubscriptions = pgTable('nft_subscriptions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Informations NFT
  nftId: varchar('nft_id', { length: 255 }), // ID du NFT sur la blockchain (optionnel si plan gratuit)
  nftContractAddress: varchar('nft_contract_address', { length: 255 }), // Adresse du smart contract
  nftTokenId: varchar('nft_token_id', { length: 255 }), // Token ID du NFT
  
  // Plan et tarification
  plan: varchar('plan', { length: 50 }).notNull(), // 'free', 'starter', 'pro', 'enterprise'
  monthlyPrice: integer('monthly_price').notNull().default(0), // Prix mensuel en centimes (0 pour gratuit)
  
  // État de l'abonnement
  status: varchar('status', { length: 50 }).notNull().default('trial'), 
  // 'trial' = Essai gratuit
  // 'active' = Actif (paiement à jour)
  // 'pending_payment' = En attente de paiement
  // 'suspended' = Suspendu par l'utilisateur
  // 'expired' = Expiré (non payé)
  // 'cancelled' = Annulé définitivement
  
  // Dates importantes
  trialStartDate: timestamp('trial_start_date'), // Début de l'essai gratuit
  trialEndDate: timestamp('trial_end_date'), // Fin de l'essai gratuit (14 jours)
  subscriptionStartDate: timestamp('subscription_start_date'), // Début de l'abonnement payant
  nextPaymentDate: timestamp('next_payment_date'), // Date du prochain paiement
  lastPaymentDate: timestamp('last_payment_date'), // Date du dernier paiement réussi
  expirationDate: timestamp('expiration_date'), // Date d'expiration si non payé
  cancelledAt: timestamp('cancelled_at'), // Date d'annulation
  
  // Relances et notifications
  lastReminderSent: timestamp('last_reminder_sent'), // Dernière relance envoyée
  reminderCount: integer('reminder_count').notNull().default(0), // Nombre de relances envoyées
  
  // Stripe
  stripeSubscriptionId: varchar('stripe_subscription_id', { length: 255 }), // ID de l'abonnement Stripe
  stripeCustomerId: varchar('stripe_customer_id', { length: 255 }), // ID client Stripe
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at').notNull().defaultNow()
});

/**
 * Table de l'historique des paiements
 */
export const paymentHistory = pgTable('payment_history', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => nftSubscriptions.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Informations de paiement
  amount: integer('amount').notNull(), // Montant en centimes
  currency: varchar('currency', { length: 10 }).notNull().default('EUR'),
  status: varchar('status', { length: 50 }).notNull(), 
  // 'pending', 'succeeded', 'failed', 'refunded'
  
  // Stripe
  stripePaymentIntentId: varchar('stripe_payment_intent_id', { length: 255 }),
  stripeChargeId: varchar('stripe_charge_id', { length: 255 }),
  
  // Période couverte
  periodStart: timestamp('period_start').notNull(), // Début de la période couverte
  periodEnd: timestamp('period_end').notNull(), // Fin de la période couverte
  
  // Métadonnées
  paymentMethod: varchar('payment_method', { length: 50 }), // 'card', 'sepa', etc.
  errorMessage: text('error_message'), // Message d'erreur si échec
  
  createdAt: timestamp('created_at').notNull().defaultNow()
});

/**
 * Table des notifications de relance
 */
export const paymentReminders = pgTable('payment_reminders', {
  id: serial('id').primaryKey(),
  subscriptionId: integer('subscription_id').references(() => nftSubscriptions.id).notNull(),
  userId: integer('user_id').references(() => users.id).notNull(),
  
  // Type de relance
  reminderType: varchar('reminder_type', { length: 50 }).notNull(),
  // '7_days_before', '3_days_before', '1_day_before', 'on_expiration', 'after_expiration'
  
  // État
  sent: boolean('sent').notNull().default(false),
  sentAt: timestamp('sent_at'),
  
  // Métadonnées
  createdAt: timestamp('created_at').notNull().defaultNow()
});
