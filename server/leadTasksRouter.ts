import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { leadTasks } from "../drizzle/schema";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { eq, and, desc, lte, gte } from "drizzle-orm";

export const leadTasksRouter = router({
  /**
   * Add a task for a lead (admin only)
   */
  addTask: protectedProcedure
    .input(z.object({
      leadEmail: z.string().email(),
      taskType: z.enum(["call", "email", "meeting", "follow_up", "other"]),
      title: z.string().min(1),
      description: z.string().optional(),
      dueDate: z.string(), // ISO date string
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [task] = await db.insert(leadTasks).values({
        leadEmail: input.leadEmail,
        userId: ctx.user.id,
        taskType: input.taskType,
        title: input.title,
        description: input.description,
        dueDate: new Date(input.dueDate),
      });

      return {
        success: true,
        taskId: task.insertId,
      };
    }),

  /**
   * Get all tasks for a lead (admin only)
   */
  getTasksForLead: protectedProcedure
    .input(z.object({
      leadEmail: z.string().email(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const tasks = await db
        .select()
        .from(leadTasks)
        .where(eq(leadTasks.leadEmail, input.leadEmail))
        .orderBy(leadTasks.dueDate);

      return tasks;
    }),

  /**
   * Get all pending tasks (admin only)
   */
  getAllPendingTasks: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const tasks = await db
        .select()
        .from(leadTasks)
        .where(eq(leadTasks.status, "pending"))
        .orderBy(leadTasks.dueDate);

      return tasks;
    }),

  /**
   * Get tasks due today (admin only)
   */
  getTasksDueToday: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      const tasks = await db
        .select()
        .from(leadTasks)
        .where(
          and(
            eq(leadTasks.status, "pending"),
            gte(leadTasks.dueDate, today),
            lte(leadTasks.dueDate, tomorrow)
          )
        )
        .orderBy(leadTasks.dueDate);

      return tasks;
    }),

  /**
   * Update a task (admin only, own tasks only)
   */
  updateTask: protectedProcedure
    .input(z.object({
      taskId: z.number(),
      title: z.string().min(1).optional(),
      description: z.string().optional(),
      dueDate: z.string().optional(), // ISO date string
      taskType: z.enum(["call", "email", "meeting", "follow_up", "other"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if task exists and belongs to user
      const existingTask = await db
        .select()
        .from(leadTasks)
        .where(eq(leadTasks.id, input.taskId))
        .limit(1);

      if (existingTask.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      if (existingTask[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only edit your own tasks" });
      }

      // Update task
      const updateData: any = {};
      if (input.title) updateData.title = input.title;
      if (input.description !== undefined) updateData.description = input.description;
      if (input.dueDate) updateData.dueDate = new Date(input.dueDate);
      if (input.taskType) updateData.taskType = input.taskType;

      await db
        .update(leadTasks)
        .set(updateData)
        .where(eq(leadTasks.id, input.taskId));

      return { success: true };
    }),

  /**
   * Complete a task (admin only, own tasks only)
   */
  completeTask: protectedProcedure
    .input(z.object({
      taskId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if task exists and belongs to user
      const existingTask = await db
        .select()
        .from(leadTasks)
        .where(eq(leadTasks.id, input.taskId))
        .limit(1);

      if (existingTask.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      if (existingTask[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only complete your own tasks" });
      }

      // Complete task
      await db
        .update(leadTasks)
        .set({
          status: "completed",
          completedAt: new Date(),
        })
        .where(eq(leadTasks.id, input.taskId));

      return { success: true };
    }),

  /**
   * Delete a task (admin only, own tasks only)
   */
  deleteTask: protectedProcedure
    .input(z.object({
      taskId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if task exists and belongs to user
      const existingTask = await db
        .select()
        .from(leadTasks)
        .where(eq(leadTasks.id, input.taskId))
        .limit(1);

      if (existingTask.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Task not found" });
      }

      if (existingTask[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete your own tasks" });
      }

      // Delete task
      await db
        .delete(leadTasks)
        .where(eq(leadTasks.id, input.taskId));

      return { success: true };
    }),
});
