import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { leadActivities, subscribers } from "../drizzle/schema";
import { getDb } from "./db";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { eq, desc, and, sql } from "drizzle-orm";

/**
 * Lead Scoring System
 * 
 * SCORING RULES:
 * - Page view (general): +1 point
 * - Page view (high-value: /sprint, /services, /niveau-*): +3 points
 * - Calculator use: +10 points
 * - Download (Manuel PFPMA): +5 points
 * - Form submit (Contact): +8 points
 * - Email open: +5 points (already tracked in newsletter)
 * - Email click: +15 points (already tracked in newsletter)
 * - Payment intent created: +50 points
 * - Payment completed: +100 points (conversion)
 * 
 * LEAD TEMPERATURE:
 * - Cold: 0-40 points
 * - Warm: 41-79 points
 * - Hot: 80+ points
 */

const SCORING_RULES = {
  page_view: 1,
  page_view_high_value: 3, // /sprint, /services, /niveau-*
  calculator_use: 10,
  download: 5,
  form_submit: 8,
  email_open: 5,
  email_click: 15,
  payment_intent: 50,
  payment_completed: 100,
};

const HIGH_VALUE_PAGES = ['/sprint', '/services', '/niveau-1', '/niveau-2', '/niveau-3'];

/**
 * Calculate lead temperature based on score
 */
function getLeadTemperature(score: number): "cold" | "warm" | "hot" {
  if (score >= 80) return "hot";
  if (score >= 41) return "warm";
  return "cold";
}

/**
 * Update subscriber's lead score and temperature
 */
async function updateLeadScore(email: string) {
  const db = await getDb();
  if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

  // Calculate total score from activities
  const result = await db
    .select({ totalScore: sql<number>`COALESCE(SUM(${leadActivities.score}), 0)` })
    .from(leadActivities)
    .where(eq(leadActivities.email, email));

  const activityScore = result[0]?.totalScore || 0;

  // Get engagement score from subscriber
  const subscriber = await db
    .select()
    .from(subscribers)
    .where(eq(subscribers.email, email))
    .limit(1);

  const engagementScore = subscriber[0]?.engagementScore || 0;

  // Total lead score = activity score + engagement score
  const totalScore = activityScore + engagementScore;
  const temperature = getLeadTemperature(totalScore);

  // Update subscriber
  if (subscriber.length > 0) {
    await db
      .update(subscribers)
      .set({
        leadScore: totalScore,
        leadTemperature: temperature,
      })
      .where(eq(subscribers.email, email));
  }

  return { totalScore, temperature };
}

