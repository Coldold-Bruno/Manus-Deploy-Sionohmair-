import { z } from "zod";
import { router, protectedProcedure } from "./_core/trpc";
import { getDb } from "./db";
import { emailTemplates } from "../drizzle/schema";
import { eq } from "drizzle-orm";
import { TRPCError } from "@trpc/server";

export const emailTemplatesRouter = router({
  /**
   * Create a new email template
   */
  createTemplate: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      category: z.enum(["welcome", "resource", "promotion", "reactivation", "newsletter"]),
      subject: z.string().min(1).max(500),
      content: z.string().min(1),
      variables: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const [template] = await db.insert(emailTemplates).values({
        name: input.name,
        category: input.category,
        subject: input.subject,
        content: input.content,
        variables: input.variables || [],
      });

      return { success: true, templateId: template.insertId };
    }),

  /**
   * Get all email templates
   */
  getTemplates: protectedProcedure
    .input(z.object({
      category: z.enum(["welcome", "resource", "promotion", "reactivation", "newsletter"]).optional(),
    }).optional())
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      if (input?.category) {
        return await db.select().from(emailTemplates).where(eq(emailTemplates.category, input.category));
      }
      return await db.select().from(emailTemplates);
    }),

  /**
   * Get a single template by ID
   */
  getTemplate: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, input.id));
      
      if (!template) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Template not found",
        });
      }

      return template;
    }),

  /**
   * Update an existing template
   */
  updateTemplate: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      category: z.enum(["welcome", "resource", "promotion", "reactivation", "newsletter"]).optional(),
      subject: z.string().min(1).max(500).optional(),
      content: z.string().min(1).optional(),
      variables: z.array(z.string()).optional(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const { id, ...updates } = input;

      await db.update(emailTemplates)
        .set(updates)
        .where(eq(emailTemplates.id, id));

      return { success: true };
    }),

  /**
   * Delete a template
   */
  deleteTemplate: protectedProcedure
    .input(z.object({
      id: z.number(),
    }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      await db.delete(emailTemplates).where(eq(emailTemplates.id, input.id));
      return { success: true };
    }),

  /**
   * Replace variables in template content
   * {{nom}} → John Doe
   * {{email}} → john@example.com
   * {{score}} → 85
   * {{interets}} → Sprint de Clarté, Niveau 3
   */
  previewTemplate: protectedProcedure
    .input(z.object({
      subject: z.string(),
      content: z.string(),
      variables: z.record(z.string(), z.string()).optional(),
    }))
    .query(({ input }) => {
      let previewSubject = input.subject;
      let previewContent = input.content;

      if (input.variables) {
        Object.entries(input.variables).forEach(([key, value]) => {
          const regex = new RegExp(`{{${key}}}`, 'g');
          const stringValue = String(value);
          previewSubject = previewSubject.replace(regex, stringValue);
          previewContent = previewContent.replace(regex, stringValue);
        });
      }

      return {
        subject: previewSubject,
        content: previewContent,
      };
    }),
});
