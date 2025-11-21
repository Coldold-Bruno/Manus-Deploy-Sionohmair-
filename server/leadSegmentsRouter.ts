import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { subscribers } from "../drizzle/schema";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { eq, and, sql, or, like } from "drizzle-orm";
import { sendEmail } from "./emailService";

/**
 * Lead Segments Router
 * 
 * Predefined segments for targeted campaigns:
 * - hot_leads: Score >= 80
 * - warm_leads: Score 41-79
 * - sprint_interested: Interests contain "sprint"
 * - high_value: Score >= 60 and interests contain "niveau-3" or "sprint"
 * - recent_subscribers: Subscribed in last 30 days
 * - inactive: No activities in last 60 days
 */

export const leadSegmentsRouter = router({
  /**
   * Get leads by segment (admin only)
   */
  getSegment: protectedProcedure
    .input(z.object({
      segment: z.enum([
        "hot_leads",
        "warm_leads",
        "sprint_interested",
        "high_value",
        "recent_subscribers",
        "inactive",
        "all"
      ]),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      let conditions: any[] = [eq(subscribers.status, "active")];

      switch (input.segment) {
        case "hot_leads":
          conditions.push(eq(subscribers.leadTemperature, "hot"));
          break;
        
        case "warm_leads":
          conditions.push(eq(subscribers.leadTemperature, "warm"));
          break;
        
        case "sprint_interested":
          conditions.push(like(subscribers.interests, "%sprint%"));
          break;
        
        case "high_value":
          conditions.push(
            and(
              sql`${subscribers.leadScore} >= 60`,
              or(
                like(subscribers.interests, "%niveau-3%"),
                like(subscribers.interests, "%sprint%")
              )
            )
          );
          break;
        
        case "recent_subscribers":
          const thirtyDaysAgo = new Date();
          thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
          conditions.push(sql`${subscribers.subscribedAt} >= ${thirtyDaysAgo}`);
          break;
        
        case "inactive":
          // For now, just get cold leads (score 0-40)
          conditions.push(eq(subscribers.leadTemperature, "cold"));
          break;
        
        case "all":
          // No additional conditions
          break;
      }

      const leads = await db
        .select()
        .from(subscribers)
        .where(and(...conditions));

      return leads;
    }),

  /**
   * Send campaign email to segment (admin only)
   */
  sendCampaign: protectedProcedure
    .input(z.object({
      segment: z.enum([
        "hot_leads",
        "warm_leads",
        "sprint_interested",
        "high_value",
        "recent_subscribers",
        "inactive",
        "all"
      ]),
      subject: z.string().min(1),
      content: z.string().min(1),
      previewMode: z.boolean().optional(), // If true, only send to admin
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Get segment leads
      const leads = await leadSegmentsRouter.createCaller(ctx).getSegment({ segment: input.segment });

      if (leads.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Aucun lead trouvé dans ce segment" });
      }

      // In preview mode, only send to admin
      const recipients = input.previewMode 
        ? [{ email: ctx.user.email || process.env.OWNER_EMAIL || "admin@example.com", name: ctx.user.name || "Admin" }]
        : leads.map(lead => ({ email: lead.email, name: lead.name || lead.email }));

      let sent = 0;
      let failed = 0;

      for (const recipient of recipients) {
        try {
          await sendEmail({
            to: recipient.email,
            subject: input.subject,
            html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                </head>
                <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
                    <h1 style="color: white; margin: 0; font-size: 28px;">Sionohmair Insight Academy</h1>
                    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">L'Ingénierie du Génie</p>
                  </div>
                  
                  <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
                    ${input.previewMode ? `<div style="background: #fff3cd; border: 1px solid #ffc107; padding: 10px; margin-bottom: 20px; border-radius: 5px;"><strong>⚠️ MODE PRÉVISUALISATION</strong><br>Segment: ${input.segment} (${leads.length} leads)</div>` : ''}
                    
                    <div style="background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                      ${input.content}
                    </div>
                    
                    <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; text-align: center; color: #666; font-size: 12px;">
                      <p>Sionohmair Insight Academy - Transformez la communication d'un art subjectif en une science de la performance</p>
                      <p>
                        <a href="https://sionohmair-insight.academy" style="color: #667eea; text-decoration: none;">Site Web</a> | 
                        <a href="mailto:insight.mind@sionohmair.academy" style="color: #667eea; text-decoration: none;">Contact</a>
                      </p>
                    </div>
                  </div>
                </body>
              </html>
            `,
          });
          sent++;
        } catch (error) {
          console.error(`Failed to send to ${recipient.email}:`, error);
          failed++;
        }
      }

      return {
        success: true,
        sent,
        failed,
        total: recipients.length,
        previewMode: input.previewMode,
      };
    }),

  /**
   * Get segment statistics (admin only)
   */
  getSegmentStats: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const segments = [
        "hot_leads",
        "warm_leads",
        "sprint_interested",
        "high_value",
        "recent_subscribers",
        "inactive",
      ] as const;

      const stats: Record<string, number> = {};

      for (const segment of segments) {
        const leads = await leadSegmentsRouter.createCaller(ctx).getSegment({ segment });
        stats[segment] = leads.length;
      }

      return stats;
    }),
});
