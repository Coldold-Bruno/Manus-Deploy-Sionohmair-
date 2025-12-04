import { getDb } from '../db';
import { userQuotas } from '../../drizzle/schema_quotas';
import { eq, sql } from 'drizzle-orm';
import { TRPCError } from '@trpc/server';

/**
 * Types de quotas disponibles
 */
export type QuotaType =
  | 'copy_generations'
  | 'content_analyses'
  | 'avatars'
  | 'corrections'
  | 'quotes';

/**
 * Résultat de la vérification de quota
 */
export interface QuotaCheckResult {
  allowed: boolean;
  isPremium: boolean;
  remaining?: number;
  message?: string;
  used?: number;
  limit?: number;
}

/**
 * Obtenir ou créer le quota d'un utilisateur
 */
export async function getOrCreateQuota(userId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  // Chercher le quota existant
  const existingQuotas = await db
    .select()
    .from(userQuotas)
    .where(eq(userQuotas.userId, userId))
    .limit(1);

  let quota = existingQuotas[0];

  // Créer le quota s'il n'existe pas
  if (!quota) {
    await db.insert(userQuotas).values({
      userId,
    });
    
    // Récupérer le quota créé
    const newQuotas = await db
      .select()
      .from(userQuotas)
      .where(eq(userQuotas.userId, userId))
      .limit(1);
    quota = newQuotas[0];
  }

  // Vérifier si le quota doit être réinitialisé (chaque mois)
  const now = new Date();
  const resetDate = new Date(quota.resetAt);
  const daysSinceReset = Math.floor((now.getTime() - resetDate.getTime()) / (1000 * 60 * 60 * 24));

  if (daysSinceReset >= 30) {
    // Réinitialiser les quotas
    await db
      .update(userQuotas)
      .set({
        copyGenerationsUsed: 0,
        contentAnalysesUsed: 0,
        correctionsUsed: 0,
        quotesUsed: 0,
        resetAt: now,
        updatedAt: now,
      })
      .where(eq(userQuotas.id, quota.id));
    
    // Récupérer le quota mis à jour
    const updatedQuotas = await db
      .select()
      .from(userQuotas)
      .where(eq(userQuotas.id, quota.id))
      .limit(1);
    quota = updatedQuotas[0];
  }

  return quota;
}

/**
 * Vérifier si l'utilisateur est Premium actif
 */
export function isPremiumActive(quota: typeof userQuotas.$inferSelect): boolean {
  if (!quota.isPremium) return false;
  if (!quota.premiumUntil) return false;
  return new Date(quota.premiumUntil) > new Date();
}

/**
 * Vérifier le quota avant une action
 */
export async function checkQuota(
  userId: number,
  type: QuotaType
): Promise<QuotaCheckResult> {
  const quota = await getOrCreateQuota(userId);

  // Si Premium actif, toujours autorisé
  if (isPremiumActive(quota)) {
    return {
      allowed: true,
      isPremium: true,
    };
  }

  // Vérifier le quota selon le type
  let used: number;
  let limit: number;
  let fieldName: string;

  switch (type) {
    case 'copy_generations':
      used = quota.copyGenerationsUsed;
      limit = quota.copyGenerationsLimit;
      fieldName = 'Générateur de Copy';
      break;
    case 'content_analyses':
      used = quota.contentAnalysesUsed;
      limit = quota.contentAnalysesLimit;
      fieldName = 'Analyseur de Contenu';
      break;
    case 'avatars':
      used = quota.avatarsCount;
      limit = quota.avatarsLimit;
      fieldName = 'Persona Builder';
      break;
    case 'corrections':
      used = quota.correctionsUsed;
      limit = quota.correctionsLimit;
      fieldName = 'Correcteur';
      break;
    case 'quotes':
      used = quota.quotesUsed;
      limit = quota.quotesLimit;
      fieldName = 'Générateur de Citations';
      break;
    default:
      throw new Error(`Type de quota inconnu: ${type}`);
  }

  // Quota dépassé
  if (used >= limit) {
    return {
      allowed: false,
      isPremium: false,
      used,
      limit,
      message: `Limite mensuelle atteinte pour ${fieldName} (${used}/${limit}). Passez Premium pour un accès illimité.`,
    };
  }

  // Quota OK
  return {
    allowed: true,
    isPremium: false,
    remaining: limit - used,
    used,
    limit,
  };
}