export const leadScoringRouter = router({
  /**
   * Track a user activity (public - can be called from anywhere)
   */
  trackActivity: publicProcedure
    .input(z.object({
      email: z.string().email(),
      activityType: z.enum([
        "page_view",
        "calculator_use",
        "download",
        "form_submit",
        "email_open",
        "email_click",
        "payment_intent",
        "payment_completed",
      ]),
      activityData: z.record(z.any()).optional(),
      userId: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Determine score based on activity type
      let score = 0;
      if (input.activityType === "page_view") {
        const page = input.activityData?.page || "";
        const isHighValue = HIGH_VALUE_PAGES.some(hvp => page.startsWith(hvp));
        score = isHighValue ? SCORING_RULES.page_view_high_value : SCORING_RULES.page_view;
      } else {
        score = SCORING_RULES[input.activityType] || 0;
      }

      // Insert activity
      await db.insert(leadActivities).values({
        userId: input.userId,
        email: input.email,
        activityType: input.activityType,
        activityData: input.activityData ? JSON.stringify(input.activityData) : null,
        score,
      });

      // Get previous temperature before update
      const previousSubscriber = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, input.email))
        .limit(1);
      
      const previousTemperature = previousSubscriber[0]?.leadTemperature || "cold";
      const lastNotificationSent = previousSubscriber[0]?.lastHotNotificationSent;

      // Update lead score
      const { totalScore, temperature } = await updateLeadScore(input.email);

      // Check if lead just became hot and notification not sent recently
      const becameHot = previousTemperature !== "hot" && temperature === "hot";
      const shouldNotify = becameHot || (
        temperature === "hot" && 
        (!lastNotificationSent || 
          (new Date().getTime() - new Date(lastNotificationSent).getTime()) > 7 * 24 * 60 * 60 * 1000) // 7 days
      );

      if (shouldNotify) {
        // Send hot lead notification to admin (async, don't wait)
        import("./emailService").then(async ({ sendHotLeadNotification }) => {
          try {
            await sendHotLeadNotification(input.email);
            // Update lastHotNotificationSent
            await db
              .update(subscribers)
              .set({ lastHotNotificationSent: new Date() })
              .where(eq(subscribers.email, input.email));
          } catch (error) {
            console.error("Failed to send hot lead notification:", error);
          }
        });
      }

      return {
        success: true,
        score,
        totalScore,
        temperature,
        notificationSent: shouldNotify,
      };
    }),

  /**
   * Get lead profile (admin only)
   */
  getLeadProfile: protectedProcedure
    .input(z.object({
      email: z.string().email(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get subscriber info
      const subscriber = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, input.email))
        .limit(1);

      if (subscriber.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Lead not found" });
      }

      // Get all activities
      const activities = await db
        .select()
        .from(leadActivities)
        .where(eq(leadActivities.email, input.email))
        .orderBy(desc(leadActivities.createdAt));

      return {
        subscriber: subscriber[0],
        activities: activities.map(a => ({
          ...a,
          activityData: a.activityData ? JSON.parse(a.activityData) : null,
        })),
      };
    }),

  /**
   * Get hot leads (admin only)
   */
  getHotLeads: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get all hot leads (score >= 80)
      const hotLeads = await db
        .select()
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "hot"),
            eq(subscribers.status, "active")
          )
        )
        .orderBy(desc(subscribers.leadScore));

      return hotLeads;
    }),

  /**
   * Get warm leads (admin only)
   */
  getWarmLeads: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get all warm leads (score 41-79)
      const warmLeads = await db
        .select()
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "warm"),
            eq(subscribers.status, "active")
          )
        )
        .orderBy(desc(subscribers.leadScore));

      return warmLeads;
    }),

  /**
   * Get lead scoring stats (admin only)
   */
  getLeadStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Count leads by temperature
      const hotCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "hot"),
            eq(subscribers.status, "active")
          )
        );

      const warmCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "warm"),
            eq(subscribers.status, "active")
          )
        );

      const coldCount = await db
        .select({ count: sql<number>`COUNT(*)` })
        .from(subscribers)
        .where(
          and(
            eq(subscribers.leadTemperature, "cold"),
            eq(subscribers.status, "active")
          )
        );

      // Get average scores
      const avgScores = await db
        .select({
          avgLeadScore: sql<number>`AVG(${subscribers.leadScore})`,
          avgEngagementScore: sql<number>`AVG(${subscribers.engagementScore})`,
        })
        .from(subscribers)
        .where(eq(subscribers.status, "active"));

      // Get most common activities
      const topActivities = await db
        .select({
          activityType: leadActivities.activityType,
          count: sql<number>`COUNT(*)`,
          totalScore: sql<number>`SUM(${leadActivities.score})`,
        })
        .from(leadActivities)
        .groupBy(leadActivities.activityType)
        .orderBy(desc(sql<number>`COUNT(*)`))
        .limit(10);

      return {
        leadsByTemperature: {
          hot: hotCount[0]?.count || 0,
          warm: warmCount[0]?.count || 0,
          cold: coldCount[0]?.count || 0,
        },
        averageScores: {
          leadScore: Math.round(avgScores[0]?.avgLeadScore || 0),
          engagementScore: Math.round(avgScores[0]?.avgEngagementScore || 0),
        },
        topActivities,
      };
    }),

  /**
   * Recalculate all lead scores (admin only - for maintenance)
   */
  recalculateAllScores: protectedProcedure
    .mutation(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get all active subscribers
      const allSubscribers = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.status, "active"));

      let updated = 0;
      for (const subscriber of allSubscribers) {
        await updateLeadScore(subscriber.email);
        updated++;
      }

      return {
        success: true,
        updated,
      };
    }),
});
