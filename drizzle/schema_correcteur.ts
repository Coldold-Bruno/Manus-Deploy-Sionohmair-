import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean } from "drizzle-orm/mysql-core";

/**
 * ============================================================================
 * SYSTÈME CORRECTEUR UNIVERSEL DE CONTENU
 * ============================================================================
 * 
 * Principe : Correction gratuite → Redevabilité si bénéfices générés
 * 
 * Types de corrections :
 * - Texte simple (landing page, email, pitch)
 * - Bilan prévisionnel (analyse financière)
 * - Site web complet (SEO, UX, structure)
 * - Documents (PDF, Word, Excel)
 */

/**
 * Corrections History - Historique de toutes les corrections effectuées
 */
export const correctionsHistory = mysqlTable("corrections_history", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Utilisateur ayant demandé la correction */
  userId: int("userId").notNull(),
  
  /** Type de contenu corrigé */
  contentType: mysqlEnum("contentType", [
    "text",              // Texte simple (landing page, email, pitch)
    "financial",         // Bilan prévisionnel / analyse financière
    "website",           // Site web complet
    "document",          // Document (PDF, Word, Excel)
    "other"
  ]).default("text").notNull(),
  
  /** Titre/nom du contenu */
  title: varchar("title", { length: 255 }).notNull(),
  
  /** Contenu original (AVANT correction) */
  originalContent: text("originalContent").notNull(),
  
  /** Contenu corrigé (APRÈS correction) */
  correctedContent: text("correctedContent").notNull(),
  
  /** Score PFPMA initial (0-20) */
  scoreBefore: int("scoreBefore").notNull(),
  
  /** Score PFPMA après correction (0-20) */
  scoreAfter: int("scoreAfter").notNull(),
  
  /** Frictions identifiées (JSON) */
  frictions: text("frictions").notNull(),
  
  /** Recommandations détaillées (JSON) */
  recommendations: text("recommendations").notNull(),
  
  /** Analyse spécifique selon le type */
  specificAnalysis: text("specificAnalysis"),
  
  /** NFT Beneficiary ID (si intégré au système NFT) */
  nftBeneficiaryId: int("nftBeneficiaryId"),
  
  /** Statut de la correction */
  status: mysqlEnum("status", ["draft", "completed", "exported"]).default("completed").notNull(),
  
  /** La correction a-t-elle été utilisée ? */
  wasUsed: boolean("wasUsed").default(false).notNull(),
  
  /** Bénéfice déclaré (si utilisé) */
  declaredBenefit: text("declaredBenefit"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorrectionHistory = typeof correctionsHistory.$inferSelect;
export type InsertCorrectionHistory = typeof correctionsHistory.$inferInsert;

/**
 * Correction Templates - Templates de correction réutilisables
 */
export const correctionTemplates = mysqlTable("correction_templates", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Nom du template */
  name: varchar("name", { length: 255 }).notNull(),
  
  /** Type de contenu */
  contentType: mysqlEnum("contentType", [
    "text",
    "financial",
    "website",
    "document",
    "other"
  ]).notNull(),
  
  /** Description du template */
  description: text("description"),
  
  /** Prompt système pour l'IA */
  systemPrompt: text("systemPrompt").notNull(),
  
  /** Instructions spécifiques */
  instructions: text("instructions"),
  
  /** Critères d'évaluation (JSON) */
  evaluationCriteria: text("evaluationCriteria"),
  
  /** Actif ou non */
  isActive: boolean("isActive").default(true).notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CorrectionTemplate = typeof correctionTemplates.$inferSelect;
export type InsertCorrectionTemplate = typeof correctionTemplates.$inferInsert;
