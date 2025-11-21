import { z } from 'zod';
import { protectedProcedure, router } from './_core/trpc';
import { getDb } from './db';
import { artefacts, orders } from '../drizzle/schema';
import { eq, and } from 'drizzle-orm';
import { storagePut, storageGet } from './storage';

export const artefactsRouter = router({
  /**
   * Récupérer tous les artefacts d'une commande
   */
  getOrderArtefacts: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier que la commande appartient à l'utilisateur
      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, input.orderId), eq(orders.userId, ctx.user.id)))
        .limit(1);

      if (!order) {
        throw new Error('Order not found or unauthorized');
      }

      // Récupérer les artefacts
      const orderArtefacts = await db
        .select()
        .from(artefacts)
        .where(eq(artefacts.orderId, input.orderId));

      return orderArtefacts;
    }),

  /**
   * Générer une URL de téléchargement sécurisée pour un artefact
   */
  getArtefactDownloadUrl: protectedProcedure
    .input(
      z.object({
        artefactId: z.number(),
      })
    )
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Récupérer l'artefact
      const [artefact] = await db
        .select()
        .from(artefacts)
        .where(eq(artefacts.id, input.artefactId))
        .limit(1);

      if (!artefact) {
        throw new Error('Artefact not found');
      }

      // Vérifier que la commande appartient à l'utilisateur
      const [order] = await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, artefact.orderId), eq(orders.userId, ctx.user.id)))
        .limit(1);

      if (!order) {
        throw new Error('Unauthorized');
      }

      // Générer une URL de téléchargement sécurisée
      const downloadUrl = await storageGet(artefact.s3Key);

      return {
        ...artefact,
        downloadUrl: downloadUrl.url,
      };
    }),

  /**
   * Upload un artefact pour une commande (admin only)
   * Note: Cette procédure est pour usage interne/admin
   */
  uploadArtefact: protectedProcedure
    .input(
      z.object({
        orderId: z.number(),
        name: z.string(),
        description: z.string().optional(),
        fileData: z.string(), // Base64 encoded file data
        fileName: z.string(),
        fileType: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier que la commande existe
      const [order] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, input.orderId))
        .limit(1);

      if (!order) {
        throw new Error('Order not found');
      }

      // Décoder le fichier base64
      const fileBuffer = Buffer.from(input.fileData, 'base64');

      // Générer la clé S3
      const s3Key = `artefacts/${input.orderId}/${Date.now()}-${input.fileName}`;

      // Upload vers S3
      const uploadResult = await storagePut(s3Key, fileBuffer, input.fileType);

      // Créer l'enregistrement dans la base de données
      await db.insert(artefacts).values({
        orderId: input.orderId,
        name: input.name,
        description: input.description || null,
        s3Key: uploadResult.key,
        s3Url: uploadResult.url,
        fileType: input.fileType,
        fileSize: fileBuffer.length,
      });

      console.log('[Artefacts] Uploaded artefact for order:', input.orderId);

      return {
        success: true,
        s3Key: uploadResult.key,
        s3Url: uploadResult.url,
      };
    }),
});
