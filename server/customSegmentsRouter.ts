/**
 * Router tRPC pour les segments personnalisés avancés
 */

import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { getDb } from './db';
import { customSegments, subscribers } from '../drizzle/schema';
import { eq, and, or, sql, gte, lte, like, desc } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

// Schéma de validation pour les critères
const criterionSchema = z.object({
  field: z.enum(['leadScore', 'leadTemperature', 'interests', 'engagementScore', 'subscribedAt', 'status']),
  operator: z.enum(['equals', 'notEquals', 'greaterThan', 'lessThan', 'contains', 'notContains', 'between']),
  value: z.union([z.string(), z.number(), z.array(z.union([z.string(), z.number()]))]),
});

export const customSegmentsRouter = router({
  /**
   * Créer un segment personnalisé
   */
  createSegment: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(255),
      description: z.string().optional(),
      criteria: z.array(criterionSchema),
      logic: z.enum(['AND', 'OR']).default('AND')
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Insérer le segment
      const result = await db.insert(customSegments).values({
        name: input.name,
        description: input.description,
        criteria: JSON.stringify(input.criteria),
        logic: input.logic,
        createdBy: ctx.user.id,
        leadCount: 0,
        lastCountUpdate: new Date()
      });

      // Calculer le nombre de leads
      const segmentId = Number(result[0].insertId);
      const count = await calculateSegmentCount(segmentId, input.criteria, input.logic);

      // Mettre à jour le comptage
      await db
        .update(customSegments)
        .set({ leadCount: count, lastCountUpdate: new Date() })
        .where(eq(customSegments.id, segmentId));

      return {
        id: segmentId,
        name: input.name,
        leadCount: count
      };
    }),

  /**
   * Récupérer tous les segments
   */
  getAllSegments: protectedProcedure
    .query(async ({ ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const segments = await db
        .select()
        .from(customSegments)
        .orderBy(desc(customSegments.createdAt));

      return segments.map(s => ({
        ...s,
        criteria: JSON.parse(s.criteria)
      }));
    }),

  /**
   * Récupérer un segment par ID
   */
  getSegmentById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const segment = await db
        .select()
        .from(customSegments)
        .where(eq(customSegments.id, input.id))
        .limit(1);

      if (!segment.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
      }

      return {
        ...segment[0],
        criteria: JSON.parse(segment[0].criteria)
      };
    }),

  /**
   * Récupérer les leads d'un segment
   */
  getSegmentLeads: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Récupérer le segment
      const segment = await db
        .select()
        .from(customSegments)
        .where(eq(customSegments.id, input.id))
        .limit(1);

      if (!segment.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
      }

      const criteria = JSON.parse(segment[0].criteria);
      const logic = segment[0].logic;

      // Construire la requête
      const conditions = buildConditions(criteria, logic);
      
      const leads = await db
        .select()
        .from(subscribers)
        .where(conditions);

      return leads;
    }),

  /**
   * Mettre à jour un segment
   */
  updateSegment: protectedProcedure
    .input(z.object({
      id: z.number(),
      name: z.string().min(1).max(255).optional(),
      description: z.string().optional(),
      criteria: z.array(criterionSchema).optional(),
      logic: z.enum(['AND', 'OR']).optional()
    }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      const updates: any = {};
      if (input.name) updates.name = input.name;
      if (input.description !== undefined) updates.description = input.description;
      if (input.criteria) {
        updates.criteria = JSON.stringify(input.criteria);
        // Recalculer le nombre de leads
        const count = await calculateSegmentCount(input.id, input.criteria, input.logic || 'AND');
        updates.leadCount = count;
        updates.lastCountUpdate = new Date();
      }
      if (input.logic) updates.logic = input.logic;

      await db
        .update(customSegments)
        .set(updates)
        .where(eq(customSegments.id, input.id));

      return { success: true };
    }),

  /**
   * Supprimer un segment
   */
  deleteSegment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      await db
        .delete(customSegments)
        .where(eq(customSegments.id, input.id));

      return { success: true };
    }),

  /**
   * Rafraîchir le comptage d'un segment
   */
  refreshSegmentCount: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Récupérer le segment
      const segment = await db
        .select()
        .from(customSegments)
        .where(eq(customSegments.id, input.id))
        .limit(1);

      if (!segment.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
      }

      const criteria = JSON.parse(segment[0].criteria);
      const logic = segment[0].logic;

      // Recalculer le nombre de leads
      const count = await calculateSegmentCount(input.id, criteria, logic);

      // Mettre à jour
      await db
        .update(customSegments)
        .set({ leadCount: count, lastCountUpdate: new Date() })
        .where(eq(customSegments.id, input.id));

      return { count };
    }),

  /**
   * Analyser la performance d'un segment
   */
  analyzeSegment: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      if (ctx.user.role !== 'admin') {
        throw new TRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
      }

      const db = await getDb();
      if (!db) throw new TRPCError({ code: 'INTERNAL_SERVER_ERROR', message: 'Database not available' });

      // Récupérer le segment
      const segment = await db
        .select()
        .from(customSegments)
        .where(eq(customSegments.id, input.id))
        .limit(1);

      if (!segment.length) {
        throw new TRPCError({ code: 'NOT_FOUND', message: 'Segment not found' });
      }

      const criteria = JSON.parse(segment[0].criteria);
      const logic = segment[0].logic;
      const conditions = buildConditions(criteria, logic);

      // Statistiques du segment
      const stats = await db
        .select({
          count: sql<number>`COUNT(*)`,
          avgScore: sql<number>`AVG(${subscribers.leadScore})`,
          avgEngagement: sql<number>`AVG(${subscribers.engagementScore})`,
          hotCount: sql<number>`SUM(CASE WHEN ${subscribers.leadTemperature} = 'hot' THEN 1 ELSE 0 END)`,
          warmCount: sql<number>`SUM(CASE WHEN ${subscribers.leadTemperature} = 'warm' THEN 1 ELSE 0 END)`,
          coldCount: sql<number>`SUM(CASE WHEN ${subscribers.leadTemperature} = 'cold' THEN 1 ELSE 0 END)`,
        })
        .from(subscribers)
        .where(conditions);

      return {
        totalLeads: Number(stats[0]?.count || 0),
        avgScore: Number(stats[0]?.avgScore || 0).toFixed(1),
        avgEngagement: Number(stats[0]?.avgEngagement || 0).toFixed(1),
        hotLeads: Number(stats[0]?.hotCount || 0),
        warmLeads: Number(stats[0]?.warmCount || 0),
        coldLeads: Number(stats[0]?.coldCount || 0),
      };
    })
});

