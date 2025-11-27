import { z } from "zod";
import { eq, and, desc, sql } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { 
  nftSources, 
  nftBeneficiaries, 
  nftContributions, 
  nftInquiries,
  users 
} from "../drizzle/schema";
import { TRPCError } from "@trpc/server";

/**
 * Router tRPC pour le système NFT de Gratitude Économique
 * 
 * Fonctionnalités :
 * - Créer et gérer les NFT Sources
 * - Attribuer des NFT aux bénéficiaires
 * - Enregistrer les contributions
 * - Gérer les enquêtes de recouvrement
 * - Calculer les niveaux de gratitude
 */

export const nftGratitudeRouter = router({
  
  // ============================================================================
  // GESTION DES NFT SOURCES (Admin uniquement)
  // ============================================================================
  
  /**
   * Créer un nouveau NFT Source
   */
  createNftSource: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      description: z.string().optional(),
      category: z.enum(["formation", "resource", "template", "coaching", "other"]),
      initialValue: z.number().min(0),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [nftSource] = await db.insert(nftSources).values({
        name: input.name,
        description: input.description,
        category: input.category,
        initialValue: input.initialValue.toFixed(2),
        currentValue: input.initialValue.toFixed(2),
      });

      return { success: true, nftSourceId: nftSource.insertId };
    }),

  /**
   * Récupérer tous les NFT Sources
   */
  getAllNftSources: publicProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];

      const sources = await db.select().from(nftSources).orderBy(desc(nftSources.currentValue));
      return sources;
    }),

  /**
   * Récupérer un NFT Source par ID
   */
  getNftSourceById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) return null;

      const [source] = await db.select().from(nftSources).where(eq(nftSources.id, input.id));
      return source || null;
    }),

  /**
   * Mettre à jour un NFT Source
   */
  updateNftSource: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      description: z.string().optional(),
      category: z.enum(["formation", "resource", "template", "coaching", "other"]).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(nftSources)
        .set({
          ...(input.name && { name: input.name }),
          ...(input.description && { description: input.description }),
          ...(input.category && { category: input.category }),
        })
        .where(eq(nftSources.id, input.id));

      return { success: true };
    }),

  // ============================================================================
  // GESTION DES BÉNÉFICIAIRES
  // ============================================================================

  /**
   * Attribuer un NFT Source à un bénéficiaire
   */
  grantNftToBeneficiary: protectedProcedure
    .input(z.object({
      userId: z.number(),
      nftSourceId: z.number(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier si le bénéficiaire n'a pas déjà ce NFT
      const existing = await db.select()
        .from(nftBeneficiaries)
        .where(and(
          eq(nftBeneficiaries.userId, input.userId),
          eq(nftBeneficiaries.nftSourceId, input.nftSourceId)
        ));

      if (existing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Beneficiary already has this NFT" });
      }

      // Créer le bénéficiaire
      await db.insert(nftBeneficiaries).values({
        userId: input.userId,
        nftSourceId: input.nftSourceId,
        contributionStatus: "pending",
        gratitudeLevel: "none",
      });

      // Incrémenter le compteur de bénéficiaires
      await db.update(nftSources)
        .set({ beneficiariesCount: sql`${nftSources.beneficiariesCount} + 1` })
        .where(eq(nftSources.id, input.nftSourceId));

      return { success: true };
    }),

  /**
   * Récupérer les NFT d'un bénéficiaire
   */
  getMyNfts: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const beneficiaries = await db.select({
        beneficiary: nftBeneficiaries,
        nftSource: nftSources,
      })
        .from(nftBeneficiaries)
        .leftJoin(nftSources, eq(nftBeneficiaries.nftSourceId, nftSources.id))
        .where(eq(nftBeneficiaries.userId, ctx.user.id))
        .orderBy(desc(nftBeneficiaries.grantedAt));

      return beneficiaries;
    }),

  /**
   * Récupérer tous les bénéficiaires (Admin)
   */
  getAllBeneficiaries: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) return [];

      const beneficiaries = await db.select({
        beneficiary: nftBeneficiaries,
        nftSource: nftSources,
        user: users,
      })
        .from(nftBeneficiaries)
        .leftJoin(nftSources, eq(nftBeneficiaries.nftSourceId, nftSources.id))
        .leftJoin(users, eq(nftBeneficiaries.userId, users.id))
        .orderBy(desc(nftBeneficiaries.totalContributed));

      return beneficiaries;
    }),

  // ============================================================================
  // GESTION DES CONTRIBUTIONS
  // ============================================================================

  /**
   * Enregistrer une contribution
   */
  recordContribution: protectedProcedure
    .input(z.object({
      beneficiaryId: z.number(),
      nftSourceId: z.number(),
      amount: z.number().min(0),
      percentage: z.number().min(0).max(100),
      reportedRevenue: z.number().min(0),
      paymentMethod: z.enum(["stripe", "bank_transfer", "other"]).default("stripe"),
      notes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier que l'utilisateur est bien le bénéficiaire ou un admin
      const [beneficiary] = await db.select()
        .from(nftBeneficiaries)
        .where(eq(nftBeneficiaries.id, input.beneficiaryId));

      if (!beneficiary) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Beneficiary not found" });
      }

      if (beneficiary.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Enregistrer la contribution
      await db.insert(nftContributions).values({
        beneficiaryId: input.beneficiaryId,
        nftSourceId: input.nftSourceId,
        amount: input.amount.toFixed(2),
        percentage: input.percentage.toFixed(2),
        reportedRevenue: input.reportedRevenue.toFixed(2),
        paymentMethod: input.paymentMethod,
        paymentStatus: "pending",
        notes: input.notes,
      });

      // Mettre à jour le total contribué du bénéficiaire
      await db.update(nftBeneficiaries)
        .set({
          totalContributed: sql`${nftBeneficiaries.totalContributed} + ${input.amount}`,
          lastContributionAt: new Date(),
          contributionStatus: "active",
        })
        .where(eq(nftBeneficiaries.id, input.beneficiaryId));

      // Mettre à jour le NFT Source (enrichissement)
      const ALPHA = 22.67;
      const enrichment = input.amount * ALPHA;

      await db.update(nftSources)
        .set({
          totalContributions: sql`${nftSources.totalContributions} + ${input.amount}`,
          currentValue: sql`${nftSources.currentValue} + ${enrichment}`,
        })
        .where(eq(nftSources.id, input.nftSourceId));

      // Recalculer le niveau de gratitude
      await updateGratitudeLevel(db, input.beneficiaryId);

      return { success: true };
    }),

  /**
   * Récupérer les contributions d'un bénéficiaire
   */
  getMyContributions: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const contributions = await db.select({
        contribution: nftContributions,
        nftSource: nftSources,
      })
        .from(nftContributions)
        .leftJoin(nftSources, eq(nftContributions.nftSourceId, nftSources.id))
        .leftJoin(nftBeneficiaries, eq(nftContributions.beneficiaryId, nftBeneficiaries.id))
        .where(eq(nftBeneficiaries.userId, ctx.user.id))
        .orderBy(desc(nftContributions.createdAt));

      return contributions;
    }),

  /**
   * Récupérer toutes les contributions (Admin)
   */
  getAllContributions: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) return [];

      const contributions = await db.select({
        contribution: nftContributions,
        nftSource: nftSources,
        beneficiary: nftBeneficiaries,
        user: users,
      })
        .from(nftContributions)
        .leftJoin(nftSources, eq(nftContributions.nftSourceId, nftSources.id))
        .leftJoin(nftBeneficiaries, eq(nftContributions.beneficiaryId, nftBeneficiaries.id))
        .leftJoin(users, eq(nftBeneficiaries.userId, users.id))
        .orderBy(desc(nftContributions.createdAt));

      return contributions;
    }),

  // ============================================================================
  // GESTION DES ENQUÊTES DE RECOUVREMENT
  // ============================================================================

  /**
   * Créer une enquête de recouvrement
   */
  createInquiry: protectedProcedure
    .input(z.object({
      beneficiaryId: z.number(),
      inquiryType: z.enum(["initial", "quarterly", "annual", "on_demand"]),
      reportedRevenue: z.number().min(0),
      evidenceProvided: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Vérifier que l'utilisateur est bien le bénéficiaire
      const [beneficiary] = await db.select()
        .from(nftBeneficiaries)
        .where(eq(nftBeneficiaries.id, input.beneficiaryId));

      if (!beneficiary) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      if (beneficiary.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      // Récupérer le NFT Source pour calculer le pourcentage
      const [nftSource] = await db.select()
        .from(nftSources)
        .where(eq(nftSources.id, beneficiary.nftSourceId));

      if (!nftSource) {
        throw new TRPCError({ code: "NOT_FOUND", message: "NFT Source not found" });
      }

      // Calculer la contribution selon le barème (exemple : 5% pour formations)
      let percentage = 5.0;
      if (nftSource.category === "coaching") percentage = 10.0;
      if (nftSource.category === "template") percentage = 3.0;
      if (nftSource.category === "resource") percentage = 7.0;

      const calculatedContribution = (input.reportedRevenue * percentage) / 100;

      // Créer l'enquête
      await db.insert(nftInquiries).values({
        beneficiaryId: input.beneficiaryId,
        inquiryType: input.inquiryType,
        reportedRevenue: input.reportedRevenue.toFixed(2),
        evidenceProvided: input.evidenceProvided,
        calculatedContribution: calculatedContribution.toFixed(2),
        status: "pending",
      });

      return { 
        success: true, 
        calculatedContribution,
        percentage 
      };
    }),

  /**
   * Récupérer mes enquêtes
   */
  getMyInquiries: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const inquiries = await db.select({
        inquiry: nftInquiries,
        beneficiary: nftBeneficiaries,
        nftSource: nftSources,
      })
        .from(nftInquiries)
        .leftJoin(nftBeneficiaries, eq(nftInquiries.beneficiaryId, nftBeneficiaries.id))
        .leftJoin(nftSources, eq(nftBeneficiaries.nftSourceId, nftSources.id))
        .where(eq(nftBeneficiaries.userId, ctx.user.id))
        .orderBy(desc(nftInquiries.inquiryDate));

      return inquiries;
    }),

  /**
   * Récupérer toutes les enquêtes (Admin)
   */
  getAllInquiries: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) return [];

      const inquiries = await db.select({
        inquiry: nftInquiries,
        beneficiary: nftBeneficiaries,
        nftSource: nftSources,
        user: users,
      })
        .from(nftInquiries)
        .leftJoin(nftBeneficiaries, eq(nftInquiries.beneficiaryId, nftBeneficiaries.id))
        .leftJoin(nftSources, eq(nftBeneficiaries.nftSourceId, nftSources.id))
        .leftJoin(users, eq(nftBeneficiaries.userId, users.id))
        .orderBy(desc(nftInquiries.inquiryDate));

      return inquiries;
    }),

  /**
   * Approuver ou rejeter une enquête (Admin)
   */
  reviewInquiry: protectedProcedure
    .input(z.object({
      inquiryId: z.number(),
      status: z.enum(["approved", "disputed"]),
      adminNotes: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      await db.update(nftInquiries)
        .set({
          status: input.status,
          adminNotes: input.adminNotes,
          reviewedBy: ctx.user.id,
          reviewedAt: new Date(),
        })
        .where(eq(nftInquiries.id, input.inquiryId));

      return { success: true };
    }),

  // ============================================================================
  // STATISTIQUES ET TABLEAUX DE BORD
  // ============================================================================

  /**
   * Récupérer les statistiques globales (Admin)
   */
  getGlobalStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      const db = await getDb();
      if (!db) return null;

      const [sourcesStats] = await db.select({
        totalSources: sql<number>`COUNT(*)`,
        totalValue: sql<number>`SUM(${nftSources.currentValue})`,
        totalContributions: sql<number>`SUM(${nftSources.totalContributions})`,
        totalBeneficiaries: sql<number>`SUM(${nftSources.beneficiariesCount})`,
      }).from(nftSources);

      const [beneficiariesStats] = await db.select({
        totalBeneficiaries: sql<number>`COUNT(*)`,
        activeBeneficiaries: sql<number>`COUNT(CASE WHEN ${nftBeneficiaries.contributionStatus} = 'active' THEN 1 END)`,
        completedBeneficiaries: sql<number>`COUNT(CASE WHEN ${nftBeneficiaries.contributionStatus} = 'completed' THEN 1 END)`,
      }).from(nftBeneficiaries);

      const [contributionsStats] = await db.select({
        totalContributions: sql<number>`COUNT(*)`,
        totalAmount: sql<number>`SUM(${nftContributions.amount})`,
        pendingAmount: sql<number>`SUM(CASE WHEN ${nftContributions.paymentStatus} = 'pending' THEN ${nftContributions.amount} ELSE 0 END)`,
      }).from(nftContributions);

      return {
        sources: sourcesStats,
        beneficiaries: beneficiariesStats,
        contributions: contributionsStats,
      };
    }),
});

/**
 * Fonction utilitaire pour mettre à jour le niveau de gratitude
 */
async function updateGratitudeLevel(db: any, beneficiaryId: number) {
  const [beneficiary] = await db.select()
    .from(nftBeneficiaries)
    .where(eq(nftBeneficiaries.id, beneficiaryId));

  if (!beneficiary) return;

  const totalContributed = parseFloat(beneficiary.totalContributed);
  let gratitudeLevel: "none" | "low" | "medium" | "high" | "exceptional" = "none";

  if (totalContributed >= 10001) gratitudeLevel = "exceptional";
  else if (totalContributed >= 2001) gratitudeLevel = "high";
  else if (totalContributed >= 501) gratitudeLevel = "medium";
  else if (totalContributed >= 1) gratitudeLevel = "low";

  await db.update(nftBeneficiaries)
    .set({ gratitudeLevel })
    .where(eq(nftBeneficiaries.id, beneficiaryId));
}