/**
 * Incrémenter le quota après une action réussie
 */
export async function incrementQuota(userId: number, type: QuotaType): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const quota = await getOrCreateQuota(userId);

  // Ne pas incrémenter si Premium
  if (isPremiumActive(quota)) {
    return;
  }

  let updateData: any = { updatedAt: new Date() };

  switch (type) {
    case 'copy_generations':
      updateData.copyGenerationsUsed = sql`${userQuotas.copyGenerationsUsed} + 1`;
      break;
    case 'content_analyses':
      updateData.contentAnalysesUsed = sql`${userQuotas.contentAnalysesUsed} + 1`;
      break;
    case 'avatars':
      updateData.avatarsCount = sql`${userQuotas.avatarsCount} + 1`;
      break;
    case 'corrections':
      updateData.correctionsUsed = sql`${userQuotas.correctionsUsed} + 1`;
      break;
    case 'quotes':
      updateData.quotesUsed = sql`${userQuotas.quotesUsed} + 1`;
      break;
  }

  await db
    .update(userQuotas)
    .set(updateData)
    .where(eq(userQuotas.id, quota.id));
}

/**
 * Décrémenter le quota (en cas d'annulation)
 */
export async function decrementQuota(userId: number, type: QuotaType): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const quota = await getOrCreateQuota(userId);

  // Ne pas décrémenter si Premium
  if (isPremiumActive(quota)) {
    return;
  }

  let updateData: any = { updatedAt: new Date() };

  switch (type) {
    case 'copy_generations':
      updateData.copyGenerationsUsed = sql`GREATEST(0, ${userQuotas.copyGenerationsUsed} - 1)`;
      break;
    case 'content_analyses':
      updateData.contentAnalysesUsed = sql`GREATEST(0, ${userQuotas.contentAnalysesUsed} - 1)`;
      break;
    case 'avatars':
      updateData.avatarsCount = sql`GREATEST(0, ${userQuotas.avatarsCount} - 1)`;
      break;
    case 'corrections':
      updateData.correctionsUsed = sql`GREATEST(0, ${userQuotas.correctionsUsed} - 1)`;
      break;
    case 'quotes':
      updateData.quotesUsed = sql`GREATEST(0, ${userQuotas.quotesUsed} - 1)`;
      break;
  }

  await db
    .update(userQuotas)
    .set(updateData)
    .where(eq(userQuotas.id, quota.id));
}

/**
 * Activer le statut Premium pour un utilisateur
 */
export async function activatePremium(
  userId: number,
  durationMonths: number,
  stripeCustomerId?: string,
  stripeSubscriptionId?: string,
  stripePriceId?: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const quota = await getOrCreateQuota(userId);

  const premiumUntil = new Date();
  premiumUntil.setMonth(premiumUntil.getMonth() + durationMonths);

  await db
    .update(userQuotas)
    .set({
      isPremium: true,
      premiumUntil,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      updatedAt: new Date(),
    })
    .where(eq(userQuotas.id, quota.id));
}

/**
 * Désactiver le statut Premium pour un utilisateur
 */
export async function deactivatePremium(userId: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error('Database not available');

  const quota = await getOrCreateQuota(userId);

  await db
    .update(userQuotas)
    .set({
      isPremium: false,
      premiumUntil: null,
      updatedAt: new Date(),
    })
    .where(eq(userQuotas.id, quota.id));
}

/**
 * Middleware tRPC pour vérifier le quota
 * Utilisation : .use(checkQuotaMiddleware('copy_generations'))
 */
export function checkQuotaMiddleware(type: QuotaType) {
  return async ({ ctx, next }: any) => {
    if (!ctx.user) {
      throw new TRPCError({
        code: 'UNAUTHORIZED',
        message: 'Vous devez être connecté pour utiliser cette fonctionnalité',
      });
    }

    const quotaCheck = await checkQuota(ctx.user.id, type);

    if (!quotaCheck.allowed) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: quotaCheck.message || 'Quota dépassé',
        cause: {
          code: 'QUOTA_EXCEEDED',
          quotaType: type,
          used: quotaCheck.used,
          limit: quotaCheck.limit,
        },
      });
    }

    // Passer les infos de quota au contexte
    return next({
      ctx: {
        ...ctx,
        quotaInfo: quotaCheck,
      },
    });
  };
}
