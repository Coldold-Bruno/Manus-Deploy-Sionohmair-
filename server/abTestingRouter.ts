import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { abTests, abTestResults } from "../drizzle/schema";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { eq, and, sql } from "drizzle-orm";

export const abTestingRouter = router({
  /**
   * Create a new A/B test (admin only)
   */
  createTest: protectedProcedure
    .input(z.object({
      name: z.string().min(1),
      variantA: z.string().min(1),
      variantB: z.string().min(1),
      emailContent: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [test] = await db.insert(abTests).values({
        name: input.name,
        variantA: input.variantA,
        variantB: input.variantB,
        emailContent: input.emailContent,
        status: "draft",
      });

      return {
        success: true,
        testId: test.insertId,
      };
    }),

  /**
   * Get all A/B tests (admin only)
   */
  getTests: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const tests = await db.select().from(abTests).orderBy(sql`${abTests.createdAt} DESC`);

      return tests;
    }),

  /**
   * Get test results with statistics (admin only)
   */
  getTestResults: protectedProcedure
    .input(z.object({
      testId: z.number(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get test details
      const test = await db.select().from(abTests).where(eq(abTests.id, input.testId)).limit(1);
      if (test.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Test not found" });
      }

      // Get all results
      const results = await db.select().from(abTestResults).where(eq(abTestResults.testId, input.testId));

      // Calculate statistics
      const variantAResults = results.filter(r => r.variant === "A");
      const variantBResults = results.filter(r => r.variant === "B");

      const stats = {
        variantA: {
          sent: variantAResults.length,
          opened: variantAResults.filter(r => r.opened).length,
          clicked: variantAResults.filter(r => r.clicked).length,
          openRate: variantAResults.length > 0 ? (variantAResults.filter(r => r.opened).length / variantAResults.length * 100).toFixed(2) : "0.00",
          clickRate: variantAResults.length > 0 ? (variantAResults.filter(r => r.clicked).length / variantAResults.length * 100).toFixed(2) : "0.00",
        },
        variantB: {
          sent: variantBResults.length,
          opened: variantBResults.filter(r => r.opened).length,
          clicked: variantBResults.filter(r => r.clicked).length,
          openRate: variantBResults.length > 0 ? (variantBResults.filter(r => r.opened).length / variantBResults.length * 100).toFixed(2) : "0.00",
          clickRate: variantBResults.length > 0 ? (variantBResults.filter(r => r.clicked).length / variantBResults.length * 100).toFixed(2) : "0.00",
        },
      };

      return {
        test: test[0],
        stats,
        results,
      };
    }),

  /**
   * Start an A/B test (admin only)
   */
  startTest: protectedProcedure
    .input(z.object({
      testId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(abTests)
        .set({
          status: "running",
          startDate: new Date(),
        })
        .where(eq(abTests.id, input.testId));

      return { success: true };
    }),

  /**
   * Declare winner and complete test (admin only)
   */
  declareWinner: protectedProcedure
    .input(z.object({
      testId: z.number(),
      winner: z.enum(["A", "B"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(abTests)
        .set({
          status: "completed",
          endDate: new Date(),
          winnerVariant: input.winner,
        })
        .where(eq(abTests.id, input.testId));

      return { success: true };
    }),

  /**
   * Record A/B test result (used internally when sending emails)
   */
  recordResult: protectedProcedure
    .input(z.object({
      testId: z.number(),
      subscriberEmail: z.string().email(),
      variant: z.enum(["A", "B"]),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db.insert(abTestResults).values({
        testId: input.testId,
        subscriberEmail: input.subscriberEmail,
        variant: input.variant,
        opened: false,
        clicked: false,
      });

      return { success: true };
    }),

  /**
   * Track email open for A/B test
   */
  trackOpen: protectedProcedure
    .input(z.object({
      testId: z.number(),
      subscriberEmail: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(abTestResults)
        .set({
          opened: true,
          openedAt: new Date(),
        })
        .where(
          and(
            eq(abTestResults.testId, input.testId),
            eq(abTestResults.subscriberEmail, input.subscriberEmail)
          )
        );

      return { success: true };
    }),

  /**
   * Track link click for A/B test
   */
  trackClick: protectedProcedure
    .input(z.object({
      testId: z.number(),
      subscriberEmail: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      await db
        .update(abTestResults)
        .set({
          clicked: true,
          clickedAt: new Date(),
        })
        .where(
          and(
            eq(abTestResults.testId, input.testId),
            eq(abTestResults.subscriberEmail, input.subscriberEmail)
          )
        );

      return { success: true };
    }),
});