/**
 * Construire les conditions SQL à partir des critères
 */
function buildConditions(criteria: any[], logic: 'AND' | 'OR'): any {
  const conditions = criteria.map(c => {
    const field = subscribers[c.field as keyof typeof subscribers] as any;
    
    switch (c.operator) {
      case 'equals':
        return eq(field, c.value);
      case 'notEquals':
        return sql`${field} != ${c.value}`;
      case 'greaterThan':
        return gte(field, c.value);
      case 'lessThan':
        return lte(field, c.value);
      case 'contains':
        return like(field, `%${c.value}%`);
      case 'notContains':
        return sql`${field} NOT LIKE ${`%${c.value}%`}`;
      case 'between':
        if (Array.isArray(c.value) && c.value.length === 2) {
          return and(gte(field, c.value[0]), lte(field, c.value[1]));
        }
        return sql`1=1`; // Condition toujours vraie si invalide
      default:
        return sql`1=1`;
    }
  });

  return logic === 'AND' ? and(...conditions) : or(...conditions);
}

/**
 * Calculer le nombre de leads dans un segment
 */
async function calculateSegmentCount(segmentId: number, criteria: any[], logic: 'AND' | 'OR'): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const conditions = buildConditions(criteria, logic);
  
  const result = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(subscribers)
    .where(conditions);

  return Number(result[0]?.count || 0);
}
