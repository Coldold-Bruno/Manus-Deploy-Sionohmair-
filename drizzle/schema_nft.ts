import { int, mysqlEnum, mysqlTable, decimal, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * ============================================================================
 * SYSTÈME NFT DE GRATITUDE ÉCONOMIQUE
 * ============================================================================
 * 
 * Principe : Gratuité initiale → Redevabilité proportionnelle aux bénéfices
 * 
 * Flux :
 * 1. Un utilisateur reçoit gratuitement une ressource (formation, template, coaching)
 * 2. Il génère des bénéfices grâce à cette ressource
 * 3. Il reverse un pourcentage de ses bénéfices (redevabilité)
 * 4. Le NFT source s'enrichit avec chaque contribution
 * 5. Système de gratitude économique vertueux
 */

/**
 * NFT Sources - Ressources gratuites distribuées
 * Chaque ressource gratuite est un NFT source qui peut s'apprécier
 */
export const nftSources = mysqlTable("nft_sources", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Nom de la ressource (ex: "Formation Sprint de Clarté Gratuite") */
  name: varchar("name", { length: 255 }).notNull(),
  
  /** Description détaillée */
  description: text("description"),
  
  /** Catégorie de la ressource */
  category: mysqlEnum("category", ["formation", "resource", "template", "coaching", "other"]).default("other").notNull(),
  
  /** Valeur initiale estimée (en euros) */
  initialValue: decimal("initialValue", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Valeur actuelle (augmente avec les contributions) */
  currentValue: decimal("currentValue", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Total des contributions reçues */
  totalContributions: decimal("totalContributions", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Nombre de bénéficiaires */
  beneficiariesCount: int("beneficiariesCount").default(0).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type NftSource = typeof nftSources.$inferSelect;
export type InsertNftSource = typeof nftSources.$inferInsert;

/**
 * NFT Beneficiaries - Bénéficiaires de ressources gratuites
 * Chaque utilisateur ayant reçu une ressource gratuite
 */
export const nftBeneficiaries = mysqlTable("nft_beneficiaries", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Utilisateur bénéficiaire */
  userId: int("userId").notNull(),
  
  /** NFT source reçu */
  nftSourceId: int("nftSourceId").notNull(),
  
  /** Date d'attribution de la ressource gratuite */
  grantedAt: timestamp("grantedAt").defaultNow().notNull(),
  
  /** Total des contributions versées */
  totalContributed: decimal("totalContributed", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Date de la dernière contribution */
  lastContributionAt: timestamp("lastContributionAt"),
  
  /** Statut de contribution */
  contributionStatus: mysqlEnum("contributionStatus", ["pending", "active", "completed", "exempt"]).default("pending").notNull(),
  
  /** Niveau de gratitude (basé sur les contributions) */
  gratitudeLevel: mysqlEnum("gratitudeLevel", ["none", "low", "medium", "high", "exceptional"]).default("none").notNull(),
});

export type NftBeneficiary = typeof nftBeneficiaries.$inferSelect;
export type InsertNftBeneficiary = typeof nftBeneficiaries.$inferInsert;

/**
 * NFT Contributions - Redevances versées
 * Chaque contribution est un acte de gratitude économique
 */
export const nftContributions = mysqlTable("nft_contributions", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Bénéficiaire qui contribue */
  beneficiaryId: int("beneficiaryId").notNull(),
  
  /** NFT source concerné */
  nftSourceId: int("nftSourceId").notNull(),
  
  /** Montant de la contribution (en euros) */
  amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
  
  /** Pourcentage du bénéfice reversé (ex: 5.00 = 5%) */
  percentage: decimal("percentage", { precision: 5, scale: 2 }).notNull(),
  
  /** Revenu déclaré par le bénéficiaire */
  reportedRevenue: decimal("reportedRevenue", { precision: 10, scale: 2 }).notNull(),
  
  /** Méthode de paiement */
  paymentMethod: mysqlEnum("paymentMethod", ["stripe", "bank_transfer", "other"]).default("stripe").notNull(),
  
  /** Statut du paiement */
  paymentStatus: mysqlEnum("paymentStatus", ["pending", "completed", "failed", "refunded"]).default("pending").notNull(),
  
  /** Date du paiement */
  paymentDate: timestamp("paymentDate"),
  
  /** Notes supplémentaires */
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type NftContribution = typeof nftContributions.$inferSelect;
export type InsertNftContribution = typeof nftContributions.$inferInsert;

/**
 * NFT Inquiries - Enquêtes de recouvrement
 * Suivi des bénéfices générés et calcul des redevances
 */
export const nftInquiries = mysqlTable("nft_inquiries", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Bénéficiaire concerné */
  beneficiaryId: int("beneficiaryId").notNull(),
  
  /** Type d'enquête */
  inquiryType: mysqlEnum("inquiryType", ["initial", "quarterly", "annual", "on_demand"]).default("quarterly").notNull(),
  
  /** Date de l'enquête */
  inquiryDate: timestamp("inquiryDate").defaultNow().notNull(),
  
  /** Revenu déclaré */
  reportedRevenue: decimal("reportedRevenue", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Preuves fournies (captures, factures, etc.) */
  evidenceProvided: text("evidenceProvided"),
  
  /** Contribution calculée */
  calculatedContribution: decimal("calculatedContribution", { precision: 10, scale: 2 }).default("0.00").notNull(),
  
  /** Statut de l'enquête */
  status: mysqlEnum("status", ["pending", "reviewed", "approved", "disputed"]).default("pending").notNull(),
  
  /** Notes de l'administrateur */
  adminNotes: text("adminNotes"),
  
  /** Admin qui a validé */
  reviewedBy: int("reviewedBy"),
  
  /** Date de validation */
  reviewedAt: timestamp("reviewedAt"),
});

export type NftInquiry = typeof nftInquiries.$inferSelect;
export type InsertNftInquiry = typeof nftInquiries.$inferInsert;
