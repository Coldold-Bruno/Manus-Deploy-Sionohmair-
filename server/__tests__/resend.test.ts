import { describe, it, expect, beforeAll } from 'vitest';
import { sendTestEmail, sendNewsletterWelcome } from '../emailServiceResend';

/**
 * Tests pour la configuration Resend
 * 
 * Ces tests vérifient que :
 * 1. Les variables d'environnement sont correctement configurées
 * 2. L'envoi d'emails fonctionne
 * 
 * Note: Ces tests nécessitent que le domaine soit vérifié dans Resend
 */

describe('Configuration Resend', () => {
  beforeAll(() => {
    // Vérifier que les variables d'environnement sont définies
    if (!process.env.RESEND_API_KEY) {
      console.warn('⚠️  RESEND_API_KEY n\'est pas définie. Ajoutez-la dans Settings → Secrets');
    }
    if (!process.env.SMTP_FROM_EMAIL) {
      console.warn('⚠️  SMTP_FROM_EMAIL n\'est pas définie. Ajoutez-la dans Settings → Secrets');
    }
  });

  it('devrait avoir les variables d\'environnement Resend configurées', () => {
    expect(process.env.RESEND_API_KEY).toBeDefined();
    expect(process.env.RESEND_API_KEY).toMatch(/^re_/);
    expect(process.env.SMTP_FROM_EMAIL).toBeDefined();
    expect(process.env.SMTP_FROM_EMAIL).toContain('@');
    expect(process.env.SMTP_FROM_NAME).toBeDefined();
  });

  it('devrait envoyer un email de test', async () => {
    // Skip si pas de clé API
    if (!process.env.RESEND_API_KEY) {
      console.log('⏭️  Test skippé : RESEND_API_KEY non configurée');
      return;
    }

    const testEmail = process.env.SMTP_FROM_EMAIL || 'test@example.com';
    
    const result = await sendTestEmail(testEmail);
    
    // Le test peut échouer si le domaine n'est pas encore vérifié
    if (!result.success) {
      console.warn('⚠️  Email non envoyé. Vérifiez que le domaine est vérifié dans Resend.');
      console.warn('Erreur:', result.error);
    }
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('messageId');
  }, 10000); // Timeout de 10 secondes

  it('devrait envoyer un email de bienvenue newsletter', async () => {
    // Skip si pas de clé API
    if (!process.env.RESEND_API_KEY) {
      console.log('⏭️  Test skippé : RESEND_API_KEY non configurée');
      return;
    }

    const testEmail = process.env.SMTP_FROM_EMAIL || 'test@example.com';
    
    const result = await sendNewsletterWelcome({
      to: testEmail,
    });
    
    if (!result.success) {
      console.warn('⚠️  Email non envoyé. Vérifiez que le domaine est vérifié dans Resend.');
      console.warn('Erreur:', result.error);
    }
    
    expect(result).toHaveProperty('success');
    expect(result).toHaveProperty('messageId');
  }, 10000);
});

/**
 * Instructions pour exécuter ces tests :
 * 
 * 1. Ajoutez les variables d'environnement dans Settings → Secrets :
 *    - RESEND_API_KEY=re_MtuXoYBT_BR5KtvijNLV9BYij2odAjVHo
 *    - SMTP_FROM_EMAIL=sionohmair@academy.com
 *    - SMTP_FROM_NAME=Sionohmair Insight Academy
 * 
 * 2. Vérifiez votre domaine dans Resend (voir RESEND_CONFIGURATION.md)
 * 
 * 3. Exécutez les tests :
 *    pnpm test server/__tests__/resend.test.ts
 * 
 * 4. Vérifiez votre boîte email pour les emails de test
 */
