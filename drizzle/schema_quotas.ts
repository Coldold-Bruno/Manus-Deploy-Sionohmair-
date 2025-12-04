import { mysqlTable, int, boolean, timestamp, varchar } from 'drizzle-orm/mysql-core';
import { users } from './schema';

/**
 * Table des quotas utilisateurs pour le système Gratuit vs Premium
 * 
 * Quotas mensuels pour les utilisateurs gratuits :
 * - Générateur de Copy : 5 générations/mois
 * - Analyseur de Contenu : 10 analyses/mois
 * - Persona Builder : 3 avatars max
 * - Correcteur : 5 corrections/mois
 * - Générateur de Citations : 5 citations/mois
 * 
 * Les utilisateurs Premium ont un accès illimité (isPremium = true)
 */
export const userQuotas = mysqlTable('user_quotas', {
  id: int('id').autoincrement().primaryKey(),
  userId: int('userId')
    .notNull()
    .references(() => users.id, { onDelete: 'cascade' }),

  // Quotas pour le Générateur de Copy
  copyGenerationsUsed: int('copyGenerationsUsed').notNull().default(0),
  copyGenerationsLimit: int('copyGenerationsLimit').notNull().default(5),

  // Quotas pour l'Analyseur de Contenu
  contentAnalysesUsed: int('contentAnalysesUsed').notNull().default(0),
  contentAnalysesLimit: int('contentAnalysesLimit').notNull().default(10),

  // Quotas pour le Persona Builder (nombre d'avatars créés)
  avatarsCount: int('avatarsCount').notNull().default(0),
  avatarsLimit: int('avatarsLimit').notNull().default(3),

  // Quotas pour le Correcteur
  correctionsUsed: int('correctionsUsed').notNull().default(0),
  correctionsLimit: int('correctionsLimit').notNull().default(5),

  // Quotas pour le Générateur de Citations
  quotesUsed: int('quotesUsed').notNull().default(0),
  quotesLimit: int('quotesLimit').notNull().default(5),

  // Date de réinitialisation des quotas (chaque mois)
  resetAt: timestamp('resetAt').notNull().defaultNow(),

  // Statut Premium
  isPremium: boolean('isPremium').notNull().default(false),
  premiumUntil: timestamp('premiumUntil'),

  // Stripe
  stripeCustomerId: varchar('stripeCustomerId', { length: 255 }),
  stripeSubscriptionId: varchar('stripeSubscriptionId', { length: 255 }),
  stripePriceId: varchar('stripePriceId', { length: 255 }),

  // Timestamps
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow().onUpdateNow(),
});

export type UserQuota = typeof userQuotas.$inferSelect;
export type NewUserQuota = typeof userQuotas.$inferInsert;
