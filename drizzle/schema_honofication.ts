import { mysqlTable, int, varchar, text, decimal, datetime, boolean, index } from "drizzle-orm/mysql-core";

/**
 * Schéma de Base de Données pour le Système d'Honofication
 * 
 * Tables pour la détection automatique des bénéfices non déclarés,
 * le recouvrement basé sur la présomption, et le tribunal arbitral.
 */

// ============================================================================
// DÉTECTION AUTOMATIQUE DES BÉNÉFICES
// ============================================================================

/**
 * Indices de bénéfices détectés automatiquement
 */
export const benefitIndices = mysqlTable("benefit_indices", {
  id: int("id").primaryKey().autoincrement(),
  beneficiaryId: int("beneficiary_id").notNull(), // Lien avec nft_beneficiaries
  sourceId: int("source_id").notNull(), // Lien avec nft_sources
  userId: int("user_id").notNull(),
  
  // Type d'indice
  indiceType: varchar("indice_type", { length: 50 }).notNull(), // direct, indirect, contextual
  indiceCategory: varchar("indice_category", { length: 50 }).notNull(), // transaction, conversion, traffic, launch, mention
  
  // Données de l'indice
  indiceName: varchar("indice_name", { length: 255 }).notNull(),
  indiceDescription: text("indice_description"),
  indiceSource: varchar("indice_source", { length: 255 }), // URL, API, scraping, etc.
  indiceData: text("indice_data"), // JSON avec les données brutes
  
  // Évaluation
  confidenceScore: decimal("confidence_score", { precision: 3, scale: 2 }).notNull(), // 0.50 à 1.00
  presumedBenefit: decimal("presumed_benefit", { precision: 10, scale: 2 }).notNull(), // Bénéfice présumé en €
  
  // Statut
  status: varchar("status", { length: 20 }).notNull().default("detected"), // detected, validated, contested, rejected
  validatedAt: datetime("validated_at"),
  validatedBy: int("validated_by"), // User ID de l'admin qui a validé
  
  // Métadonnées
  detectedAt: datetime("detected_at").notNull().default(new Date()),
  createdAt: datetime("created_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
}, (table) => ({
  beneficiaryIdx: index("beneficiary_idx").on(table.beneficiaryId),
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

/**
 * Intégrations API pour la détection automatique
 */
export const apiIntegrations = mysqlTable("api_integrations", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  
  // Type d'intégration
  platform: varchar("platform", { length: 50 }).notNull(), // stripe, paypal, google_analytics, etc.
  integrationName: varchar("integration_name", { length: 255 }).notNull(),
  
  // Credentials (chiffrés)
  apiKey: text("api_key"), // Chiffré
  apiSecret: text("api_secret"), // Chiffré
  accessToken: text("access_token"), // Chiffré
  refreshToken: text("refresh_token"), // Chiffré
  
  // Configuration
  config: text("config"), // JSON avec la configuration spécifique
  
  // Statut
  status: varchar("status", { length: 20 }).notNull().default("active"), // active, paused, error, revoked
  lastSyncAt: datetime("last_sync_at"),
  lastError: text("last_error"),
  
  // Consentement
  consentGiven: boolean("consent_given").notNull().default(false),
  consentDate: datetime("consent_date"),
  
  // Métadonnées
  createdAt: datetime("created_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  platformIdx: index("platform_idx").on(table.platform),
}));

/**
 * Logs de détection automatique
 */
export const detectionLogs = mysqlTable("detection_logs", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("user_id").notNull(),
  integrationId: int("integration_id"), // Null si détection manuelle
  
  // Détection
  detectionMethod: varchar("detection_method", { length: 50 }).notNull(), // api, scraping, manual, webhook
  detectionSource: varchar("detection_source", { length: 255 }),
  
  // Résultat
  indicesFound: int("indices_found").notNull().default(0),
  benefitsDetected: decimal("benefits_detected", { precision: 10, scale: 2 }).notNull().default("0.00"),
  
  // Données
  rawData: text("raw_data"), // JSON avec les données brutes
  
  // Métadonnées
  detectedAt: datetime("detected_at").notNull().default(new Date()),
}, (table) => ({
  userIdx: index("user_idx").on(table.userId),
  detectedAtIdx: index("detected_at_idx").on(table.detectedAt),
}));

// ============================================================================
// RECOUVREMENT BASÉ SUR LA PRÉSOMPTION
// ============================================================================

/**
 * Redevances présumées (avant validation ou contestation)
 */
export const presumedRoyalties = mysqlTable("presumed_royalties", {
  id: int("id").primaryKey().autoincrement(),
  beneficiaryId: int("beneficiary_id").notNull(),
  sourceId: int("source_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Calcul de la redevance présumée
  presumedBenefit: decimal("presumed_benefit", { precision: 10, scale: 2 }).notNull(),
  royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(), // 3.00 à 10.00
  confidenceCoefficient: decimal("confidence_coefficient", { precision: 3, scale: 2 }).notNull(), // 0.50 à 1.00
  presumedRoyaltyAmount: decimal("presumed_royalty_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Indices associés
  indiceIds: text("indice_ids"), // JSON array des IDs d'indices
  indicesSummary: text("indices_summary"), // Résumé textuel des indices
  
  // Statut de recouvrement
  recoveryStatus: varchar("recovery_status", { length: 20 }).notNull().default("notified"), 
  // notified, reminded, formal_notice, contested, paid, waived, arbitration
  
  // Dates importantes
  notifiedAt: datetime("notified_at").notNull().default(new Date()),
  remindedAt: datetime("reminded_at"),
  formalNoticeAt: datetime("formal_notice_at"),
  dueDate: datetime("due_date").notNull(), // J+30
  paidAt: datetime("paid_at"),
  
  // Paiement
  paidAmount: decimal("paid_amount", { precision: 10, scale: 2 }),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  
  // Métadonnées
  createdAt: datetime("created_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
}, (table) => ({
  beneficiaryIdx: index("beneficiary_idx").on(table.beneficiaryId),
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.recoveryStatus),
  dueDateIdx: index("due_date_idx").on(table.dueDate),
}));

/**
 * Historique des actions de recouvrement
 */
export const recoveryActions = mysqlTable("recovery_actions", {
  id: int("id").primaryKey().autoincrement(),
  presumedRoyaltyId: int("presumed_royalty_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Action
  actionType: varchar("action_type", { length: 50 }).notNull(), 
  // notification, reminder, formal_notice, payment, contestation, arbitration, waiver
  actionDescription: text("action_description"),
  
  // Résultat
  actionResult: varchar("action_result", { length: 50 }), // success, pending, failed
  
  // Métadonnées
  performedAt: datetime("performed_at").notNull().default(new Date()),
  performedBy: int("performed_by"), // User ID ou NULL si automatique
}, (table) => ({
  royaltyIdx: index("royalty_idx").on(table.presumedRoyaltyId),
  userIdx: index("user_idx").on(table.userId),
}));

// ============================================================================
// TRIBUNAL ARBITRAL ET CONTESTATIONS
// ============================================================================

/**
 * Contestations de redevances présumées
 */
export const royaltyContestations = mysqlTable("royalty_contestations", {
  id: int("id").primaryKey().autoincrement(),
  presumedRoyaltyId: int("presumed_royalty_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Motifs de contestation
  contestationType: varchar("contestation_type", { length: 50 }).notNull(), 
  // fond, forme, circonstances_exceptionnelles
  contestationMotif: varchar("contestation_motif", { length: 100 }).notNull(),
  // no_benefit, not_attributable, disproportionate, not_commercial, error, double, force_majeure, etc.
  
  // Arguments
  arguments: text("arguments").notNull(),
  supportingDocuments: text("supporting_documents"), // JSON array des URLs de documents
  
  // Proposition alternative
  proposedAmount: decimal("proposed_amount", { precision: 10, scale: 2 }),
  proposedJustification: text("proposed_justification"),
  
  // Statut
  status: varchar("status", { length: 20 }).notNull().default("submitted"), 
  // submitted, under_review, accepted, rejected, arbitration
  
  // Réponse de Sionohmair
  sionohmairResponse: text("sionohmair_response"),
  sionohmairProposedAmount: decimal("sionohmair_proposed_amount", { precision: 10, scale: 2 }),
  respondedAt: datetime("responded_at"),
  
  // Résolution
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }),
  resolutionMethod: varchar("resolution_method", { length: 50 }), // agreement, arbitration, waiver
  resolvedAt: datetime("resolved_at"),
  
  // Métadonnées
  submittedAt: datetime("submitted_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
}, (table) => ({
  royaltyIdx: index("royalty_idx").on(table.presumedRoyaltyId),
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

/**
 * Dossiers d'arbitrage
 */
export const arbitrationCases = mysqlTable("arbitration_cases", {
  id: int("id").primaryKey().autoincrement(),
  contestationId: int("contestation_id").notNull(),
  presumedRoyaltyId: int("presumed_royalty_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Composition du tribunal
  arbitrator1Id: int("arbitrator1_id"), // Désigné par Sionohmair
  arbitrator2Id: int("arbitrator2_id"), // Désigné par le bénéficiaire
  arbitrator3Id: int("arbitrator3_id"), // Neutre
  
  // Procédure
  filedAt: datetime("filed_at").notNull().default(new Date()),
  sionohmairResponseAt: datetime("sionohmair_response_at"),
  hearingDate: datetime("hearing_date"),
  sentenceDate: datetime("sentence_date"),
  
  // Documents
  claimantDocuments: text("claimant_documents"), // JSON array
  respondentDocuments: text("respondent_documents"), // JSON array
  arbitratorsNotes: text("arbitrators_notes"),
  
  // Sentence
  sentenceText: text("sentence_text"),
  sentenceAmount: decimal("sentence_amount", { precision: 10, scale: 2 }),
  sentenceType: varchar("sentence_type", { length: 50 }), 
  // confirmed, reduced, cancelled, payment_plan, partial_exemption
  
  // Frais
  totalFees: decimal("total_fees", { precision: 10, scale: 2 }).notNull().default("600.00"), // 500 + 100
  claimantFeesShare: decimal("claimant_fees_share", { precision: 5, scale: 2 }), // Pourcentage
  
  // Statut
  status: varchar("status", { length: 20 }).notNull().default("filed"), 
  // filed, under_review, hearing_scheduled, deliberation, sentenced, executed
  
  // Métadonnées
  createdAt: datetime("created_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
}, (table) => ({
  contestationIdx: index("contestation_idx").on(table.contestationId),
  userIdx: index("user_idx").on(table.userId),
  statusIdx: index("status_idx").on(table.status),
}));

/**
 * Arbitres du tribunal
 */
export const arbitrators = mysqlTable("arbitrators", {
  id: int("id").primaryKey().autoincrement(),
  
  // Identité
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 50 }),
  
  // Qualifications
  title: varchar("title", { length: 255 }), // Avocat, Expert-comptable, Médiateur, etc.
  specialization: varchar("specialization", { length: 255 }),
  bio: text("bio"),
  
  // Type
  arbitratorType: varchar("arbitrator_type", { length: 20 }).notNull(), 
  // sionohmair, beneficiary_chosen, neutral
  
  // Disponibilité
  isAvailable: boolean("is_available").notNull().default(true),
  
  // Statistiques
  casesHandled: int("cases_handled").notNull().default(0),
  averageResolutionDays: int("average_resolution_days"),
  
  // Métadonnées
  createdAt: datetime("created_at").notNull().default(new Date()),
  updatedAt: datetime("updated_at").notNull().default(new Date()),
});

/**
 * Déclarations volontaires de bénéfices (incitées)
 */
export const voluntaryDeclarations = mysqlTable("voluntary_declarations", {
  id: int("id").primaryKey().autoincrement(),
  beneficiaryId: int("beneficiary_id").notNull(),
  sourceId: int("source_id").notNull(),
  userId: int("user_id").notNull(),
  
  // Déclaration
  declaredBenefit: decimal("declared_benefit", { precision: 10, scale: 2 }).notNull(),
  benefitPeriod: varchar("benefit_period", { length: 50 }), // "Q1 2025", "Janvier 2025", etc.
  benefitDescription: text("benefit_description"),
  
  // Redevance calculée
  royaltyRate: decimal("royalty_rate", { precision: 5, scale: 2 }).notNull(),
  royaltyAmount: decimal("royalty_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Bonus pour déclaration volontaire
  bonusApplied: boolean("bonus_applied").notNull().default(false),
  bonusPercentage: decimal("bonus_percentage", { precision: 5, scale: 2 }).default("10.00"), // 10% de réduction
  finalAmount: decimal("final_amount", { precision: 10, scale: 2 }).notNull(),
  
  // Paiement
  isPaid: boolean("is_paid").notNull().default(false),
  paidAt: datetime("paid_at"),
  paymentMethod: varchar("payment_method", { length: 50 }),
  transactionId: varchar("transaction_id", { length: 255 }),
  
  // Métadonnées
  declaredAt: datetime("declared_at").notNull().default(new Date()),
  createdAt: datetime("created_at").notNull().default(new Date()),
}, (table) => ({
  beneficiaryIdx: index("beneficiary_idx").on(table.beneficiaryId),
  userIdx: index("user_idx").on(table.userId),
}));
