import { z } from "zod";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { 
  formationAccess, 
  moduleProgress, 
  exerciseAttempts, 
  badges,
  orders 
} from "../drizzle/schema";
import { eq, and, desc } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

/**
 * FORMATION ROUTER
 * Gestion de la plateforme de formation interactive (9 modules + 27 exercices)
 */

export const formationRouter = router({
  
  // ============================================================================
  // GESTION DE L'ACCÈS (90 JOURS)
  // ============================================================================
  
  /**
   * Vérifier si l'utilisateur a accès à la formation
   */
  checkAccess: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const access = await db
      .select()
      .from(formationAccess)
      .where(eq(formationAccess.userId, ctx.user.id))
      .orderBy(desc(formationAccess.createdAt))
      .limit(1);

    if (access.length === 0) {
      return {
        hasAccess: false,
        message: "Vous n'avez pas encore acheté la formation.",
      };
    }

    const userAccess = access[0];
    const now = new Date();
    const endDate = new Date(userAccess.accessEndDate);

    // Vérifier si l'accès est expiré
    if (now > endDate || !userAccess.isActive) {
      return {
        hasAccess: false,
        message: "Votre accès à la formation a expiré (90 jours dépassés).",
        expiredAt: userAccess.accessEndDate,
      };
    }

    // Calculer les jours restants
    const daysRemaining = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return {
      hasAccess: true,
      accessId: userAccess.id,
      daysRemaining,
      accessEndDate: userAccess.accessEndDate,
      completedModules: userAccess.completedModules,
      totalExercisesCompleted: userAccess.totalExercisesCompleted,
      overallScore: userAccess.overallScore,
      isCompleted: userAccess.isCompleted,
    };
  }),

  /**
   * Créer un accès à la formation après achat (appelé par le webhook Stripe)
   */
  createAccess: protectedProcedure
    .input(z.object({
      orderId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Vérifier que la commande existe
      const order = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (order.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Commande introuvable" });
      }

      // Calculer la date de fin d'accès (90 jours)
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 90);

      // Créer l'accès
      const [newAccess] = await db.insert(formationAccess).values({
        userId: ctx.user.id,
        orderId: input.orderId,
        accessStartDate: startDate,
        accessEndDate: endDate,
        isActive: true,
        isCompleted: false,
        completedModules: 0,
        totalExercisesCompleted: 0,
        overallScore: 0,
        lastAccessDate: startDate,
      });

      // Créer les 9 modules (seul le module 1 est débloqué)
      const modules = [
        { number: 1, name: "Le Code PFPMA (Fondations)", unlocked: true },
        { number: 2, name: "Les 3 Frictions (Diagnostic)", unlocked: false },
        { number: 3, name: "Le Facteur Alpha (α = 22.67)", unlocked: false },
        { number: 4, name: "Le Problème (P)", unlocked: false },
        { number: 5, name: "La Formule (F)", unlocked: false },
        { number: 6, name: "La Preuve (P)", unlocked: false },
        { number: 7, name: "La Méthode (M)", unlocked: false },
        { number: 8, name: "L'Appel (A)", unlocked: false },
        { number: 9, name: "Certification Finale", unlocked: false },
      ];

      for (const module of modules) {
        await db.insert(moduleProgress).values({
          userId: ctx.user.id,
          formationAccessId: newAccess.insertId,
          moduleNumber: module.number,
          moduleName: module.name,
          isUnlocked: module.unlocked,
          isStarted: false,
          isCompleted: false,
          completedExercises: 0,
          moduleScore: 0,
        });
      }

      return {
        success: true,
        accessId: newAccess.insertId,
        accessEndDate: endDate,
        message: "Accès à la formation créé avec succès ! Vous avez 90 jours pour terminer.",
      };
    }),

  // ============================================================================
  // GESTION DES MODULES
  // ============================================================================

  /**
   * Récupérer la liste des modules avec leur statut
   */
  getModules: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    // Récupérer l'accès actif
    const access = await db
      .select()
      .from(formationAccess)
      .where(and(
        eq(formationAccess.userId, ctx.user.id),
        eq(formationAccess.isActive, true)
      ))
      .limit(1);

    if (access.length === 0) {
      throw new TRPCError({ code: "FORBIDDEN", message: "Vous n'avez pas accès à la formation" });
    }

    // Récupérer les modules
    const modules = await db
      .select()
      .from(moduleProgress)
      .where(eq(moduleProgress.formationAccessId, access[0].id))
      .orderBy(moduleProgress.moduleNumber);

    return modules;
  }),

  /**
   * Démarrer un module
   */
  startModule: protectedProcedure
    .input(z.object({
      moduleNumber: z.number().min(1).max(9),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Récupérer l'accès actif
      const access = await db
        .select()
        .from(formationAccess)
        .where(and(
          eq(formationAccess.userId, ctx.user.id),
          eq(formationAccess.isActive, true)
        ))
        .limit(1);

      if (access.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Vous n'avez pas accès à la formation" });
      }

      // Récupérer le module
      const module = await db
        .select()
        .from(moduleProgress)
        .where(and(
          eq(moduleProgress.formationAccessId, access[0].id),
          eq(moduleProgress.moduleNumber, input.moduleNumber)
        ))
        .limit(1);

      if (module.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Module introuvable" });
      }

      // Vérifier que le module est débloqué
      if (!module[0].isUnlocked) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Ce module n'est pas encore débloqué. Termine le module précédent." });
      }

      // Marquer le module comme démarré
      await db
        .update(moduleProgress)
        .set({
          isStarted: true,
          startedAt: new Date(),
        })
        .where(eq(moduleProgress.id, module[0].id));

      return {
        success: true,
        message: `Module ${input.moduleNumber} démarré !`,
      };
    }),

  /**
   * Débloquer le module suivant (après validation des 3 exercices)
   */
  unlockNextModule: protectedProcedure
    .input(z.object({
      currentModuleNumber: z.number().min(1).max(8),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Récupérer l'accès actif
      const access = await db
        .select()
        .from(formationAccess)
        .where(and(
          eq(formationAccess.userId, ctx.user.id),
          eq(formationAccess.isActive, true)
        ))
        .limit(1);

      if (access.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Vous n'avez pas accès à la formation" });
      }

      // Débloquer le module suivant
      const nextModuleNumber = input.currentModuleNumber + 1;
      await db
        .update(moduleProgress)
        .set({
          isUnlocked: true,
        })
        .where(and(
          eq(moduleProgress.formationAccessId, access[0].id),
          eq(moduleProgress.moduleNumber, nextModuleNumber)
        ));

      return {
        success: true,
        message: `Module ${nextModuleNumber} débloqué !`,
        nextModuleNumber,
      };
    }),

  // ============================================================================
  // GESTION DES EXERCICES
  // ============================================================================

  /**
   * Soumettre une réponse à un exercice
   */
  submitExercise: protectedProcedure
    .input(z.object({
      moduleNumber: z.number().min(1).max(9),
      exerciseNumber: z.number().min(1).max(3),
      userAnswer: z.string().min(10).max(5000),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      // Récupérer l'accès actif
      const access = await db
        .select()
        .from(formationAccess)
        .where(and(
          eq(formationAccess.userId, ctx.user.id),
          eq(formationAccess.isActive, true)
        ))
        .limit(1);

      if (access.length === 0) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Vous n'avez pas accès à la formation" });
      }

      // Récupérer le module
      const module = await db
        .select()
        .from(moduleProgress)
        .where(and(
          eq(moduleProgress.formationAccessId, access[0].id),
          eq(moduleProgress.moduleNumber, input.moduleNumber)
        ))
        .limit(1);

      if (module.length === 0 || !module[0].isUnlocked) {
        throw new TRPCError({ code: "FORBIDDEN", message: "Module non accessible" });
      }

      // Compter les tentatives précédentes
      const previousAttempts = await db
        .select()
        .from(exerciseAttempts)
        .where(and(
          eq(exerciseAttempts.userId, ctx.user.id),
          eq(exerciseAttempts.moduleProgressId, module[0].id),
          eq(exerciseAttempts.exerciseNumber, input.exerciseNumber)
        ));

      const attemptNumber = previousAttempts.length + 1;

      // Valider la réponse (logique simplifiée - à améliorer)
      const validation = validateExercise(
        input.moduleNumber,
        input.exerciseNumber,
        input.userAnswer
      );

      // Enregistrer la tentative
      await db.insert(exerciseAttempts).values({
        userId: ctx.user.id,
        moduleProgressId: module[0].id,
        moduleNumber: input.moduleNumber,
        exerciseNumber: input.exerciseNumber,
        exerciseTitle: `Exercice ${input.exerciseNumber}`,
        userAnswer: input.userAnswer,
        isCorrect: validation.isCorrect,
        score: validation.score,
        feedback: validation.feedback,
        attemptNumber,
        submittedAt: new Date(),
      });

      // Si correct, mettre à jour la progression
      if (validation.isCorrect) {
        const newCompletedExercises = module[0].completedExercises + 1;
        const isModuleCompleted = newCompletedExercises === 3;

        await db
          .update(moduleProgress)
          .set({
            completedExercises: newCompletedExercises,
            isCompleted: isModuleCompleted,
            completedAt: isModuleCompleted ? new Date() : undefined,
          })
          .where(eq(moduleProgress.id, module[0].id));

        // Mettre à jour l'accès global
        await db
          .update(formationAccess)
          .set({
            totalExercisesCompleted: access[0].totalExercisesCompleted + 1,
            completedModules: isModuleCompleted ? access[0].completedModules + 1 : access[0].completedModules,
            isCompleted: isModuleCompleted && input.moduleNumber === 9,
          })
          .where(eq(formationAccess.id, access[0].id));

        // Si module complété, débloquer le suivant
        if (isModuleCompleted && input.moduleNumber < 9) {
          await db
            .update(moduleProgress)
            .set({ isUnlocked: true })
            .where(and(
              eq(moduleProgress.formationAccessId, access[0].id),
              eq(moduleProgress.moduleNumber, input.moduleNumber + 1)
            ));
        }

        // Attribuer des badges
        await checkAndAwardBadges(db, ctx.user.id, access[0].id, {
          moduleNumber: input.moduleNumber,
          isModuleCompleted,
          attemptNumber,
          score: validation.score,
        });
      }

      return {
        isCorrect: validation.isCorrect,
        score: validation.score,
        feedback: validation.feedback,
        attemptNumber,
        moduleCompleted: validation.isCorrect && module[0].completedExercises + 1 === 3,
      };
    }),

  /**
   * Récupérer les tentatives d'un exercice
   */
  getExerciseAttempts: protectedProcedure
    .input(z.object({
      moduleNumber: z.number().min(1).max(9),
      exerciseNumber: z.number().min(1).max(3),
    }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

      const attempts = await db
        .select()
        .from(exerciseAttempts)
        .where(and(
          eq(exerciseAttempts.userId, ctx.user.id),
          eq(exerciseAttempts.moduleNumber, input.moduleNumber),
          eq(exerciseAttempts.exerciseNumber, input.exerciseNumber)
        ))
        .orderBy(desc(exerciseAttempts.submittedAt));

      return attempts;
    }),

  // ============================================================================
  // GESTION DES BADGES
  // ============================================================================

  /**
   * Récupérer les badges de l'utilisateur
   */
  getBadges: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database unavailable" });

    const userBadges = await db
      .select()
      .from(badges)
      .where(eq(badges.userId, ctx.user.id))
      .orderBy(desc(badges.earnedAt));

    return userBadges;
  }),
});

