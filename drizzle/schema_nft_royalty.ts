import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, decimal, boolean } from "drizzle-orm/mysql-core";

/**
 * ============================================================================
 * SYSTÈME DE TRACKING TEMPS RÉEL DES REDEVANCES NFT SOURCE
 * ============================================================================
 * 
 * Principe : Identification automatique des bénéfices générés par les NFT sources
 * et calcul en temps réel des redevances dues selon le barème de gratitude.
 */

/**
 * NFT Royalty Tracking - Suivi en temps réel des redevances
 */
export const nftRoyaltyTracking = mysqlTable("nft_royalty_tracking", {
  id: int("id").autoincrement().primaryKey(),
  
  /** NFT Beneficiary concerné */
  beneficiaryId: int("beneficiaryId").notNull(),
  
  /** NFT Source concerné */
  sourceId: int("sourceId").notNull(),
  
  /** Utilisateur concerné */
  userId: int("userId").notNull(),
  
  /** Type d'événement déclencheur */
  eventType: mysqlEnum("eventType", [
    "correction_used",        // Correction utilisée
    "benefit_declared",       // Bénéfice déclaré manuellement
    "revenue_detected",       // Revenu détecté automatiquement
    "conversion_tracked",     // Conversion trackée
    "sale_completed",         // Vente complétée
    "other"
  ]).notNull(),
  
  /** Montant du bénéfice généré */
  benefitAmount: decimal("benefitAmount", { precision: 10, scale: 2 }).notNull(),
  
  /** Pourcentage de redevance applicable (3-10%) */
  royaltyPercentage: decimal("royaltyPercentage", { precision: 5, scale: 2 }).notNull(),
  
  /** Montant de la redevance calculée */
  royaltyAmount: decimal("royaltyAmount", { precision: 10, scale: 2 }).notNull(),
  
  /** Statut de la redevance */
  status: mysqlEnum("status", [
    "pending",          // En attente de paiement
    "notified",         // Utilisateur notifié
    "paid",             // Payée
    "overdue",          // En retard
    "waived"            // Annulée/exemptée
  ]).default("pending").notNull(),
  
  /** Date de notification */
  notifiedAt: timestamp("notifiedAt"),
  
  /** Date de paiement */
  paidAt: timestamp("paidAt"),
  
  /** Date limite de paiement */
  dueDate: timestamp("dueDate").notNull(),
  
  /** Détails de l'événement (JSON) */
  eventDetails: text("eventDetails"),
  
  /** ID de la contribution associée (si payée) */
  contributionId: int("contributionId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NftRoyaltyTracking = typeof nftRoyaltyTracking.$inferSelect;
export type InsertNftRoyaltyTracking = typeof nftRoyaltyTracking.$inferInsert;

/**
 * NFT Benefit Events - Événements de bénéfices détectés
 */
export const nftBenefitEvents = mysqlTable("nft_benefit_events", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Utilisateur concerné */
  userId: int("userId").notNull(),
  
  /** NFT Beneficiary concerné */
  beneficiaryId: int("beneficiaryId").notNull(),
  
  /** Type d'événement */
  eventType: varchar("eventType", { length: 100 }).notNull(),
  
  /** Montant du bénéfice */
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  /** Source de l'événement */
  source: varchar("source", { length: 255 }),
  
  /** Métadonnées (JSON) */
  metadata: text("metadata"),
  
  /** Traité ou non */
  processed: boolean("processed").default(false).notNull(),
  
  /** ID du tracking créé (si traité) */
  trackingId: int("trackingId"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NftBenefitEvent = typeof nftBenefitEvents.$inferSelect;
export type InsertNftBenefitEvent = typeof nftBenefitEvents.$inferInsert;

/**
 * NFT Royalty Alerts - Alertes de redevances
 */
export const nftRoyaltyAlerts = mysqlTable("nft_royalty_alerts", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Utilisateur concerné */
  userId: int("userId").notNull(),
  
  /** Type d'alerte */
  alertType: mysqlEnum("alertType", [
    "royalty_due",           // Redevance due
    "royalty_overdue",       // Redevance en retard
    "benefit_detected",      // Bénéfice détecté
    "threshold_reached",     // Seuil atteint
    "reminder"               // Rappel
  ]).notNull(),
  
  /** Tracking ID concerné */
  trackingId: int("trackingId"),
  
  /** Titre de l'alerte */
  title: varchar("title", { length: 255 }).notNull(),
  
  /** Message de l'alerte */
  message: text("message").notNull(),
  
  /** Montant concerné */
  amount: decimal("amount", { precision: 10, scale: 2 }),
  
  /** Lue ou non */
  isRead: boolean("isRead").default(false).notNull(),
  
  /** Action requise */
  actionRequired: boolean("actionRequired").default(false).notNull(),
  
  /** URL d'action */
  actionUrl: varchar("actionUrl", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NftRoyaltyAlert = typeof nftRoyaltyAlerts.$inferSelect;
export type InsertNftRoyaltyAlert = typeof nftRoyaltyAlerts.$inferInsert;
