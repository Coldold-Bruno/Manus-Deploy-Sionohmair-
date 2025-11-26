import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { users } from "./schema";

/**
 * Table des devis
 * Services: Visual Graphic, Sprint de Clarté, Formation, Automatisation IA
 */
export const quotes = mysqlTable("quotes", {
  id: int("id").autoincrement().primaryKey(),
  
  // Informations client
  userId: int("userId").references(() => users.id),
  clientName: varchar("clientName", { length: 255 }).notNull(),
  clientEmail: varchar("clientEmail", { length: 320 }).notNull(),
  clientPhone: varchar("clientPhone", { length: 50 }),
  
  // Informations du service
  serviceType: mysqlEnum("serviceType", ["visual_graphic", "sprint_clarte", "formation", "automatisation_ia"]).notNull(),
  serviceTier: mysqlEnum("serviceTier", ["starter", "intermediate", "premium"]), // Pour Visual Graphic uniquement
  
  // Détails du projet
  projectDescription: text("projectDescription").notNull(),
  projectDetails: json("projectDetails").$type<{
    quantity?: number;
    deadline?: string;
    specificRequirements?: string[];
    [key: string]: any;
  }>(),
  
  // Tarification (en centimes)
  basePrice: int("basePrice").notNull(), // Prix de base
  adjustments: json("adjustments").$type<Array<{
    label: string;
    amount: number; // en centimes
    type: 'addition' | 'reduction';
  }>>(),
  finalPrice: int("finalPrice").notNull(), // Prix final
  
  // Statut
  status: mysqlEnum("status", ["pending", "sent", "accepted", "rejected", "expired"]).default("pending").notNull(),
  
  // PDF
  pdfUrl: varchar("pdfUrl", { length: 1000 }),
  pdfGeneratedAt: timestamp("pdfGeneratedAt"),
  
  // Validation
  acceptedAt: timestamp("acceptedAt"),
  rejectedAt: timestamp("rejectedAt"),
  rejectionReason: text("rejectionReason"),
  
  // Paiement Stripe
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }),
  paidAt: timestamp("paidAt"),
  
  // Métadonnées
  expiresAt: timestamp("expiresAt").notNull(), // Date d'expiration (30 jours par défaut)
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  
  // Notes internes (admin)
  internalNotes: text("internalNotes"),
});

export type Quote = typeof quotes.$inferSelect;
export type InsertQuote = typeof quotes.$inferInsert;

/**
 * Table des templates de devis
 * Templates pré-configurés pour chaque service
 */
export const quoteTemplates = mysqlTable("quote_templates", {
  id: int("id").autoincrement().primaryKey(),
  
  serviceType: mysqlEnum("serviceType", ["visual_graphic", "sprint_clarte", "formation", "automatisation_ia"]).notNull(),
  serviceTier: mysqlEnum("serviceTier", ["starter", "intermediate", "premium"]),
  
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  
  // Contenu du template (sections, livrables, délais, conditions)
  content: json("content").$type<{
    sections: Array<{
      title: string;
      content: string;
      order: number;
    }>;
    deliverables: string[];
    timeline: string;
    terms: string[];
  }>().notNull(),
  
  // Tarification par défaut (en centimes)
  basePrice: int("basePrice").notNull(),
  
  // Actif ou non
  isActive: mysqlEnum("isActive", ["yes", "no"]).default("yes").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type QuoteTemplate = typeof quoteTemplates.$inferSelect;
export type InsertQuoteTemplate = typeof quoteTemplates.$inferInsert;