// ============================================================================
// FONCTIONS UTILITAIRES
// ============================================================================

/**
 * Valider une réponse d'exercice (logique simplifiée)
 */
function validateExercise(
  moduleNumber: number,
  exerciseNumber: number,
  userAnswer: string
): { isCorrect: boolean; score: number; feedback: string } {
  
  // Validation basique (à améliorer avec une vraie logique de validation)
  const answerLength = userAnswer.trim().length;
  
  // Critères généraux
  const hasMinLength = answerLength >= 30;
  const hasMaxLength = answerLength <= 500;
  const hasStructure = userAnswer.includes("\n") || userAnswer.split(".").length > 2;
  
  let score = 0;
  let feedback = "";
  
  // Scoring basique
  if (hasMinLength) score += 30;
  if (hasMaxLength) score += 20;
  if (hasStructure) score += 20;
  
  // Validation spécifique par module (exemples)
  if (moduleNumber === 1) {
    // Module 1 : Code PFPMA
    const hasPFPMA = /problème|formule|preuve|méthode|appel/i.test(userAnswer);
    if (hasPFPMA) score += 30;
    
    if (score >= 70) {
      feedback = "✅ Excellent ! Tu as bien identifié les 5 parties du Code PFPMA.";
    } else {
      feedback = "❌ Ta réponse manque de structure. Relis le cours et identifie les 5 parties : Problème, Formule, Preuve, Méthode, Appel.";
    }
  } else if (moduleNumber === 2) {
    // Module 2 : Les 3 Frictions
    const hasFrictions = /attention|cognitive|émotionnelle|friction/i.test(userAnswer);
    if (hasFrictions) score += 30;
    
    if (score >= 70) {
      feedback = "✅ Très bien ! Tu as compris les 3 types de frictions.";
    } else {
      feedback = "❌ Ta réponse ne mentionne pas les 3 frictions. Relis le cours : Friction d'Attention, Friction Cognitive, Friction Émotionnelle.";
    }
  } else {
    // Validation générique pour les autres modules
    score += 30; // Bonus pour avoir essayé
    
    if (score >= 70) {
      feedback = "✅ Bonne réponse ! Continue comme ça.";
    } else {
      feedback = "❌ Ta réponse est trop courte ou manque de détails. Développe davantage.";
    }
  }
  
  return {
    isCorrect: score >= 70,
    score: Math.min(score, 100),
    feedback,
  };
}

