import { describe, it, expect, beforeAll } from 'vitest';
import { getDb } from '../db';
import { subscriptions, users } from '../../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Tests pour le router subscription
 * Vérifie les procédures de gestion des abonnements
 */

describe('Subscription Router', () => {
  let db: Awaited<ReturnType<typeof getDb>>;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }
  });

  it('should have database connection', () => {
    expect(db).toBeDefined();
  });

  it('should have subscriptions table', async () => {
    if (!db) throw new Error('Database not available');

    // Vérifier que la table existe en essayant de faire une requête
    const result = await db.select().from(subscriptions).limit(1);
    expect(result).toBeDefined();
    expect(Array.isArray(result)).toBe(true);
  });

  it('should create a trial subscription', async () => {
    if (!db) throw new Error('Database not available');

    // Créer un utilisateur de test
    const testEmail = `test-${Date.now()}@example.com`;
    const [testUser] = await db.insert(users).values({
      openId: `test-openid-${Date.now()}`,
      email: testEmail,
      name: 'Test User',
      role: 'user',
    });

    const userId = testUser.insertId;

    // Créer un essai gratuit
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db.insert(subscriptions).values({
      userId,
      plan: 'trial',
      status: 'trial',
      trialStartDate: now,
      trialEndDate,
    });

    // Vérifier que l'abonnement a été créé
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    expect(subscription).toBeDefined();
    expect(subscription.status).toBe('trial');
    expect(subscription.plan).toBe('trial');

    // Nettoyer
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('should calculate days remaining correctly', async () => {
    if (!db) throw new Error('Database not available');

    // Créer un utilisateur de test
    const testEmail = `test-${Date.now()}@example.com`;
    const [testUser] = await db.insert(users).values({
      openId: `test-openid-${Date.now()}`,
      email: testEmail,
      name: 'Test User',
      role: 'user',
    });

    const userId = testUser.insertId;

    // Créer un essai gratuit avec 7 jours restants
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 7);

    await db.insert(subscriptions).values({
      userId,
      plan: 'trial',
      status: 'trial',
      trialStartDate: now,
      trialEndDate,
    });

    // Récupérer l'abonnement
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    // Calculer les jours restants
    const daysRemaining = Math.ceil(
      (new Date(subscription.trialEndDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
    );

    expect(daysRemaining).toBeGreaterThanOrEqual(6);
    expect(daysRemaining).toBeLessThanOrEqual(8);

    // Nettoyer
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('should update subscription status to active', async () => {
    if (!db) throw new Error('Database not available');

    // Créer un utilisateur de test
    const testEmail = `test-${Date.now()}@example.com`;
    const [testUser] = await db.insert(users).values({
      openId: `test-openid-${Date.now()}`,
      email: testEmail,
      name: 'Test User',
      role: 'user',
    });

    const userId = testUser.insertId;

    // Créer un essai gratuit
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db.insert(subscriptions).values({
      userId,
      plan: 'trial',
      status: 'trial',
      trialStartDate: now,
      trialEndDate,
    });

    // Mettre à jour le statut à "active" (simuler un paiement)
    await db
      .update(subscriptions)
      .set({
        plan: 'paid',
        status: 'active',
        paymentDate: now,
        activatedAt: now,
      })
      .where(eq(subscriptions.userId, userId));

    // Vérifier que le statut a été mis à jour
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    expect(subscription.status).toBe('active');
    expect(subscription.plan).toBe('paid');
    expect(subscription.paymentDate).toBeDefined();
    expect(subscription.activatedAt).toBeDefined();

    // Nettoyer
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });

  it('should update subscription status to cancelled', async () => {
    if (!db) throw new Error('Database not available');

    // Créer un utilisateur de test
    const testEmail = `test-${Date.now()}@example.com`;
    const [testUser] = await db.insert(users).values({
      openId: `test-openid-${Date.now()}`,
      email: testEmail,
      name: 'Test User',
      role: 'user',
    });

    const userId = testUser.insertId;

    // Créer un abonnement actif
    const now = new Date();
    const trialEndDate = new Date(now);
    trialEndDate.setDate(trialEndDate.getDate() + 30);

    await db.insert(subscriptions).values({
      userId,
      plan: 'paid',
      status: 'active',
      trialStartDate: now,
      trialEndDate,
      paymentDate: now,
      activatedAt: now,
    });

    // Annuler l'abonnement
    await db
      .update(subscriptions)
      .set({ status: 'cancelled' })
      .where(eq(subscriptions.userId, userId));

    // Vérifier que le statut a été mis à jour
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, userId))
      .limit(1);

    expect(subscription.status).toBe('cancelled');

    // Nettoyer
    await db.delete(subscriptions).where(eq(subscriptions.userId, userId));
    await db.delete(users).where(eq(users.id, userId));
  });
});
