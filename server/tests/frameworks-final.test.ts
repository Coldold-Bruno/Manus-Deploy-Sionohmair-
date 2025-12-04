import { describe, it, expect, beforeAll } from 'vitest';
import { db } from '../db';
import { users } from '../../drizzle/schema';
import { avatars, copyGenerations } from '../../drizzle/schema_content_marketing';
import { eq } from 'drizzle-orm';
import { appRouter } from '../routers';

/**
 * Tests finaux pour tous les frameworks de copywriting
 * et l'intégration Avatar → Générateur de Copy
 */

describe('Tests Finaux - Frameworks et Intégration Avatar', () => {
  let testUserId: string;
  let testAvatarId: string;
  let caller: ReturnType<typeof appRouter.createCaller>;

  beforeAll(async () => {
    // Créer un utilisateur de test
    const existingUser = await db.query.users.findFirst({
      where: eq(users.email, 'test-frameworks@example.com'),
    });

    if (existingUser) {
      testUserId = existingUser.id;
    } else {
      const [newUser] = await db
        .insert(users)
        .values({
          email: 'test-frameworks@example.com',
          name: 'Test Frameworks User',
        })
        .returning();
      testUserId = newUser.id;
    }

    // Créer un contexte avec l'utilisateur authentifié
    caller = appRouter.createCaller({
      user: {
        id: testUserId,
        email: 'test-frameworks@example.com',
        name: 'Test Frameworks User',
      },
    });
  });

  describe('Test 1: Frameworks Restants (AIDA, PAS, PASTOR, BAB)', () => {
    const testBrief =
      'Créer une landing page pour une formation en copywriting qui aide les entrepreneurs à doubler leurs conversions en 30 jours.';

    const frameworksToTest = [
      {
        name: 'AIDA',
        description: 'Attention - Intérêt - Désir - Action',
      },
      {
        name: 'PAS',
        description: 'Problème - Agitation - Solution',
      },
      {
        name: 'PASTOR',
        description: 'Problème - Amplifier - Solution - Transformation - Offre - Réponse',
      },
      {
        name: 'BAB',
        description: 'Before - After - Bridge',
      },
    ];

    frameworksToTest.forEach((framework) => {
      it(`devrait générer du copy avec le framework ${framework.name}`, async () => {
        const result = await caller.contentMarketing.generateCopy({
          brief: testBrief,
          framework: framework.name,
          frameworkName: framework.name,
          frameworkDescription: framework.description,
          tone: 'professionnel',
          length: 'moyen',
        });

        // Vérifications
        expect(result).toBeDefined();
        expect(result.generatedCopy).toBeDefined();
        expect(result.generatedCopy.length).toBeGreaterThan(100);
        expect(result.framework).toBe(framework.name);
        
        console.log(`\n✅ ${framework.name}: ${result.generatedCopy.length} caractères générés`);
        console.log(`Aperçu: ${result.generatedCopy.substring(0, 150)}...`);
      }, 60000); // Timeout de 60 secondes pour la génération IA
    });
  });

  describe('Test 2: Intégration Avatar → Générateur de Copy', () => {
    it('devrait créer un avatar client', async () => {
      const avatarData = {
        name: 'Sophie Martin',
        age: 35,
        occupation: 'Entrepreneure e-commerce',
        bio: 'Propriétaire d\'une boutique en ligne de produits bio. Cherche à améliorer ses conversions.',
        goals: 'Doubler le taux de conversion de sa boutique en ligne',
        frustrations:
          'Trafic élevé mais peu de ventes, ne sait pas comment optimiser ses pages produits',
        desires:
          'Maîtriser le copywriting pour créer des descriptions de produits irrésistibles',
        objections: 'Manque de temps, budget limité pour la formation',
      };

      const avatar = await caller.contentMarketing.createAvatar(avatarData);

      expect(avatar).toBeDefined();
      expect(avatar.id).toBeDefined();
      expect(avatar.name).toBe('Sophie Martin');
      expect(avatar.age).toBe(35);
      expect(avatar.userId).toBe(testUserId);

      testAvatarId = avatar.id;
      
      console.log(`\n✅ Avatar créé: ${avatar.name}, ${avatar.age} ans, ${avatar.occupation}`);
      console.log(`ID: ${avatar.id}`);
    });

    it('devrait générer du copy personnalisé avec l\'avatar', async () => {
      expect(testAvatarId).toBeDefined();

      const result = await caller.contentMarketing.generateCopy({
        brief: 'Créer une page de vente pour une formation en copywriting e-commerce',
        framework: 'PFPMA',
        frameworkName: 'PFPMA',
        frameworkDescription: 'Problème - Formule - Preuve - Méthode - Appel',
        tone: 'professionnel',
        length: 'moyen',
        avatarId: testAvatarId,
      });

      // Vérifications de base
      expect(result).toBeDefined();
      expect(result.generatedCopy).toBeDefined();
      expect(result.generatedCopy.length).toBeGreaterThan(100);
      expect(result.avatarId).toBe(testAvatarId);

      // Vérifier la personnalisation
      const copyLower = result.generatedCopy.toLowerCase();
      const hasSophie = copyLower.includes('sophie');
      const hasEcommerce = copyLower.includes('e-commerce') || copyLower.includes('boutique');
      const hasPersonalization = hasSophie || hasEcommerce;

      console.log(`\n✅ Copy personnalisé généré: ${result.generatedCopy.length} caractères`);
      console.log(`Personnalisation détectée:`);
      console.log(`  - Mention du nom (Sophie): ${hasSophie ? '✅' : '❌'}`);
      console.log(`  - Contexte e-commerce: ${hasEcommerce ? '✅' : '❌'}`);
      console.log(`\nAperçu: ${result.generatedCopy.substring(0, 300)}...`);

      // La personnalisation devrait être présente
      expect(hasPersonalization).toBe(true);
    }, 60000); // Timeout de 60 secondes pour la génération IA

    it('devrait récupérer l\'avatar créé', async () => {
      expect(testAvatarId).toBeDefined();

      const avatars = await caller.contentMarketing.getAvatars();

      expect(avatars).toBeDefined();
      expect(Array.isArray(avatars)).toBe(true);
      
      const sophieAvatar = avatars.find((a) => a.id === testAvatarId);
      expect(sophieAvatar).toBeDefined();
      expect(sophieAvatar?.name).toBe('Sophie Martin');
      
      console.log(`\n✅ Avatar récupéré: ${sophieAvatar?.name}`);
      console.log(`Total d'avatars: ${avatars.length}`);
    });
  });

  describe('Test 3: Vérification de la sauvegarde en base de données', () => {
    it('devrait avoir sauvegardé les générations de copy en base', async () => {
      const generations = await db.query.copyGenerations.findMany({
        where: eq(copyGenerations.userId, testUserId),
        orderBy: (copyGenerations, { desc }) => [desc(copyGenerations.createdAt)],
        limit: 10,
      });

      expect(generations).toBeDefined();
      expect(generations.length).toBeGreaterThan(0);

      // Vérifier qu'on a des générations avec différents frameworks
      const frameworks = [...new Set(generations.map((g) => g.framework))];
      
      console.log(`\n✅ Générations sauvegardées: ${generations.length}`);
      console.log(`Frameworks utilisés: ${frameworks.join(', ')}`);
      
      // On devrait avoir au moins les frameworks testés
      expect(frameworks.length).toBeGreaterThan(0);
    });

    it('devrait avoir sauvegardé l\'avatar en base', async () => {
      expect(testAvatarId).toBeDefined();

      const avatar = await db.query.avatars.findFirst({
        where: eq(avatars.id, testAvatarId),
      });

      expect(avatar).toBeDefined();
      expect(avatar?.name).toBe('Sophie Martin');
      expect(avatar?.userId).toBe(testUserId);
      
      console.log(`\n✅ Avatar sauvegardé en base: ${avatar?.name}`);
    });
  });
});
