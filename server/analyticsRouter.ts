import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { subscribers, leadActivities, emailWorkflows, workflowSubscriptions, abTests, abTestResults, leadNotes, leadTasks } from "../drizzle/schema";
import { eq, sql, and, gte, desc } from "drizzle-orm";

export const analyticsRouter = router({
  /**
   * Get overview statistics
   */
  getOverviewStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Total leads
      const [totalLeadsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(subscribers)
        .where(eq(subscribers.status, "active"));
      
      const totalLeads = Number(totalLeadsResult?.count || 0);

      // Leads by temperature
      const [hotLeadsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(subscribers)
        .where(and(
          eq(subscribers.status, "active"),
          eq(subscribers.leadTemperature, "hot")
        ));
      
      const hotLeads = Number(hotLeadsResult?.count || 0);

      const [warmLeadsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(subscribers)
        .where(and(
          eq(subscribers.status, "active"),
          eq(subscribers.leadTemperature, "warm")
        ));
      
      const warmLeads = Number(warmLeadsResult?.count || 0);

      // Conversion rate (hot leads / total leads)
      const conversionRate = totalLeads > 0 ? (hotLeads / totalLeads) * 100 : 0;

      // Average score
      const [avgScoreResult] = await db
        .select({ avg: sql<number>`avg(${subscribers.leadScore})` })
        .from(subscribers)
        .where(eq(subscribers.status, "active"));
      
      const avgScore = Number(avgScoreResult?.avg || 0);

      // Total activities last 30 days
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const [activitiesResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(leadActivities)
        .where(gte(leadActivities.createdAt, thirtyDaysAgo));
      
      const totalActivities = Number(activitiesResult?.count || 0);

      // Active workflows
      const [activeWorkflowsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(emailWorkflows)
        .where(eq(emailWorkflows.active, true));
      
      const activeWorkflows = Number(activeWorkflowsResult?.count || 0);

      // Active workflow subscriptions
      const [activeSubscriptionsResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(workflowSubscriptions)
        .where(eq(workflowSubscriptions.status, "active"));
      
      const activeSubscriptions = Number(activeSubscriptionsResult?.count || 0);

      // Pending tasks
      const [pendingTasksResult] = await db
        .select({ count: sql<number>`count(*)` })
        .from(leadTasks)
        .where(eq(leadTasks.status, "pending"));
      
      const pendingTasks = Number(pendingTasksResult?.count || 0);

      return {
        totalLeads,
        hotLeads,
        warmLeads,
        coldLeads: totalLeads - hotLeads - warmLeads,
        conversionRate: Math.round(conversionRate * 10) / 10,
        avgScore: Math.round(avgScore * 10) / 10,
        totalActivities,
        activeWorkflows,
        activeSubscriptions,
        pendingTasks,
      };
    }),

  /**
   * Get workflow statistics
   */
  getWorkflowStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const workflows = await db
        .select()
        .from(emailWorkflows)
        .orderBy(desc(emailWorkflows.createdAt));

      const stats = await Promise.all(
        workflows.map(async (workflow) => {
          const [totalSubs] = await db
            .select({ count: sql<number>`count(*)` })
            .from(workflowSubscriptions)
            .where(eq(workflowSubscriptions.workflowId, workflow.id));

          const [activeSubs] = await db
            .select({ count: sql<number>`count(*)` })
            .from(workflowSubscriptions)
            .where(and(
              eq(workflowSubscriptions.workflowId, workflow.id),
              eq(workflowSubscriptions.status, "active")
            ));

          const [completedSubs] = await db
            .select({ count: sql<number>`count(*)` })
            .from(workflowSubscriptions)
            .where(and(
              eq(workflowSubscriptions.workflowId, workflow.id),
              eq(workflowSubscriptions.status, "completed")
            ));

          return {
            id: workflow.id,
            name: workflow.name,
            trigger: workflow.trigger,
            active: workflow.active,
            totalSubscriptions: Number(totalSubs?.count || 0),
            activeSubscriptions: Number(activeSubs?.count || 0),
            completedSubscriptions: Number(completedSubs?.count || 0),
            completionRate: totalSubs?.count ? (Number(completedSubs?.count || 0) / Number(totalSubs.count)) * 100 : 0,
          };
        })
      );

      return stats;
    }),

  /**
   * Get A/B test statistics
   */
  getABTestStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const tests = await db
        .select()
        .from(abTests)
        .orderBy(desc(abTests.createdAt));

      const stats = await Promise.all(
        tests.map(async (test) => {
          const results = await db
            .select()
            .from(abTestResults)
            .where(eq(abTestResults.testId, test.id));

          const variantAResults = results.filter(r => r.variant === "A");
          const variantBResults = results.filter(r => r.variant === "B");

          const variantASent = variantAResults.length;
          const variantBSent = variantBResults.length;

          const variantAOpens = variantAResults.filter(r => r.opened).length;
          const variantBOpens = variantBResults.filter(r => r.opened).length;

          const variantAClicks = variantAResults.filter(r => r.clicked).length;
          const variantBClicks = variantBResults.filter(r => r.clicked).length;

          return {
            id: test.id,
            name: test.name,
            status: test.status,
            variantA: test.variantA,
            variantB: test.variantB,
            winnerVariant: test.winnerVariant,
            variantAStats: {
              sent: variantASent,
              opens: variantAOpens,
              clicks: variantAClicks,
              openRate: variantASent > 0 ? (variantAOpens / variantASent) * 100 : 0,
              clickRate: variantASent > 0 ? (variantAClicks / variantASent) * 100 : 0,
            },
            variantBStats: {
              sent: variantBSent,
              opens: variantBOpens,
              clicks: variantBClicks,
              openRate: variantBSent > 0 ? (variantBOpens / variantBSent) * 100 : 0,
              clickRate: variantBSent > 0 ? (variantBClicks / variantBSent) * 100 : 0,
            },
          };
        })
      );

      return stats;
    }),

  /**
   * Get leads by segment
   */
  getLeadsBySegment: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const allLeads = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.status, "active"));

      // Segment by temperature
      const byTemperature = {
        hot: allLeads.filter(l => l.leadTemperature === "hot").length,
        warm: allLeads.filter(l => l.leadTemperature === "warm").length,
        cold: allLeads.filter(l => l.leadTemperature === "cold").length,
      };

      // Segment by interests
      const byInterest = {
        sprint: allLeads.filter(l => l.interests?.includes("sprint")).length,
        n3: allLeads.filter(l => l.interests?.includes("n3")).length,
        ia: allLeads.filter(l => l.interests?.includes("ia")).length,
        none: allLeads.filter(l => !l.interests || l.interests.length === 0).length,
      };

      return {
        total: allLeads.length,
        byTemperature,
        byInterest,
      };
    }),

  /**
   * Get newsletter engagement over time
   */
  getNewsletterEngagement: protectedProcedure
    .input(z.object({
      days: z.number().default(30),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const startDate = new Date();
      startDate.setDate(startDate.getDate() - input.days);

      const activities = await db
        .select()
        .from(leadActivities)
        .where(and(
          gte(leadActivities.createdAt, startDate),
          sql`${leadActivities.activityType} IN ('email_open', 'email_click')`
        ))
        .orderBy(leadActivities.createdAt);

      // Group by date
      const byDate: Record<string, { opens: number; clicks: number }> = {};

      activities.forEach(activity => {
        const date = activity.createdAt.toISOString().split('T')[0];
        if (!byDate[date]) {
          byDate[date] = { opens: 0, clicks: 0 };
        }
        if (activity.activityType === "email_open") {
          byDate[date].opens++;
        } else if (activity.activityType === "email_click") {
          byDate[date].clicks++;
        }
      });

      return Object.entries(byDate).map(([date, stats]) => ({
        date,
        opens: stats.opens,
        clicks: stats.clicks,
      })).sort((a, b) => a.date.localeCompare(b.date));
    }),
});
