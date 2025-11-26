import { z } from "zod";
import { eq, and, desc } from "drizzle-orm";
import { getDb } from "./db";
import { quotes, quoteTemplates } from "../drizzle/schema";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";

/**
 * Router pour la gestion des devis Visual Graphic
 */
export const quotesRouter = router({
  /**
   * Créer une demande de devis
   */
  createQuote: publicProcedure
    .input(
      z.object({
        clientName: z.string().min(2),
        clientEmail: z.string().email(),
        clientPhone: z.string().optional(),
        serviceType: z.enum(["visual_graphic"]),
        serviceTier: z.enum(["starter", "intermediate", "premium"]).optional(),
        projectDescription: z.string().min(20),
        projectDetails: z.object({
          quantity: z.number().optional(),
          deadline: z.string().optional(),
          specificRequirements: z.array(z.string()).optional(),
        }).optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Calculer le prix de base selon le tier
      let basePrice = 2500; // 25€ par défaut (Starter)
      if (input.serviceTier === "intermediate") {
        basePrice = 4500; // 45€
      } else if (input.serviceTier === "premium") {
        basePrice = 10000; // 100€
      }

      // Calculer la date d'expiration (30 jours)
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      // Créer le devis
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [quote] = await db.insert(quotes).values({
        userId: ctx.user?.id,
        clientName: input.clientName,
        clientEmail: input.clientEmail,
        clientPhone: input.clientPhone,
        serviceType: input.serviceType,
        serviceTier: input.serviceTier,
        projectDescription: input.projectDescription,
        projectDetails: input.projectDetails,
        basePrice,
        adjustments: [],
        finalPrice: basePrice,
        status: "pending",
        expiresAt,
      });

      return { success: true, quoteId: quote.insertId };
    }),

  /**
   * Récupérer tous les devis d'un utilisateur
   */
  getMyQuotes: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) throw new Error("Database not available");
    
    const userQuotes = await db
      .select()
      .from(quotes)
      .where(eq(quotes.userId, ctx.user.id))
      .orderBy(desc(quotes.createdAt));

    return userQuotes;
  }),

  /**
   * Récupérer un devis par ID
   */
  getQuoteById: publicProcedure
    .input(z.object({ quoteId: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.id, input.quoteId));

      if (!quote) {
        throw new Error("Devis introuvable");
      }

      return quote;
    }),

  /**
   * Accepter un devis
   */
  acceptQuote: publicProcedure
    .input(z.object({ quoteId: z.number() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      const [quote] = await db
        .select()
        .from(quotes)
        .where(eq(quotes.id, input.quoteId));

      if (!quote) {
        throw new Error("Devis introuvable");
      }

      if (quote.status !== "pending" && quote.status !== "sent") {
        throw new Error("Ce devis ne peut plus être accepté");
      }

      // Vérifier si le devis n'est pas expiré
      if (new Date() > new Date(quote.expiresAt)) {
        await db
          .update(quotes)
          .set({ status: "expired" })
          .where(eq(quotes.id, input.quoteId));
        throw new Error("Ce devis a expiré");
      }

      // Accepter le devis
      await db
        .update(quotes)
        .set({
          status: "accepted",
          acceptedAt: new Date(),
        })
        .where(eq(quotes.id, input.quoteId));

      return { success: true, quote };
    }),

  /**
   * Refuser un devis
   */
  rejectQuote: publicProcedure
    .input(
      z.object({
        quoteId: z.number(),
        reason: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error("Database not available");
      
      await db
        .update(quotes)
        .set({
          status: "rejected",
          rejectedAt: new Date(),
          rejectionReason: input.reason,
        })
        .where(eq(quotes.id, input.quoteId));

      return { success: true };
    }),

  /**
   * Récupérer tous les devis (admin)
   */
  getAllQuotes: protectedProcedure.query(async ({ ctx }) => {
    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const allQuotes = await db
      .select()
      .from(quotes)
      .orderBy(desc(quotes.createdAt));

    return allQuotes;
  }),

  /**
   * Mettre à jour un devis (admin)
   */
  updateQuote: protectedProcedure
    .input(
      z.object({
        quoteId: z.number(),
        adjustments: z.array(
          z.object({
            label: z.string(),
            amount: z.number(),
            type: z.enum(["addition", "reduction"]),
          })
        ).optional(),
        finalPrice: z.number().optional(),
        internalNotes: z.string().optional(),
        pdfUrl: z.string().optional(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const updateData: any = {};

      if (input.adjustments !== undefined) {
        updateData.adjustments = input.adjustments;
      }
      if (input.finalPrice !== undefined) {
        updateData.finalPrice = input.finalPrice;
      }
      if (input.internalNotes !== undefined) {
        updateData.internalNotes = input.internalNotes;
      }
      if (input.pdfUrl !== undefined) {
        updateData.pdfUrl = input.pdfUrl;
        updateData.pdfGeneratedAt = new Date();
        updateData.status = "sent";
      }

      await db
        .update(quotes)
        .set(updateData)
        .where(eq(quotes.id, input.quoteId));

      return { success: true };
    }),

  /**
   * Créer un template de devis (admin)
   */
  createTemplate: protectedProcedure
    .input(
      z.object({
        serviceType: z.enum(["visual_graphic"]),
        serviceTier: z.enum(["starter", "intermediate", "premium"]).optional(),
        name: z.string(),
        description: z.string().optional(),
        content: z.object({
          sections: z.array(
            z.object({
              title: z.string(),
              content: z.string(),
              order: z.number(),
            })
          ),
          deliverables: z.array(z.string()),
          timeline: z.string(),
          terms: z.array(z.string()),
        }),
        basePrice: z.number(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== "admin") {
        throw new Error("Accès refusé");
      }

      const db = await getDb();
      if (!db) throw new Error("Database not available");

      const [template] = await db.insert(quoteTemplates).values({
        serviceType: input.serviceType,
        serviceTier: input.serviceTier,
        name: input.name,
        description: input.description,
        content: input.content,
        basePrice: input.basePrice,
        isActive: "yes",
      });

      return { success: true, templateId: template.insertId };
    }),

  /**
   * Récupérer tous les templates
   */
  getTemplates: protectedProcedure.query(async ({ ctx }) => {
    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== "admin") {
      throw new Error("Accès refusé");
    }

    const db = await getDb();
    if (!db) throw new Error("Database not available");

    const templates = await db
      .select()
      .from(quoteTemplates)
      .where(eq(quoteTemplates.isActive, "yes"))
      .orderBy(desc(quoteTemplates.createdAt));

    return templates;
  }),
});
