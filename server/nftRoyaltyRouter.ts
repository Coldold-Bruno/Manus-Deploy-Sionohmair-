import { z } from "zod";
import { eq, desc, and, sql } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { 
  nftRoyaltyTracking, 
  nftBenefitEvents, 
  nftRoyaltyAlerts,
  nftBeneficiaries,
  nftSources,
  nftContributions
} from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

/**
 * Router tRPC pour le Tracking Temps Réel des Redevances NFT
 * 
 * Fonctionnalités :
 * - Tracker automatiquement les bénéfices générés
 * - Calculer les redevances dues en temps réel
 * - Notifier les utilisateurs
 * - Gérer les alertes
 */

export const nftRoyaltyRouter = router({
  
  // ============================================================================
  // TRACKING DES BÉNÉFICES
  // ============================================================================
  
  /**
   * Enregistrer un événement de bénéfice
   */
  recordBenefit: protectedProcedure
    .input(z.object({
      beneficiaryId: z.number(),
      eventType: z.enum(["correction_used", "benefit_declared", "revenue_detected", "conversion_tracked", "sale_completed", "other"]),
      amount: z.number().positive(),
      source: z.string().optional(),
      metadata: z.record(z.string(), z.any()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier que le beneficiary appartient à l'utilisateur
      const [beneficiary] = await db.select()
        .from(nftBeneficiaries)
        .where(eq(nftBeneficiaries.id, input.beneficiaryId));

      if (!beneficiary || beneficiary.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Récupérer le NFT Source pour connaître le taux de redevance
      const [source] = await db.select()
        .from(nftSources)
        .where(eq(nftSources.id, beneficiary.nftSourceId));

      if (!source) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NFT Source introuvable" });
      }

      // Calculer la redevance (taux par défaut selon la catégorie)
      const royaltyPercentage = source.category === "formation" ? 5.00 : 
                                 source.category === "coaching" ? 10.00 : 
                                 source.category === "template" ? 3.00 : 7.00;
      const royaltyAmount = (input.amount * royaltyPercentage) / 100;

      // Date limite : 30 jours après l'événement
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30);
      const dueDateTimestamp = dueDate;

      // Créer le tracking
      const [tracking] = await db.insert(nftRoyaltyTracking).values({
        beneficiaryId: input.beneficiaryId,
        sourceId: beneficiary.nftSourceId,
        userId: ctx.user.id,
        eventType: input.eventType,
        benefitAmount: input.amount.toFixed(2),
        royaltyPercentage: royaltyPercentage.toFixed(2),
        royaltyAmount: royaltyAmount.toFixed(2),
        status: "pending",
        dueDate,
        eventDetails: input.metadata ? JSON.stringify(input.metadata) : null,
      });

      // Créer une alerte
      await db.insert(nftRoyaltyAlerts).values({
        userId: ctx.user.id,
        alertType: "royalty_due",
        trackingId: tracking.insertId,
        title: "Nouvelle redevance due",
        message: `Un bénéfice de ${input.amount.toFixed(2)} € a été détecté. Redevance due : ${royaltyAmount.toFixed(2)} € (${royaltyPercentage}%)`,
        amount: royaltyAmount.toFixed(2),
        actionRequired: true,
        actionUrl: "/dashboard/nft-royalties",
      });

      return {
        trackingId: tracking.insertId,
        royaltyAmount,
        royaltyPercentage,
        dueDate,
      };
    }),

  /**
   * Récupérer mes redevances en attente
   */
  getMyPendingRoyalties: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const royalties = await db.select({
        tracking: nftRoyaltyTracking,
        source: nftSources,
        beneficiary: nftBeneficiaries,
      })
        .from(nftRoyaltyTracking)
        .leftJoin(nftSources, eq(nftRoyaltyTracking.sourceId, nftSources.id))
        .leftJoin(nftBeneficiaries, eq(nftRoyaltyTracking.beneficiaryId, nftBeneficiaries.id))
        .where(and(
          eq(nftRoyaltyTracking.userId, ctx.user.id),
          eq(nftRoyaltyTracking.status, "pending")
        ))
        .orderBy(desc(nftRoyaltyTracking.createdAt));

      return royalties.map(r => ({
        ...r.tracking,
        sourceName: r.source?.name || "Inconnu",
        sourceType: r.source?.category || "other",
        eventDetails: r.tracking.eventDetails ? JSON.parse(r.tracking.eventDetails) : null,
      }));
    }),

  /**
   * Récupérer toutes mes redevances
   */
  getMyRoyalties: protectedProcedure
    .input(z.object({
      status: z.enum(["pending", "notified", "paid", "overdue", "waived"]).optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(nftRoyaltyTracking.userId, ctx.user.id)];
      if (input?.status) {
        conditions.push(eq(nftRoyaltyTracking.status, input.status));
      }

      const royalties = await db.select({
        tracking: nftRoyaltyTracking,
        source: nftSources,
        beneficiary: nftBeneficiaries,
      })
        .from(nftRoyaltyTracking)
        .leftJoin(nftSources, eq(nftRoyaltyTracking.sourceId, nftSources.id))
        .leftJoin(nftBeneficiaries, eq(nftRoyaltyTracking.beneficiaryId, nftBeneficiaries.id))
        .where(and(...conditions))
        .orderBy(desc(nftRoyaltyTracking.createdAt));

      return royalties.map(r => ({
        ...r.tracking,
        sourceName: r.source?.name || "Inconnu",
        sourceType: r.source?.category || "other",
        eventDetails: r.tracking.eventDetails ? JSON.parse(r.tracking.eventDetails) : null,
      }));
    }),

  /**
   * Payer une redevance
   */
  payRoyalty: protectedProcedure
    .input(z.object({
      trackingId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier que le tracking appartient à l'utilisateur
      const [tracking] = await db.select()
        .from(nftRoyaltyTracking)
        .where(eq(nftRoyaltyTracking.id, input.trackingId));

      if (!tracking || tracking.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      if (tracking.status === "paid") {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Redevance déjà payée" });
      }

      // Créer une contribution NFT
      const [contribution] = await db.insert(nftContributions).values({
        beneficiaryId: tracking.beneficiaryId,
        nftSourceId: tracking.sourceId,
        amount: tracking.royaltyAmount,
        percentage: tracking.royaltyPercentage,
        reportedRevenue: tracking.benefitAmount,
        paymentMethod: "stripe",
        paymentStatus: "completed",
        paymentDate: new Date(),
        notes: `Redevance automatique - ${tracking.eventType}`,
      });

      // Mettre à jour le tracking
      await db.update(nftRoyaltyTracking)
        .set({
          status: "paid",
          paidAt: new Date(),
          contributionId: contribution.insertId,
        })
        .where(eq(nftRoyaltyTracking.id, input.trackingId));

      // Mettre à jour le bénéficiaire
      const [beneficiary] = await db.select()
        .from(nftBeneficiaries)
        .where(eq(nftBeneficiaries.id, tracking.beneficiaryId));

      if (beneficiary) {
        const newTotal = parseFloat(beneficiary.totalContributed) + parseFloat(tracking.royaltyAmount);
        
        // Calculer le nouveau niveau de gratitude
        let newLevel = beneficiary.gratitudeLevel;
        if (newTotal >= 10000) newLevel = "exceptional";
        else if (newTotal >= 5000) newLevel = "high";
        else if (newTotal >= 1000) newLevel = "medium";
        else if (newTotal >= 100) newLevel = "low";

        await db.update(nftBeneficiaries)
          .set({
            totalContributed: newTotal.toFixed(2),
            lastContributionAt: new Date(),
            contributionStatus: "active",
            gratitudeLevel: newLevel,
          })
          .where(eq(nftBeneficiaries.id, tracking.beneficiaryId));
      }

      // Enrichir le NFT Source
      const [source] = await db.select()
        .from(nftSources)
        .where(eq(nftSources.id, tracking.sourceId));

      if (source) {
        const newValue = parseFloat(source.currentValue) + parseFloat(tracking.royaltyAmount) * 22.67; // Facteur Alpha
        await db.update(nftSources)
          .set({
            currentValue: newValue.toFixed(2),
          })
          .where(eq(nftSources.id, tracking.sourceId));
      }

      return { success: true, contributionId: contribution.insertId };
    }),

  // ============================================================================
  // ALERTES
  // ============================================================================

  /**
   * Récupérer mes alertes
   */
  getMyAlerts: protectedProcedure
    .input(z.object({
      unreadOnly: z.boolean().optional(),
    }).optional())
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return [];

      const conditions = [eq(nftRoyaltyAlerts.userId, ctx.user.id)];
      if (input?.unreadOnly) {
        conditions.push(eq(nftRoyaltyAlerts.isRead, false));
      }

      const alerts = await db.select()
        .from(nftRoyaltyAlerts)
        .where(and(...conditions))
        .orderBy(desc(nftRoyaltyAlerts.createdAt));

      return alerts;
    }),

  /**
   * Marquer une alerte comme lue
   */
  markAlertAsRead: protectedProcedure
    .input(z.object({
      alertId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [alert] = await db.select()
        .from(nftRoyaltyAlerts)
        .where(eq(nftRoyaltyAlerts.id, input.alertId));

      if (!alert || alert.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.update(nftRoyaltyAlerts)
        .set({ isRead: true })
        .where(eq(nftRoyaltyAlerts.id, input.alertId));

      return { success: true };
    }),

  /**
   * Marquer toutes les alertes comme lues
   */
  markAllAlertsAsRead: protectedProcedure
    .mutation(async ({ ctx }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(nftRoyaltyAlerts)
        .set({ isRead: true })
        .where(eq(nftRoyaltyAlerts.userId, ctx.user.id));

      return { success: true };
    }),

  // ============================================================================
  // STATISTIQUES
  // ============================================================================

  /**
   * Récupérer les statistiques de mes redevances
   */
  getMyRoyaltyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const royalties = await db.select()
        .from(nftRoyaltyTracking)
        .where(eq(nftRoyaltyTracking.userId, ctx.user.id));

      const totalRoyalties = royalties.length;
      const totalBenefits = royalties.reduce((sum, r) => sum + parseFloat(r.benefitAmount), 0);
      const totalRoyaltiesAmount = royalties.reduce((sum, r) => sum + parseFloat(r.royaltyAmount), 0);
      const totalPaid = royalties.filter(r => r.status === "paid").reduce((sum, r) => sum + parseFloat(r.royaltyAmount), 0);
      const totalPending = royalties.filter(r => r.status === "pending").reduce((sum, r) => sum + parseFloat(r.royaltyAmount), 0);
      const totalOverdue = royalties.filter(r => r.status === "overdue").reduce((sum, r) => sum + parseFloat(r.royaltyAmount), 0);

      const byEventType = royalties.reduce((acc, r) => {
        acc[r.eventType] = (acc[r.eventType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalRoyalties,
        totalBenefits: Math.round(totalBenefits * 100) / 100,
        totalRoyaltiesAmount: Math.round(totalRoyaltiesAmount * 100) / 100,
        totalPaid: Math.round(totalPaid * 100) / 100,
        totalPending: Math.round(totalPending * 100) / 100,
        totalOverdue: Math.round(totalOverdue * 100) / 100,
        byEventType,
      };
    }),

  /**
   * Récupérer les redevances en temps réel (dashboard)
   */
  getRealTimeRoyalties: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      // Récupérer les 10 dernières redevances
      const recentRoyalties = await db.select({
        tracking: nftRoyaltyTracking,
        source: nftSources,
      })
        .from(nftRoyaltyTracking)
        .leftJoin(nftSources, eq(nftRoyaltyTracking.sourceId, nftSources.id))
        .where(eq(nftRoyaltyTracking.userId, ctx.user.id))
        .orderBy(desc(nftRoyaltyTracking.createdAt))
        .limit(10);

      return recentRoyalties.map(r => ({
        ...r.tracking,
        sourceName: r.source?.name || "Inconnu",
        eventDetails: r.tracking.eventDetails ? JSON.parse(r.tracking.eventDetails) : null,
      }));
    }),
});
