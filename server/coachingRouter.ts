import { z } from "zod";
import { eq, and, desc, gte, lte } from "drizzle-orm";
import { getDb } from "./db";
import { coachAvailability, coachingSessions, sprintDeliverables } from "../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

/**
 * Router pour la gestion des sessions de coaching Zoom
 */
export const coachingRouter = router({
  /**
   * ADMIN: Créer des créneaux disponibles
   */
  createAvailability: protectedProcedure
    .input(
      z.object({
        startTime: z.string(), // ISO date string
        endTime: z.string(),
        isRecurring: z.enum(["yes", "no"]).optional(),
        recurringPattern: z.object({
          frequency: z.enum(["daily", "weekly", "monthly"]),
          interval: z.number(),
          daysOfWeek: z.array(z.number()).optional(),
          endDate: z.string().optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [availability] = await db.insert(coachAvailability).values({
        startTime: new Date(input.startTime),
        endTime: new Date(input.endTime),
        status: "available",
        isRecurring: input.isRecurring || "no",
        recurringPattern: input.recurringPattern,
      });

      return { success: true, availabilityId: availability.insertId };
    }),

  /**
   * Récupérer les créneaux disponibles (pour réservation)
   */
  getAvailableSlots: publicProcedure
    .input(
      z.object({
        startDate: z.string(), // ISO date string
        endDate: z.string(),
      })
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const slots = await db
        .select()
        .from(coachAvailability)
        .where(
          and(
            eq(coachAvailability.status, "available"),
            gte(coachAvailability.startTime, new Date(input.startDate)),
            lte(coachAvailability.endTime, new Date(input.endDate))
          )
        )
        .orderBy(coachAvailability.startTime);

      return slots;
    }),

  /**
   * Réserver un créneau (créer une session)
   */
  bookSession: protectedProcedure
    .input(
      z.object({
        availabilityId: z.number(),
        orderId: z.number().optional(),
        clientPhone: z.string().optional(),
        clientTimezone: z.string().optional(),
        preferredContactMethod: z.enum(["email", "phone", "whatsapp"]).optional(),
        preSessionQuestionnaire: z.object({
          objectives: z.array(z.string()).optional(),
          questions: z.array(z.string()).optional(),
          documentsToReview: z.array(z.string()).optional(),
          specificTopics: z.array(z.string()).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Vérifier que le créneau est disponible
      const [availability] = await db
        .select()
        .from(coachAvailability)
        .where(eq(coachAvailability.id, input.availabilityId));

      if (!availability || availability.status !== "available") {
        throw new Error("Ce créneau n'est plus disponible");
      }

      // Marquer le créneau comme réservé
      await db
        .update(coachAvailability)
        .set({ status: "booked" })
        .where(eq(coachAvailability.id, input.availabilityId));

      // Créer la session
      const [session] = await db.insert(coachingSessions).values({
        userId: ctx.user.id,
        orderId: input.orderId,
        availabilityId: input.availabilityId,
        scheduledAt: availability.startTime,
        duration: 60,
        clientPhone: input.clientPhone,
        clientTimezone: input.clientTimezone,
        preferredContactMethod: input.preferredContactMethod || "email",
        preSessionQuestionnaire: input.preSessionQuestionnaire,
        preSessionCompleted: input.preSessionQuestionnaire ? "yes" : "no",
        status: "scheduled",
        reminderSent24h: "no",
        reminderSent1h: "no",
      });

      // TODO: Générer le lien Zoom via l'API Zoom (Phase 3)

      return { success: true, sessionId: session.insertId };
    }),

  /**
   * Récupérer les sessions d'un utilisateur
   */
  getMySessions: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const sessions = await db
      .select()
      .from(coachingSessions)
      .where(eq(coachingSessions.userId, ctx.user.id))
      .orderBy(desc(coachingSessions.scheduledAt));

    return sessions;
  }),

  /**
   * Récupérer une session par ID
   */
  getSessionById: protectedProcedure
    .input(z.object({ sessionId: z.number() }))
    .query(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [session] = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, input.sessionId));

      if (!session) {
        throw new Error("Session introuvable");
      }

      // Vérifier que l'utilisateur a accès à cette session
      if (session.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      return session;
    }),

  /**
   * Mettre à jour le questionnaire pré-session
   */
  updatePreSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        questionnaire: z.object({
          objectives: z.array(z.string()).optional(),
          questions: z.array(z.string()).optional(),
          documentsToReview: z.array(z.string()).optional(),
          specificTopics: z.array(z.string()).optional(),
        }),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      // Vérifier que l'utilisateur est propriétaire de la session
      const [session] = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, input.sessionId));

      if (!session || session.userId !== ctx.user.id) {
        throw new Error("Accès refusé");
      }

      await db
        .update(coachingSessions)
        .set({
          preSessionQuestionnaire: input.questionnaire,
          preSessionCompleted: "yes",
        })
        .where(eq(coachingSessions.id, input.sessionId));

      return { success: true };
    }),

  /**
   * ADMIN: Ajouter le compte-rendu post-session
   */
  updatePostSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        summary: z.object({
          keyPoints: z.array(z.string()).optional(),
          decisionsMade: z.array(z.string()).optional(),
          actionItems: z.array(
            z.object({
              task: z.string(),
              deadline: z.string().optional(),
              priority: z.enum(["high", "medium", "low"]),
            })
          ).optional(),
          nextSteps: z.array(z.string()).optional(),
        }),
        sessionNotes: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      await db
        .update(coachingSessions)
        .set({
          postSessionSummary: input.summary,
          sessionNotes: input.sessionNotes,
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(coachingSessions.id, input.sessionId));

      return { success: true };
    }),

  /**
   * Annuler une session
   */
  cancelSession: protectedProcedure
    .input(
      z.object({
        sessionId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [session] = await db
        .select()
        .from(coachingSessions)
        .where(eq(coachingSessions.id, input.sessionId));

      if (!session) {
        throw new Error("Session introuvable");
      }

      // Vérifier que l'utilisateur a le droit d'annuler
      if (session.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      // Libérer le créneau
      if (session.availabilityId) {
        await db
          .update(coachAvailability)
          .set({ status: "available" })
          .where(eq(coachAvailability.id, session.availabilityId));
      }

      // Annuler la session
      await db
        .update(coachingSessions)
        .set({
          status: "cancelled",
          cancelledAt: new Date(),
          cancellationReason: input.reason,
        })
        .where(eq(coachingSessions.id, input.sessionId));

      return { success: true };
    }),

  /**
   * ADMIN: Créer un livrable
   */
  createDeliverable: protectedProcedure
    .input(
      z.object({
        userId: z.number(),
        orderId: z.number(),
        sessionId: z.number().optional(),
        deliverableType: z.enum([
          "diagnostic_pfpma",
          "analyse_frictions",
          "facteur_alpha",
          "plan_action",
          "texte_optimise",
          "rapport_final",
          "autre",
        ]),
        title: z.string(),
        description: z.string().optional(),
        fileUrl: z.string().optional(),
        fileType: z.string().optional(),
        fileSize: z.number().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [deliverable] = await db.insert(sprintDeliverables).values({
        userId: input.userId,
        orderId: input.orderId,
        sessionId: input.sessionId,
        deliverableType: input.deliverableType,
        title: input.title,
        description: input.description,
        fileUrl: input.fileUrl,
        fileType: input.fileType,
        fileSize: input.fileSize,
        status: "pending",
        version: 1,
        revisionRequested: "no",
      });

      return { success: true, deliverableId: deliverable.insertId };
    }),

  /**
   * Récupérer les livrables d'un utilisateur
   */
  getMyDeliverables: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const deliverables = await db
      .select()
      .from(sprintDeliverables)
      .where(eq(sprintDeliverables.userId, ctx.user.id))
      .orderBy(desc(sprintDeliverables.createdAt));

    return deliverables;
  }),

  /**
   * ADMIN: Récupérer toutes les sessions
   */
  getAllSessions: protectedProcedure.query(async ({ ctx }) => {
    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const sessions = await db
      .select()
      .from(coachingSessions)
      .orderBy(desc(coachingSessions.scheduledAt));

    return sessions;
  }),
});
