import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { leadNotes } from "../drizzle/schema";
import { getDb } from "./db";
import { protectedProcedure, router } from "./_core/trpc";
import { eq, and, desc } from "drizzle-orm";

export const leadNotesRouter = router({
  /**
   * Add a note to a lead (admin only)
   */
  addNote: protectedProcedure
    .input(z.object({
      leadEmail: z.string().email(),
      noteType: z.enum(["call", "email", "meeting", "objection", "other"]),
      content: z.string().min(1),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const [note] = await db.insert(leadNotes).values({
        leadEmail: input.leadEmail,
        userId: ctx.user.id,
        noteType: input.noteType,
        content: input.content,
      });

      return {
        success: true,
        noteId: note.insertId,
      };
    }),

  /**
   * Get all notes for a lead (admin only)
   */
  getNotes: protectedProcedure
    .input(z.object({
      leadEmail: z.string().email(),
    }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      const notes = await db
        .select()
        .from(leadNotes)
        .where(eq(leadNotes.leadEmail, input.leadEmail))
        .orderBy(desc(leadNotes.createdAt));

      return notes;
    }),

  /**
   * Update a note (admin only, own notes only)
   */
  updateNote: protectedProcedure
    .input(z.object({
      noteId: z.number(),
      content: z.string().min(1),
      noteType: z.enum(["call", "email", "meeting", "objection", "other"]).optional(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if note exists and belongs to user
      const existingNote = await db
        .select()
        .from(leadNotes)
        .where(eq(leadNotes.id, input.noteId))
        .limit(1);

      if (existingNote.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }

      if (existingNote[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only edit your own notes" });
      }

      // Update note
      const updateData: any = { content: input.content };
      if (input.noteType) {
        updateData.noteType = input.noteType;
      }

      await db
        .update(leadNotes)
        .set(updateData)
        .where(eq(leadNotes.id, input.noteId));

      return { success: true };
    }),

  /**
   * Delete a note (admin only, own notes only)
   */
  deleteNote: protectedProcedure
    .input(z.object({
      noteId: z.number(),
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN", message: "Admin access required" });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR", message: "Database not available" });

      // Check if note exists and belongs to user
      const existingNote = await db
        .select()
        .from(leadNotes)
        .where(eq(leadNotes.id, input.noteId))
        .limit(1);

      if (existingNote.length === 0) {
        throw new TRPCError({ code: "NOT_FOUND", message: "Note not found" });
      }

      if (existingNote[0].userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN", message: "You can only delete your own notes" });
      }

      // Delete note
      await db
        .delete(leadNotes)
        .where(eq(leadNotes.id, input.noteId));

      return { success: true };
    }),
});
