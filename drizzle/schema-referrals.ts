import { int, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Table des parrainages
 * Stocke les liens de parrainage et les conversions
 */
export const referrals = mysqlTable("referrals", {
  id: int("id").autoincrement().primaryKey(),
  
  // ID de l'utilisateur parrain (celui qui partage le lien)
  referrerId: int("referrer_id").notNull(),
  
  // Code de parrainage unique (ex: "BRUNO2024XYZ")
  referralCode: varchar("referral_code", { length: 50 }).notNull().unique(),
  
  // ID de l'utilisateur filleul (celui qui s'inscrit via le lien)
  referredUserId: int("referred_user_id"),
  
  // Email du filleul (stocké dès l'inscription, avant la conversion)
  referredUserEmail: varchar("referred_user_email", { length: 255 }),
  
  // Statut du parrainage
  // - "pending": lien créé, pas encore utilisé
  // - "signed_up": filleul inscrit mais pas encore abonné
  // - "converted": filleul abonné, crédit accordé au parrain
  status: varchar("status", { length: 20 }).notNull().default("pending"),
  
  // Date de clic sur le lien de parrainage
  clickedAt: timestamp("clicked_at"),
  
  // Date d'inscription du filleul
  signedUpAt: timestamp("signed_up_at"),
  
  // Date de conversion (abonnement payant)
  convertedAt: timestamp("converted_at"),
  
  // ID de l'abonnement Stripe du filleul
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  
  // Crédit accordé au parrain (en jours)
  creditDays: int("credit_days").default(30),
  
  // Crédit appliqué ou non
  creditApplied: boolean("credit_applied").notNull().default(false),
  
  // Date d'application du crédit
  creditAppliedAt: timestamp("credit_applied_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Table des crédits de parrainage
 * Historique de tous les crédits accordés
 */
export const referralCredits = mysqlTable("referral_credits", {
  id: int("id").autoincrement().primaryKey(),
  
  // ID de l'utilisateur qui reçoit le crédit
  userId: int("user_id").notNull(),
  
  // ID du parrainage associé
  referralId: int("referral_id").notNull(),
  
  // Nombre de jours de crédit
  creditDays: int("credit_days").notNull(),
  
  // Date d'expiration du crédit
  expiresAt: timestamp("expires_at").notNull(),
  
  // Crédit utilisé ou non
  used: boolean("used").notNull().default(false),
  
  // Date d'utilisation du crédit
  usedAt: timestamp("used_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Referral = typeof referrals.$inferSelect;
export type InsertReferral = typeof referrals.$inferInsert;
export type ReferralCredit = typeof referralCredits.$inferSelect;
export type InsertReferralCredit = typeof referralCredits.$inferInsert;
