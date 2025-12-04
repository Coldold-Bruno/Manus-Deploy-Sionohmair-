import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { getDb } from '../db';
import { getOrCreateQuota, checkQuota, incrementQuota, activatePremium, deactivatePremium, isPremiumActive } from '../lib/quotas';
import { userQuotas } from '../../drizzle/schema_quotas';
import { users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Tests pour le système de quotas et Premium
 * Sionohmair Insight Academy
 */

describe('Système de Quotas et Premium', () => {
  let testUserId: number;

  beforeAll(async () => {
    // Créer un utilisateur de test
    const db = await getDb();
    if (db) {
      // Nettoyer d'abord
      await db.delete(users).where(eq(users.openId, 'test-premium-user'));
      
      // Créer l'utilisateur
      const [user] = await db.insert(users).values({
        openId: 'test-premium-user',
        name: 'Test Premium User',
        email: 'test-premium@example.com',
      });
      
      testUserId = user.insertId;
      
      // Nettoyer les quotas existants
      await db.delete(userQuotas).where(eq(userQuotas.userId, testUserId));
    }
  });

  afterAll(async () => {
    // Nettoyer après les tests
    const db = await getDb();
    if (db && testUserId) {
      await db.delete(userQuotas).where(eq(userQuotas.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  it('devrait créer un quota pour un nouvel utilisateur', async () => {
    const quota = await getOrCreateQuota(testUserId);
    
    expect(quota).toBeDefined();
    expect(quota.userId).toBe(testUserId);
    expect(quota.isPremium).toBe(false);
    expect(quota.copyGenerationsUsed).toBe(0);
    expect(quota.copyGenerationsLimit).toBe(5);
    expect(quota.contentAnalysesUsed).toBe(0);
    expect(quota.contentAnalysesLimit).toBe(10);
    expect(quota.avatarsCount).toBe(0);
    expect(quota.avatarsLimit).toBe(3);
  });

  it('devrait retourner le quota existant', async () => {
    const quota1 = await getOrCreateQuota(testUserId);
    const quota2 = await getOrCreateQuota(testUserId);
    
    expect(quota1.id).toBe(quota2.id);
  });

  it('devrait autoriser l\'utilisation si le quota n\'est pas atteint', async () => {
    const result = await checkQuota(testUserId, 'copy_generations');
    
    expect(result.allowed).toBe(true);
    expect(result.isPremium).toBe(false);
    expect(result.remaining).toBe(5);
    expect(result.used).toBe(0);
    expect(result.limit).toBe(5);
  });

  it('devrait incrémenter le quota après utilisation', async () => {
    await incrementQuota(testUserId, 'copy_generations');
    
    const result = await checkQuota(testUserId, 'copy_generations');
    expect(result.used).toBe(1);
    expect(result.remaining).toBe(4);
  });

  it('devrait bloquer si le quota est dépassé', async () => {
    // Incrémenter jusqu'à la limite
    for (let i = 0; i < 4; i++) {
      await incrementQuota(testUserId, 'copy_generations');
    }
    
    const result = await checkQuota(testUserId, 'copy_generations');
    expect(result.allowed).toBe(false);
    expect(result.message).toContain('Limite mensuelle atteinte');
  });

  it('devrait activer le statut Premium', async () => {
    await activatePremium(testUserId, 1, 'cus_test', 'sub_test', 'price_test');
    
    const quota = await getOrCreateQuota(testUserId);
    expect(quota.isPremium).toBe(true);
    expect(isPremiumActive(quota)).toBe(true);
    expect(quota.stripeCustomerId).toBe('cus_test');
  });

  it('devrait autoriser l\'utilisation illimitée pour Premium', async () => {
    const result = await checkQuota(testUserId, 'copy_generations');
    
    expect(result.allowed).toBe(true);
    expect(result.isPremium).toBe(true);
  });

  it('ne devrait pas incrémenter le quota pour Premium', async () => {
    const quotaBefore = await getOrCreateQuota(testUserId);
    const usedBefore = quotaBefore.copyGenerationsUsed;
    
    await incrementQuota(testUserId, 'copy_generations');
    
    const quotaAfter = await getOrCreateQuota(testUserId);
    expect(quotaAfter.copyGenerationsUsed).toBe(usedBefore);
  });

  it('devrait désactiver le statut Premium', async () => {
    await deactivatePremium(testUserId);
    
    const quota = await getOrCreateQuota(testUserId);
    expect(quota.isPremium).toBe(false);
    expect(quota.premiumUntil).toBeNull();
  });

  it('devrait vérifier tous les types de quotas', async () => {
    const types = ['copy_generations', 'content_analyses', 'avatars', 'corrections', 'quotes'] as const;
    
    for (const type of types) {
      const result = await checkQuota(testUserId, type);
      expect(result).toBeDefined();
      expect(result.allowed).toBeDefined();
      expect(result.isPremium).toBeDefined();
    }
  });
});
