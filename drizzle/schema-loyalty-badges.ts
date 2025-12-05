import { int, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * Table des badges de fidélité (définitions)
 * Catalogue de tous les badges disponibles
 */
export const loyaltyBadges = mysqlTable("loyalty_badges", {
  id: int("id").autoincrement().primaryKey(),
  
  // Code unique du badge (ex: "PARRAIN_OR", "VETERAN_1AN")
  badgeCode: varchar("badge_code", { length: 50 }).notNull().unique(),
  
  // Nom du badge
  name: varchar("name", { length: 255 }).notNull(),
  
  // Description du badge
  description: text("description").notNull(),
  
  // Icône emoji ou nom d'icône
  icon: varchar("icon", { length: 50 }).notNull(),
  
  // Catégorie : "referral", "loyalty", "engagement", "achievement"
  category: varchar("category", { length: 50 }).notNull(),
  
  // Critère d'obtention (description textuelle)
  criteria: text("criteria").notNull(),
  
  // Points de prestige accordés
  prestigePoints: int("prestige_points").notNull().default(0),
  
  // Badge actif ou non
  isActive: boolean("is_active").notNull().default(true),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

/**
 * Table des badges de fidélité obtenus par les utilisateurs
 * Historique de tous les badges gagnés
 */
export const userLoyaltyBadges = mysqlTable("user_loyalty_badges", {
  id: int("id").autoincrement().primaryKey(),
  
  // ID de l'utilisateur
  userId: int("user_id").notNull(),
  
  // ID du badge obtenu
  badgeId: int("badge_id").notNull(),
  
  // Date d'obtention
  earnedAt: timestamp("earned_at").defaultNow().notNull(),
  
  // Notification envoyée ou non
  notificationSent: boolean("notification_sent").notNull().default(false),
  
  // Date d'envoi de la notification
  notificationSentAt: timestamp("notification_sent_at"),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type LoyaltyBadge = typeof loyaltyBadges.$inferSelect;
export type InsertLoyaltyBadge = typeof loyaltyBadges.$inferInsert;
export type UserLoyaltyBadge = typeof userLoyaltyBadges.$inferSelect;
export type InsertUserLoyaltyBadge = typeof userLoyaltyBadges.$inferInsert;
