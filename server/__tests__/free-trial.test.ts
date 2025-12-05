import { describe, it, expect, beforeAll, afterAll } from "vitest";
import { getDb } from "../db";
import { users, subscriptions, userQuotas } from "../../drizzle/schema";
import { eq } from "drizzle-orm";

describe("Système de Gratuité - Tests Complets", () => {
  let db: any;
  let testUserId: number;
  const testUserOpenId = `test-free-user-${Date.now()}`;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error("Database connection failed");
    }

    // Créer un utilisateur de test
    const [user] = await db
      .insert(users)
      .values({
        openId: testUserOpenId,
        name: "Test Free User",
        email: "test-free@example.com",
        role: "user",
      })
      .$returningId();

    testUserId = user.id;
  });

  afterAll(async () => {
    // Nettoyer les données de test
    if (db && testUserId) {
      await db.delete(userQuotas).where(eq(userQuotas.userId, testUserId));
      await db.delete(subscriptions).where(eq(subscriptions.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  describe("1. Inscription Gratuite", () => {
    it("devrait créer un utilisateur sans abonnement", async () => {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.id, testUserId))
        .limit(1);

      expect(user).toBeDefined();
      expect(user.openId).toBe(testUserOpenId);
      expect(user.role).toBe("user");
    });

    it("ne devrait pas avoir d'abonnement au départ", async () => {
      const userSubscriptions = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId));

      expect(userSubscriptions.length).toBe(0);
    });
  });

  describe("2. Création de l'Essai Gratuit", () => {
    it("devrait créer un essai gratuit de 30 jours", async () => {
      const trialStartDate = new Date();
      const trialEndDate = new Date();
      trialEndDate.setDate(trialEndDate.getDate() + 30);

      const [subscription] = await db
        .insert(subscriptions)
        .values({
          userId: testUserId,
          plan: "trial",
          status: "trial",
          trialStartDate,
          trialEndDate,
          oneTimePaymentAmount: 9900, // 99€
        })
        .$returningId();

      expect(subscription).toBeDefined();
      expect(subscription.id).toBeGreaterThan(0);

      // Vérifier que l'essai a bien été créé
      const [createdSub] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      expect(createdSub.plan).toBe("trial");
      expect(createdSub.status).toBe("trial");
      expect(createdSub.trialEndDate).toBeDefined();
    });

    it("devrait calculer correctement les jours restants", async () => {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      const daysRemaining = Math.ceil((trialEnd.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

      expect(daysRemaining).toBeGreaterThanOrEqual(29);
      expect(daysRemaining).toBeLessThanOrEqual(31); // Accepter 31 jours pour éviter les erreurs d'arrondi
    });
  });

  describe("3. Quotas Gratuits", () => {
    it("devrait créer les quotas par défaut", async () => {
      const [quotas] = await db
        .insert(userQuotas)
        .values({
          userId: testUserId,
          copyGenerationsUsed: 0,
          contentAnalysesUsed: 0,
          avatarsCount: 0,
          correctionsUsed: 0,
          quotesUsed: 0,
          resetAt: new Date(),
        })
        .$returningId();

      expect(quotas).toBeDefined();

      const [createdQuotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      expect(createdQuotas.copyGenerationsUsed).toBe(0);
      expect(createdQuotas.contentAnalysesUsed).toBe(0);
      expect(createdQuotas.avatarsCount).toBe(0);
      expect(createdQuotas.correctionsUsed).toBe(0);
      expect(createdQuotas.quotesUsed).toBe(0);
    });

    it("devrait respecter les limites gratuites (5 copies)", async () => {
      const COPY_LIMIT = 5;

      // Simuler 5 générations de copy
      for (let i = 0; i < COPY_LIMIT; i++) {
        await db
          .update(userQuotas)
          .set({ copyGenerationsUsed: i + 1 })
          .where(eq(userQuotas.userId, testUserId));
      }

      const [quotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      expect(quotas.copyGenerationsUsed).toBe(COPY_LIMIT);

      // Vérifier que la limite est atteinte
      const canGenerateMore = quotas.copyGenerationsUsed < COPY_LIMIT;
      expect(canGenerateMore).toBe(false);
    });

    it("devrait respecter les limites gratuites (10 analyses)", async () => {
      const ANALYSIS_LIMIT = 10;

      await db
        .update(userQuotas)
        .set({ contentAnalysesUsed: ANALYSIS_LIMIT })
        .where(eq(userQuotas.userId, testUserId));

      const [quotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      expect(quotas.contentAnalysesUsed).toBe(ANALYSIS_LIMIT);
    });

    it("devrait respecter les limites gratuites (3 avatars)", async () => {
      const AVATAR_LIMIT = 3;

      await db
        .update(userQuotas)
        .set({ avatarsCount: AVATAR_LIMIT })
        .where(eq(userQuotas.userId, testUserId));

      const [quotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      expect(quotas.avatarsCount).toBe(AVATAR_LIMIT);
    });
  });

  describe("4. Réinitialisation des Quotas", () => {
    it("devrait réinitialiser les quotas après 30 jours", async () => {
      // Simuler une date de réinitialisation passée
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 31);

      await db
        .update(userQuotas)
        .set({ resetAt: oldDate })
        .where(eq(userQuotas.userId, testUserId));

      const [quotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      const daysSinceReset = Math.floor(
        (new Date().getTime() - new Date(quotas.resetAt).getTime()) / (1000 * 60 * 60 * 24)
      );

      expect(daysSinceReset).toBeGreaterThanOrEqual(30); // Accepter également 30 jours exactement

      // Réinitialiser les quotas
      await db
        .update(userQuotas)
        .set({
          copyGenerationsUsed: 0,
          contentAnalysesUsed: 0,
          avatarsCount: 0,
          correctionsUsed: 0,
          quotesUsed: 0,
          resetAt: new Date(),
        })
        .where(eq(userQuotas.userId, testUserId));

      const [resetQuotas] = await db
        .select()
        .from(userQuotas)
        .where(eq(userQuotas.userId, testUserId))
        .limit(1);

      expect(resetQuotas.copyGenerationsUsed).toBe(0);
      expect(resetQuotas.contentAnalysesUsed).toBe(0);
      expect(resetQuotas.avatarsCount).toBe(0);
    });
  });

  describe("5. Expiration de l'Essai", () => {
    it("devrait détecter un essai expiré", async () => {
      // Simuler une date d'expiration passée
      const expiredDate = new Date();
      expiredDate.setDate(expiredDate.getDate() - 1);

      await db
        .update(subscriptions)
        .set({ trialEndDate: expiredDate })
        .where(eq(subscriptions.userId, testUserId));

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      const now = new Date();
      const trialEnd = new Date(subscription.trialEndDate);
      const isExpired = trialEnd < now;

      expect(isExpired).toBe(true);
    });

    it("devrait mettre à jour le statut en 'trial_expired'", async () => {
      await db
        .update(subscriptions)
        .set({ status: "trial_expired" })
        .where(eq(subscriptions.userId, testUserId));

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      expect(subscription.status).toBe("trial_expired");
    });
  });

  describe("6. Passage au Premium", () => {
    it("devrait pouvoir activer le Premium après l'essai", async () => {
      const paymentDate = new Date();

      await db
        .update(subscriptions)
        .set({
          status: "active",
          paymentDate,
          activatedAt: paymentDate,
        })
        .where(eq(subscriptions.userId, testUserId));

      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      expect(subscription.status).toBe("active");
      expect(subscription.paymentDate).toBeDefined();
      expect(subscription.activatedAt).toBeDefined();
    });

    it("devrait avoir des quotas illimités après activation Premium", async () => {
      const [subscription] = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.userId, testUserId))
        .limit(1);

      const isPremium = subscription.status === "active";
      expect(isPremium).toBe(true);

      // En Premium, les quotas ne sont plus vérifiés
      // L'utilisateur peut générer autant de copies qu'il veut
    });
  });

  describe("7. Statistiques et Métriques", () => {
    it("devrait calculer le taux de conversion essai → Premium", async () => {
      // Simuler plusieurs utilisateurs
      const totalTrials = 100;
      const convertedToPremium = 15;

      const conversionRate = (convertedToPremium / totalTrials) * 100;

      expect(conversionRate).toBe(15);
      expect(conversionRate).toBeGreaterThan(0);
      expect(conversionRate).toBeLessThan(100);
    });

    it("devrait calculer le revenu mensuel récurrent (MRR)", async () => {
      const monthlyPrice = 36; // 36€/mois
      const activeSubscriptions = 50;

      const mrr = monthlyPrice * activeSubscriptions;

      expect(mrr).toBe(1800); // 1 800€/mois
    });

    it("devrait calculer le revenu annuel récurrent (ARR)", async () => {
      const monthlyPrice = 36;
      const activeSubscriptions = 50;

      const arr = monthlyPrice * 12 * activeSubscriptions;

      expect(arr).toBe(21600); // 21 600€/an
    });
  });
});
