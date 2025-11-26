import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { appRouter } from './routers';
import { getDb } from './db';
import { users, formationAccess, moduleProgress, exerciseAttempts, badges } from '../drizzle/schema';
import { eq } from 'drizzle-orm';

/**
 * Tests du router formation
 * 
 * Scénarios testés :
 * 1. Vérification de l'accès (avec et sans accès)
 * 2. Création d'un accès formation
 * 3. Récupération des modules
 * 4. Démarrage d'un module
 * 5. Soumission d'un exercice (réussi et échoué)
 * 6. Déblocage du module suivant
 * 7. Attribution des badges
 */

describe('Formation Router', () => {
  let db: any;
  let testUserId: number;
  let testAccessId: number;

  beforeAll(async () => {
    db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Créer un utilisateur de test
    const [user] = await db.insert(users).values({
      openId: 'test-formation-user',
      name: 'Test Formation User',
      email: 'test-formation@example.com',
    });
    testUserId = user.insertId;
  });

  afterAll(async () => {
    // Nettoyer les données de test
    if (db && testUserId) {
      await db.delete(badges).where(eq(badges.userId, testUserId));
      await db.delete(exerciseAttempts).where(eq(exerciseAttempts.userId, testUserId));
      await db.delete(moduleProgress).where(eq(moduleProgress.userId, testUserId));
      await db.delete(formationAccess).where(eq(formationAccess.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
    }
  });

  describe('checkAccess', () => {
    it('devrait retourner hasAccess: false si l\'utilisateur n\'a pas d\'accès', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      const result = await caller.formation.checkAccess();

      expect(result.hasAccess).toBe(false);
      expect(result.message).toContain('accès');
    });

    it('devrait retourner hasAccess: true si l\'utilisateur a un accès actif', async () => {
      // Créer un accès
      const startDate = new Date();
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 90);

      const [access] = await db.insert(formationAccess).values({
        userId: testUserId,
        orderId: 1,
        accessStartDate: startDate,
        accessEndDate: endDate,
        isActive: true,
        isCompleted: false,
        completedModules: 0,
        totalExercisesCompleted: 0,
        overallScore: 0,
        lastAccessDate: startDate,
      });
      testAccessId = access.insertId;

      // Créer les 9 modules
      for (let i = 1; i <= 9; i++) {
        await db.insert(moduleProgress).values({
          userId: testUserId,
          formationAccessId: testAccessId,
          moduleNumber: i,
          moduleName: `Module ${i}`,
          isUnlocked: i === 1,
          isStarted: false,
          isCompleted: false,
          completedExercises: 0,
          moduleScore: 0,
        });
      }

      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      const result = await caller.formation.checkAccess();

      expect(result.hasAccess).toBe(true);
      expect(result.daysRemaining).toBeGreaterThan(0);
      expect(result.completedModules).toBe(0);
    });
  });

  describe('getModules', () => {
    it('devrait retourner les 9 modules avec le statut correct', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      const modules = await caller.formation.getModules();

      expect(modules).toHaveLength(9);
      expect(modules[0].moduleNumber).toBe(1);
      expect(modules[0].isUnlocked).toBe(true);
      expect(modules[1].isUnlocked).toBe(false);
    });
  });

  describe('startModule', () => {
    it('devrait démarrer un module débloqué', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      const result = await caller.formation.startModule({ moduleNumber: 1 });

      expect(result.success).toBe(true);
      expect(result.message).toContain('démarré');

      // Vérifier que le module est bien démarré
      const modules = await caller.formation.getModules();
      expect(modules[0].isStarted).toBe(true);
    });

    it('devrait échouer si le module est verrouillé', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      await expect(
        caller.formation.startModule({ moduleNumber: 2 })
      ).rejects.toThrow('verrouillé');
    });
  });

  describe('submitExercise', () => {
    it('devrait valider un exercice correct', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      // Réponse correcte pour l'exercice 1 du module 1
      const result = await caller.formation.submitExercise({
        moduleNumber: 1,
        exerciseNumber: 1,
        userAnswer: 'P (Problème) : Vous perdez 2h par jour, F (Formule) : Code PFPMA, P (Preuve) : +340% de conversion, M (Méthode) : 3 étapes, A (Appel) : Testez gratuitement',
      });

      expect(result.isCorrect).toBe(true);
      expect(result.score).toBeGreaterThanOrEqual(70);
      expect(result.feedback).toContain('réussi');
    });

    it('devrait rejeter un exercice incorrect', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      // Réponse incorrecte (trop courte)
      const result = await caller.formation.submitExercise({
        moduleNumber: 1,
        exerciseNumber: 2,
        userAnswer: 'Réponse trop courte',
      });

      expect(result.isCorrect).toBe(false);
      expect(result.score).toBeLessThan(70);
    });

    it('devrait débloquer le module suivant après 3 exercices réussis', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      // Soumettre les 3 exercices du module 1
      await caller.formation.submitExercise({
        moduleNumber: 1,
        exerciseNumber: 2,
        userAnswer: 'Le message manque un problème clair, une formule mémorable, une preuve crédible avec chiffres, une méthode actionnable en étapes, et un appel sans friction. Il est trop vague et générique.',
      });

      const result = await caller.formation.submitExercise({
        moduleNumber: 1,
        exerciseNumber: 3,
        userAnswer: 'Tu jettes 156 bouteilles plastiques par an. Ça pollue les océans et coûte 120€. La Bouteille Éternelle : 1 bouteille = 0 déchet. Économise 120€/an, réduis ton empreinte carbone de 85%. Commande maintenant (2 min, livraison gratuite).',
      });

      expect(result.moduleCompleted).toBe(true);

      // Vérifier que le module 2 est débloqué
      const modules = await caller.formation.getModules();
      expect(modules[1].isUnlocked).toBe(true);
    });
  });

  describe('getBadges', () => {
    it('devrait attribuer le badge "Premier Pas" après le premier exercice', async () => {
      const caller = appRouter.createCaller({
        user: { id: testUserId, openId: 'test-formation-user', name: 'Test User', email: 'test@example.com' },
        db,
      });

      const userBadges = await caller.formation.getBadges();

      expect(userBadges.length).toBeGreaterThan(0);
      expect(userBadges.some(b => b.badgeName === 'Premier Pas')).toBe(true);
    });
  });
});