/**
 * Attribuer des badges selon la progression
 */
async function checkAndAwardBadges(
  db: any,
  userId: number,
  formationAccessId: number,
  context: {
    moduleNumber: number;
    isModuleCompleted: boolean;
    attemptNumber: number;
    score: number;
  }
) {
  const badgesToAward: Array<{
    type: string;
    name: string;
    description: string;
    icon: string;
  }> = [];

  // Badge : Premier module complété
  if (context.moduleNumber === 1 && context.isModuleCompleted) {
    badgesToAward.push({
      type: "first_module",
      name: "Premier Pas 🚀",
      description: "Tu as complété ton premier module !",
      icon: "🚀",
    });
  }

  // Badge : Score parfait
  if (context.score === 100) {
    badgesToAward.push({
      type: "perfect_score",
      name: "Score Parfait ⭐",
      description: "Tu as obtenu 100/100 sur un exercice !",
      icon: "⭐",
    });
  }

  // Badge : Persévérant
  if (context.attemptNumber >= 10) {
    badgesToAward.push({
      type: "persistent",
      name: "Persévérant 💪",
      description: "Tu as fait 10+ tentatives avant de réussir !",
      icon: "💪",
    });
  }

  // Badge : Premier coup
  if (context.attemptNumber === 1 && context.score >= 70) {
    badgesToAward.push({
      type: "first_try",
      name: "Premier Coup 🎯",
      description: "Tu as réussi du premier coup !",
      icon: "🎯",
    });
  }

  // Insérer les badges
  for (const badge of badgesToAward) {
    // Vérifier si le badge n'existe pas déjà
    const existing = await db
      .select()
      .from(badges)
      .where(and(
        eq(badges.userId, userId),
        eq(badges.badgeType, badge.type)
      ))
      .limit(1);

    if (existing.length === 0) {
      await db.insert(badges).values({
        userId,
        formationAccessId,
        badgeType: badge.type,
        badgeName: badge.name,
        badgeDescription: badge.description,
        badgeIcon: badge.icon,
        earnedAt: new Date(),
      });
    }
  }
}
