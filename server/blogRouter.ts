import { z } from 'zod';
import { protectedProcedure, publicProcedure, router } from './_core/trpc';
import { getDb } from './db';
import { blogPosts } from '../drizzle/schema';
import { eq, desc, and } from 'drizzle-orm';

export const blogRouter = router({
  /**
   * Récupérer tous les articles publiés
   */
  getPublishedPosts: publicProcedure
    .input(
      z
        .object({
          category: z.string().optional(),
          limit: z.number().min(1).max(100).default(10),
        })
        .optional()
    )
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const conditions = [eq(blogPosts.published, 'published')];
      
      if (input?.category) {
        conditions.push(eq(blogPosts.category, input.category));
      }

      const posts = await db
        .select()
        .from(blogPosts)
        .where(and(...conditions))
        .orderBy(desc(blogPosts.publishedAt))
        .limit(input?.limit || 10);

      return posts;
    }),

  /**
   * Récupérer un article par son slug
   */
  getPostBySlug: publicProcedure
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      const [post] = await db
        .select()
        .from(blogPosts)
        .where(
          and(
            eq(blogPosts.slug, input.slug),
            eq(blogPosts.published, 'published')
          )
        )
        .limit(1);

      if (!post) {
        throw new Error('Article not found');
      }

      return post;
    }),

  /**
   * Créer un nouvel article (admin uniquement)
   */
  createPost: protectedProcedure
    .input(
      z.object({
        slug: z.string(),
        title: z.string(),
        excerpt: z.string(),
        content: z.string(),
        coverImage: z.string().optional(),
        category: z.enum(['case-study', 'methodology', 'insights']),
        published: z.enum(['draft', 'published']).default('draft'),
        // Case study metadata
        clientName: z.string().optional(),
        clientIndustry: z.string().optional(),
        scoreBefore: z.number().optional(),
        scoreAfter: z.number().optional(),
        roi: z.string().optional(),
        testimonial: z.string().optional(),
        videoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const [newPost] = await db.insert(blogPosts).values({
        ...input,
        authorId: ctx.user.id,
        publishedAt: input.published === 'published' ? new Date() : null,
      });

      return newPost;
    }),

  /**
   * Mettre à jour un article (admin uniquement)
   */
  updatePost: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        slug: z.string().optional(),
        title: z.string().optional(),
        excerpt: z.string().optional(),
        content: z.string().optional(),
        coverImage: z.string().optional(),
        category: z.enum(['case-study', 'methodology', 'insights']).optional(),
        published: z.enum(['draft', 'published']).optional(),
        clientName: z.string().optional(),
        clientIndustry: z.string().optional(),
        scoreBefore: z.number().optional(),
        scoreAfter: z.number().optional(),
        roi: z.string().optional(),
        testimonial: z.string().optional(),
        videoUrl: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      const { id, ...updateData } = input;

      // Si on publie l'article, ajouter la date de publication
      if (updateData.published === 'published') {
        (updateData as any).publishedAt = new Date();
      }

      await db
        .update(blogPosts)
        .set({
          ...updateData,
          updatedAt: new Date(),
        })
        .where(eq(blogPosts.id, id));

      return { success: true };
    }),

  /**
   * Supprimer un article (admin uniquement)
   */
  deletePost: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier que l'utilisateur est admin
      if (ctx.user.role !== 'admin') {
        throw new Error('Unauthorized: Admin access required');
      }

      await db.delete(blogPosts).where(eq(blogPosts.id, input.id));

      return { success: true };
    }),
});
