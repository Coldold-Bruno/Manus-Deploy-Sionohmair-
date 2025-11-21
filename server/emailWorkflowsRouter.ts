import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { emailWorkflows, workflowSteps, workflowSubscriptions, emailTemplates, subscribers } from "../drizzle/schema";
import { eq, and, lt, sql } from "drizzle-orm";
import { TRPCError } from "@trpc/server";
import { sendEmail } from "./emailService";

export const emailWorkflowsRouter = router({
  /**
   * Create a new workflow
   */
  createWorkflow: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      trigger: z.enum(["manual", "new_subscriber", "interest_sprint", "interest_n3", "interest_ia", "inactive_30d"]),
      steps: z.array(z.object({
        delayHours: z.number().min(0),
        templateId: z.number(),
      })),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Create workflow
      const [workflow] = await db.insert(emailWorkflows).values({
        name: input.name,
        description: input.description,
        trigger: input.trigger,
        active: true,
      });

      const workflowId = workflow.insertId;

      // Create steps
      for (let i = 0; i < input.steps.length; i++) {
        await db.insert(workflowSteps).values({
          workflowId,
          stepOrder: i + 1,
          delayHours: input.steps[i].delayHours,
          templateId: input.steps[i].templateId,
        });
      }

      return { success: true, workflowId };
    }),

  /**
   * Get all workflows
   */
  getWorkflows: protectedProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const workflows = await db.select().from(emailWorkflows);
      
      // For each workflow, get its steps
      const workflowsWithSteps = await Promise.all(
        workflows.map(async (workflow) => {
          const steps = await db
            .select()
            .from(workflowSteps)
            .where(eq(workflowSteps.workflowId, workflow.id))
            .orderBy(workflowSteps.stepOrder);
          
          return { ...workflow, steps };
        })
      );

      return workflowsWithSteps;
    }),

  /**
   * Get a single workflow with details
   */
  getWorkflow: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const [workflow] = await db.select().from(emailWorkflows).where(eq(emailWorkflows.id, input.id));
      
      if (!workflow) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Workflow not found" });
      }

      const steps = await db
        .select()
        .from(workflowSteps)
        .where(eq(workflowSteps.workflowId, input.id))
        .orderBy(workflowSteps.stepOrder);

      return { ...workflow, steps };
    }),

  /**
   * Subscribe a lead to a workflow
   */
  subscribeToWorkflow: protectedProcedure
    .input(z.object({
      workflowId: z.number(),
      subscriberEmail: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Check if already subscribed
      const existing = await db
        .select()
        .from(workflowSubscriptions)
        .where(
          and(
            eq(workflowSubscriptions.workflowId, input.workflowId),
            eq(workflowSubscriptions.subscriberEmail, input.subscriberEmail),
            eq(workflowSubscriptions.status, "active")
          )
        );

      if (existing.length > 0) {
        throw new TRPCError({ code: "BAD_REQUEST", message: "Already subscribed to this workflow" });
      }

      await db.insert(workflowSubscriptions).values({
        workflowId: input.workflowId,
        subscriberEmail: input.subscriberEmail,
        currentStep: 0,
        status: "active",
      });

      return { success: true };
    }),

  /**
   * Unsubscribe from a workflow
   */
  unsubscribeFromWorkflow: protectedProcedure
    .input(z.object({
      workflowId: z.number(),
      subscriberEmail: z.string().email(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      await db
        .update(workflowSubscriptions)
        .set({ status: "cancelled" })
        .where(
          and(
            eq(workflowSubscriptions.workflowId, input.workflowId),
            eq(workflowSubscriptions.subscriberEmail, input.subscriberEmail),
            eq(workflowSubscriptions.status, "active")
          )
        );

      return { success: true };
    }),

  /**
   * Toggle workflow active status
   */
  toggleWorkflow: protectedProcedure
    .input(z.object({
      id: z.number(),
      active: z.boolean(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      await db
        .update(emailWorkflows)
        .set({ active: input.active })
        .where(eq(emailWorkflows.id, input.id));

      return { success: true };
    }),

  /**
   * Get workflow statistics
   */
  getWorkflowStats: protectedProcedure
    .input(z.object({
      workflowId: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const subscriptions = await db
        .select()
        .from(workflowSubscriptions)
        .where(eq(workflowSubscriptions.workflowId, input.workflowId));

      const active = subscriptions.filter(s => s.status === "active").length;
      const completed = subscriptions.filter(s => s.status === "completed").length;
      const cancelled = subscriptions.filter(s => s.status === "cancelled").length;

      return {
        total: subscriptions.length,
        active,
        completed,
        cancelled,
      };
    }),

  /**
   * Process workflows (called by cron job)
   * Sends due emails for all active workflow subscriptions
   */
  processWorkflows: protectedProcedure
    .mutation(async () => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      let emailsSent = 0;
      let errors = 0;

      // Get all active workflow subscriptions
      const activeSubscriptions = await db
        .select()
        .from(workflowSubscriptions)
        .where(eq(workflowSubscriptions.status, "active"));

      for (const subscription of activeSubscriptions) {
        try {
          // Get workflow and steps
          const [workflow] = await db
            .select()
            .from(emailWorkflows)
            .where(eq(emailWorkflows.id, subscription.workflowId));

          if (!workflow || !workflow.active) continue;

          const steps = await db
            .select()
            .from(workflowSteps)
            .where(eq(workflowSteps.workflowId, subscription.workflowId))
            .orderBy(workflowSteps.stepOrder);

          if (steps.length === 0) continue;

          // Determine next step to send
          const nextStepIndex = subscription.currentStep;
          if (nextStepIndex >= steps.length) {
            // Workflow completed
            await db
              .update(workflowSubscriptions)
              .set({ status: "completed", completedAt: new Date() })
              .where(eq(workflowSubscriptions.id, subscription.id));
            continue;
          }

          const nextStep = steps[nextStepIndex];

          // Check if enough time has passed since last email
          const now = new Date();
          if (subscription.lastEmailSentAt) {
            const hoursSinceLastEmail = (now.getTime() - subscription.lastEmailSentAt.getTime()) / (1000 * 60 * 60);
            if (hoursSinceLastEmail < nextStep.delayHours) {
              continue; // Not time yet
            }
          } else if (nextStep.delayHours > 0) {
            // First email with delay
            const hoursSinceStart = (now.getTime() - subscription.startedAt.getTime()) / (1000 * 60 * 60);
            if (hoursSinceStart < nextStep.delayHours) {
              continue;
            }
          }

          // Get template
          const [template] = await db
            .select()
            .from(emailTemplates)
            .where(eq(emailTemplates.id, nextStep.templateId));

          if (!template) continue;

          // Get subscriber info
          const [subscriber] = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.email, subscription.subscriberEmail));

          if (!subscriber) continue;

          // Send email
          await sendEmail({
            to: subscriber.email,
            subject: template.subject.replace('{{nom}}', subscriber.name || 'Cher(e) abonné(e)'),
            html: template.content
              .replace(/{{nom}}/g, subscriber.name || 'Cher(e) abonné(e)')
              .replace(/{{email}}/g, subscriber.email)
              .replace(/{{score}}/g, (subscriber.score || 0).toString())
              .replace(/{{interets}}/g, subscriber.interests?.join(', ') || 'Non spécifié'),
          });

          // Update subscription
          await db
            .update(workflowSubscriptions)
            .set({
              currentStep: nextStepIndex + 1,
              lastEmailSentAt: now,
            })
            .where(eq(workflowSubscriptions.id, subscription.id));

          emailsSent++;
        } catch (error) {
          console.error(`Error processing workflow subscription ${subscription.id}:`, error);
          errors++;
        }
      }

      return { emailsSent, errors };
    }),
});
