import { int, mysqlEnum, mysqlTable, text, timestamp, varchar, json } from "drizzle-orm/mysql-core";
import { users, orders } from "./schema";

/**
 * Table des disponibilités du coach (créneaux disponibles)
 */
export const coachAvailability = mysqlTable("coach_availability", {
  id: int("id").autoincrement().primaryKey(),
  
  // Date et heure du créneau
  startTime: timestamp("startTime").notNull(),
  endTime: timestamp("endTime").notNull(),
  
  // Statut du créneau
  status: mysqlEnum("status", ["available", "booked", "cancelled"]).default("available").notNull(),
  
  // Récurrence (optionnel)
  isRecurring: mysqlEnum("isRecurring", ["yes", "no"]).default("no").notNull(),
  recurringPattern: json("recurringPattern").$type<{
    frequency: 'daily' | 'weekly' | 'monthly';
    interval: number; // Tous les X jours/semaines/mois
    daysOfWeek?: number[]; // Pour weekly: [1,3,5] = Lundi, Mercredi, Vendredi
    endDate?: string;
  }>(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CoachAvailability = typeof coachAvailability.$inferSelect;
export type InsertCoachAvailability = typeof coachAvailability.$inferInsert;

/**
 * Table des sessions de coaching (RDV pris)
 */
export const coachingSessions = mysqlTable("coaching_sessions", {
  id: int("id").autoincrement().primaryKey(),
  
  // Client
  userId: int("userId").notNull().references(() => users.id),
  orderId: int("orderId").references(() => orders.id), // Lien avec la commande Sprint de Clarté
  
  // Informations de contact
  clientPhone: varchar("clientPhone", { length: 50 }),
  clientTimezone: varchar("clientTimezone", { length: 100 }),
  preferredContactMethod: mysqlEnum("preferredContactMethod", ["email", "phone", "whatsapp"]).default("email"),
  
  // Créneau réservé
  availabilityId: int("availabilityId").references(() => coachAvailability.id),
  
  // Date et heure de la session
  scheduledAt: timestamp("scheduledAt").notNull(),
  duration: int("duration").notNull().default(60), // Durée en minutes (60 = 1h)
  
  // Informations Zoom
  zoomMeetingId: varchar("zoomMeetingId", { length: 255 }),
  zoomJoinUrl: varchar("zoomJoinUrl", { length: 1000 }),
  zoomStartUrl: varchar("zoomStartUrl", { length: 1000 }), // Pour le coach
  zoomPassword: varchar("zoomPassword", { length: 50 }),
  
  // Statut de la session
  status: mysqlEnum("status", ["scheduled", "completed", "cancelled", "no_show"]).default("scheduled").notNull(),
  
  // Avant la session (préparation)
  preSessionQuestionnaire: json("preSessionQuestionnaire").$type<{
    objectives?: string[];
    questions?: string[];
    documentsToReview?: string[];
    specificTopics?: string[];
  }>(),
  preSessionCompleted: mysqlEnum("preSessionCompleted", ["yes", "no"]).default("no").notNull(),
  
  // Pendant la session
  sessionNotes: text("sessionNotes"), // Notes prises pendant la session par le coach
  
  // Après la session (compte-rendu)
  postSessionSummary: json("postSessionSummary").$type<{
    keyPoints?: string[];
    decisionsMade?: string[];
    actionItems?: Array<{
      task: string;
      deadline?: string;
      priority: 'high' | 'medium' | 'low';
    }>;
    nextSteps?: string[];
  }>(),
  clientNotes: text("clientNotes"), // Notes du client après la session
  
  // Livrables associés
  deliverables: json("deliverables").$type<Array<{
    name: string;
    description: string;
    fileUrl?: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>>(),
  
  // Rappels
  reminderSent24h: mysqlEnum("reminderSent24h", ["yes", "no"]).default("no").notNull(),
  reminderSent1h: mysqlEnum("reminderSent1h", ["yes", "no"]).default("no").notNull(),
  
  // Feedback
  clientRating: int("clientRating"), // Note de 1 à 5
  clientFeedback: text("clientFeedback"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
  cancelledAt: timestamp("cancelledAt"),
  cancellationReason: text("cancellationReason"),
});

export type CoachingSession = typeof coachingSessions.$inferSelect;
export type InsertCoachingSession = typeof coachingSessions.$inferInsert;

/**
 * Table des livrables du Sprint de Clarté
 */
export const sprintDeliverables = mysqlTable("sprint_deliverables", {
  id: int("id").autoincrement().primaryKey(),
  
  // Client
  userId: int("userId").notNull().references(() => users.id),
  orderId: int("orderId").notNull().references(() => orders.id),
  sessionId: int("sessionId").references(() => coachingSessions.id),
  
  // Type de livrable
  deliverableType: mysqlEnum("deliverableType", [
    "diagnostic_pfpma",
    "analyse_frictions",
    "facteur_alpha",
    "plan_action",
    "texte_optimise",
    "rapport_final",
    "autre"
  ]).notNull(),
  
  // Informations du livrable
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  
  // Fichier (stocké sur S3)
  fileUrl: varchar("fileUrl", { length: 1000 }),
  fileType: varchar("fileType", { length: 100 }),
  fileSize: int("fileSize"),
  
  // Statut
  status: mysqlEnum("status", ["pending", "in_progress", "review", "completed"]).default("pending").notNull(),
  
  // Versions
  version: int("version").default(1).notNull(),
  previousVersionId: int("previousVersionId"),
  
  // Feedback
  clientFeedback: text("clientFeedback"),
  revisionRequested: mysqlEnum("revisionRequested", ["yes", "no"]).default("no").notNull(),
  revisionNotes: text("revisionNotes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  completedAt: timestamp("completedAt"),
});

export type SprintDeliverable = typeof sprintDeliverables.$inferSelect;
export type InsertSprintDeliverable = typeof sprintDeliverables.$inferInsert;
