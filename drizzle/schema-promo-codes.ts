import { int, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * Table des codes promo Stripe
 * Stocke les codes de réduction créés dans Stripe
 */
export const promoCodes = mysqlTable("promo_codes", {
  id: int("id").autoincrement().primaryKey(),
  
  // Code promo (ex: "LAUNCH2024", "WINTER50")
  code: varchar("code", { length: 50 }).notNull().unique(),
  
  // ID du coupon Stripe associé
  stripeCouponId: varchar("stripe_coupon_id", { length: 255 }).notNull(),
  
  // Type de réduction : "percentage" ou "amount"
  discountType: varchar("discount_type", { length: 20 }).notNull(),
  
  // Valeur de la réduction (pourcentage ou montant en centimes)
  discountValue: decimal("discount_value", { precision: 10, scale: 2 }).notNull(),
  
  // Description du code promo
  description: text("description"),
  
  // Date de début de validité
  validFrom: timestamp("valid_from").notNull(),
  
  // Date de fin de validité (null = pas de limite)
  validUntil: timestamp("valid_until"),
  
  // Nombre maximum d'utilisations (null = illimité)
  maxUses: int("max_uses"),
  
  // Nombre d'utilisations actuelles
  currentUses: int("current_uses").notNull().default(0),
  
  // Actif ou non
  isActive: boolean("is_active").notNull().default(true),
  
  // ID de l'admin qui a créé le code
  createdBy: int("created_by").notNull(),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Table des utilisations de codes promo
 * Historique de toutes les utilisations
 */
export const promoCodeUsages = mysqlTable("promo_code_usages", {
  id: int("id").autoincrement().primaryKey(),
  
  // ID du code promo utilisé
  promoCodeId: int("promo_code_id").notNull(),
  
  // ID de l'utilisateur qui a utilisé le code
  userId: int("user_id").notNull(),
  
  // ID de l'abonnement Stripe créé
  stripeSubscriptionId: varchar("stripe_subscription_id", { length: 255 }),
  
  // Montant de la réduction appliquée (en centimes)
  discountAmount: int("discount_amount").notNull(),
  
  // Date d'utilisation
  usedAt: timestamp("used_at").defaultNow().notNull(),
});

export type PromoCode = typeof promoCodes.$inferSelect;
export type InsertPromoCode = typeof promoCodes.$inferInsert;
export type PromoCodeUsage = typeof promoCodeUsages.$inferSelect;
export type InsertPromoCodeUsage = typeof promoCodeUsages.$inferInsert;
