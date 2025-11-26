import { int, mysqlTable, text, timestamp, varchar, boolean, mysqlEnum } from "drizzle-orm/mysql-core";

/**
 * SCHÉMA DE BASE DE DONNÉES - PLATEFORME DE FORMATION INTERACTIVE
 * 
 * Tables :
 * 1. formationAccess : Gestion des accès à la formation (90 jours)
 * 2. moduleProgress : Progression par module (9 modules)
 * 3. exerciseAttempts : Tentatives d'exercices (validation automatique)
 * 4. badges : Badges gagnés par l'utilisateur
 */

// ============================================================================
// TABLE 1 : ACCÈS À LA FORMATION (90 JOURS)
// ============================================================================

export const formationAccess = mysqlTable("formation_access", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // Référence à users.id
  orderId: int("order_id").notNull(), // Référence à orders.id (commande Stripe)
  
  // Dates d'accès
  purchaseDate: timestamp("purchase_date").defaultNow().notNull(), // Date d'achat
  accessStartDate: timestamp("access_start_date").defaultNow().notNull(), // Début d'accès (= purchase_date)
  accessEndDate: timestamp("access_end_date").notNull(), // Fin d'accès (= accessStartDate + 90 jours)
  
  // Statut
  isActive: boolean("is_active").default(true).notNull(), // Accès actif ou révoqué
  isCompleted: boolean("is_completed").default(false).notNull(), // Formation terminée (9 modules complétés)
  
  // Progression globale
  completedModules: int("completed_modules").default(0).notNull(), // Nombre de modules complétés (0-9)
  totalExercisesCompleted: int("total_exercises_completed").default(0).notNull(), // Nombre total d'exercices réussis (0-27)
  overallScore: int("overall_score").default(0).notNull(), // Score global /100
  
  // Métadonnées
  lastAccessDate: timestamp("last_access_date").defaultNow().notNull(), // Dernière connexion
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type FormationAccess = typeof formationAccess.$inferSelect;
export type InsertFormationAccess = typeof formationAccess.$inferInsert;

// ============================================================================
// TABLE 2 : PROGRESSION PAR MODULE (9 MODULES)
// ============================================================================

export const moduleProgress = mysqlTable("module_progress", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // Référence à users.id
  formationAccessId: int("formation_access_id").notNull(), // Référence à formation_access.id
  
  // Identification du module
  moduleNumber: int("module_number").notNull(), // 1 à 9
  moduleName: varchar("module_name", { length: 255 }).notNull(), // Ex: "Module 1 : Le Problème"
  
  // Statut du module
  isUnlocked: boolean("is_unlocked").default(false).notNull(), // Module débloqué (progressif)
  isStarted: boolean("is_started").default(false).notNull(), // Module commencé
  isCompleted: boolean("is_completed").default(false).notNull(), // Module terminé (3 exercices réussis)
  
  // Progression dans le module
  completedExercises: int("completed_exercises").default(0).notNull(), // Nombre d'exercices complétés (0-3)
  moduleScore: int("module_score").default(0).notNull(), // Score du module /100
  
  // Dates
  startedAt: timestamp("started_at"), // Date de début du module
  completedAt: timestamp("completed_at"), // Date de fin du module
  
  // Métadonnées
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

export type ModuleProgress = typeof moduleProgress.$inferSelect;
export type InsertModuleProgress = typeof moduleProgress.$inferInsert;

// ============================================================================
// TABLE 3 : TENTATIVES D'EXERCICES (VALIDATION AUTOMATIQUE)
// ============================================================================

export const exerciseAttempts = mysqlTable("exercise_attempts", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // Référence à users.id
  moduleProgressId: int("module_progress_id").notNull(), // Référence à module_progress.id
  
  // Identification de l'exercice
  moduleNumber: int("module_number").notNull(), // 1 à 9
  exerciseNumber: int("exercise_number").notNull(), // 1 à 3 (3 exercices par module)
  exerciseTitle: varchar("exercise_title", { length: 255 }).notNull(), // Ex: "Exercice 1 : Identifier le problème"
  
  // Réponse de l'utilisateur
  userAnswer: text("user_answer").notNull(), // Réponse rédigée par l'utilisateur
  
  // Validation automatique
  isCorrect: boolean("is_correct").notNull(), // Réponse correcte ou non
  score: int("score").notNull(), // Score obtenu /100
  feedback: text("feedback").notNull(), // Feedback automatique (pourquoi correct/incorrect)
  
  // Tentatives
  attemptNumber: int("attempt_number").default(1).notNull(), // Numéro de tentative (1, 2, 3...)
  
  // Métadonnées
  submittedAt: timestamp("submitted_at").defaultNow().notNull(), // Date de soumission
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type ExerciseAttempt = typeof exerciseAttempts.$inferSelect;
export type InsertExerciseAttempt = typeof exerciseAttempts.$inferInsert;

// ============================================================================
// TABLE 4 : BADGES GAGNÉS (GAMIFICATION)
// ============================================================================

export const badges = mysqlTable("badges", {
  id: int("id").autoincrement().primaryKey(),
  userId: int("user_id").notNull(), // Référence à users.id
  formationAccessId: int("formation_access_id").notNull(), // Référence à formation_access.id
  
  // Type de badge
  badgeType: mysqlEnum("badge_type", [
    "first_module", // Premier module complété
    "half_way", // 50% de la formation (5 modules)
    "almost_there", // 80% de la formation (8 modules)
    "completed", // Formation terminée (9 modules)
    "perfect_score", // Score parfait sur un module (100/100)
    "speed_demon", // Formation terminée en moins de 9 jours
    "persistent", // 10+ tentatives sur un exercice avant de réussir
    "first_try", // Réussite du premier coup sur un exercice
  ]).notNull(),
  
  // Détails du badge
  badgeName: varchar("badge_name", { length: 255 }).notNull(), // Ex: "Premier Pas"
  badgeDescription: text("badge_description").notNull(), // Description du badge
  badgeIcon: varchar("badge_icon", { length: 50 }).notNull(), // Icône emoji ou code
  
  // Métadonnées
  earnedAt: timestamp("earned_at").defaultNow().notNull(), // Date d'obtention
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Badge = typeof badges.$inferSelect;
export type InsertBadge = typeof badges.$inferInsert;

// ============================================================================
// EXPORT GLOBAL
// ============================================================================

export const formationTables = {
  formationAccess,
  moduleProgress,
  exerciseAttempts,
  badges,
};
