import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import { getDb } from './db';
import { subscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from './emailService';
import { getNewsletterWelcomeEmail } from './emailTemplates';

export const newsletterRouter = router({
  /**
   * S'inscrire à la newsletter
   */
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().email('Email invalide'),
        name: z.string().optional(),
        source: z.string().default('website'),
      })
    )
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      // Vérifier si l'email existe déjà
      const [existing] = await db
        .select()
        .from(subscribers)
        .where(eq(subscribers.email, input.email))
        .limit(1);

      if (existing) {
        if (existing.status === 'unsubscribed') {
          // Réactiver l'abonnement
          await db
            .update(subscribers)
            .set({
              status: 'active',
              subscribedAt: new Date(),
              unsubscribedAt: null,
              name: input.name || existing.name,
            })
            .where(eq(subscribers.id, existing.id));

          return { success: true, message: 'Abonnement réactivé avec succès !' };
        }

        return { success: false, message: 'Cet email est déjà inscrit à la newsletter.' };
      }

      // Créer un nouvel abonné
      await db.insert(subscribers).values({
        email: input.email,
        name: input.name,
        source: input.source,
        status: 'active',
        welcomeEmailSent: 'no',
      });

      // Envoyer l'email de bienvenue avec le nouveau template
      try {
        const htmlContent = getNewsletterWelcomeEmail({ email: input.email });
        
        await sendEmail({
          to: input.email,
          subject: '🎁 Bienvenue chez Sionohmair Insight Academy - Votre Manuel PFPMA Gratuit',
          html: htmlContent,
        });

        // Marquer l'email de bienvenue comme envoyé
        await db
          .update(subscribers)
          .set({ welcomeEmailSent: 'yes' })
          .where(eq(subscribers.email, input.email));
      } catch (error) {
        console.error('Error sending welcome email:', error);
        // Ne pas bloquer l'inscription si l'email échoue
      }

      return { success: true, message: 'Inscription réussie ! Consultez votre boîte email.' };
    }),

  /**
   * Se désabonner de la newsletter
   */
  unsubscribe: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const db = await getDb();
      if (!db) {
        throw new Error('Database not available');
      }

      await db
        .update(subscribers)
        .set({
          status: 'unsubscribed',
          unsubscribedAt: new Date(),
        })
        .where(eq(subscribers.email, input.email));

      return { success: true, message: 'Vous avez été désabonné avec succès.' };
    }),

  /**
   * Récupérer tous les abonnés (admin uniquement)
   */
  getAllSubscribers: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const allSubscribers = await db.select().from(subscribers);

    return allSubscribers;
  }),

  /**
   * Obtenir les statistiques de la newsletter (admin uniquement)
   */
  getStats: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const allSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));

    const totalSubscribers = allSubscribers.length;

    // Calculer les segments par intérêt
    const segmentCounts = {
      diagnostic: allSubscribers.filter((s: any) => s.interests === 'diagnostic').length,
      formation: allSubscribers.filter((s: any) => s.interests === 'formation').length,
      transformation: allSubscribers.filter((s: any) => s.interests === 'transformation').length,
      general: allSubscribers.filter((s: any) => s.interests === 'general' || !s.interests).length,
    };

    // Calculer les segments par engagement
    const engagementCounts = {
      high: allSubscribers.filter((s: any) => (s.engagementScore || 0) >= 70).length,
      medium: allSubscribers.filter((s: any) => (s.engagementScore || 0) >= 30 && (s.engagementScore || 0) < 70).length,
      low: allSubscribers.filter((s: any) => (s.engagementScore || 0) < 30).length,
    };

    // Taux moyens (données simulées pour démonstration)
    const openRate = 45;
    const clickRate = 18;
    const conversionRate = 3.5;

    return {
      totalSubscribers,
      segmentCounts,
      engagementCounts,
      openRate,
      clickRate,
      conversionRate,
    };
  }),

  /**
   * Obtenir les abonnés à fort engagement (admin uniquement)
   */
  getHighEngagementSubscribers: protectedProcedure.query(async ({ ctx }) => {
    const db = await getDb();
    if (!db) {
      throw new Error('Database not available');
    }

    // Vérifier que l'utilisateur est admin
    if (ctx.user.role !== 'admin') {
      throw new Error('Unauthorized: Admin access required');
    }

    const allSubscribers = await db
      .select()
      .from(subscribers)
      .where(eq(subscribers.status, 'active'));

    // Filtrer les abonnés avec un score >= 70
    const highEngagement = allSubscribers
      .filter((s: any) => (s.engagementScore || 0) >= 70)
      .sort((a: any, b: any) => (b.engagementScore || 0) - (a.engagementScore || 0));

    return highEngagement;
  }),

  /**
   * Importer des abonnés en masse (admin uniquement)
   */
  importBulk: protectedProcedure
    .input(
      z.object({
        emails: z.array(z.string().email()),
        defaultInterest: z.enum(['general', 'diagnostic', 'formation', 'transformation']).default('general'),
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

      let success = 0;
      let failed = 0;
      const errors: string[] = [];

      for (const email of input.emails) {
        try {
          // Vérifier si l'email existe déjà
          const [existing] = await db
            .select()
            .from(subscribers)
            .where(eq(subscribers.email, email))
            .limit(1);

          if (existing) {
            if (existing.status === 'unsubscribed') {
              // Réactiver l'abonnement
              await db
                .update(subscribers)
                .set({
                  status: 'active',
                  subscribedAt: new Date(),
                  unsubscribedAt: null,
                  interests: input.defaultInterest,
                })
                .where(eq(subscribers.id, existing.id));

              success++;
            } else {
              // Email déjà actif, ignorer
              errors.push(`${email}: Déjà inscrit`);
              failed++;
            }
          } else {
            // Créer un nouvel abonné
            await db.insert(subscribers).values({
              email,
              source: 'bulk_import',
              status: 'active',
              interests: input.defaultInterest,
              welcomeEmailSent: 'no',
            });

            // Envoyer l'email de bienvenue
            try {
              const htmlContent = getNewsletterWelcomeEmail({ email });
              
              await sendEmail({
                to: email,
                subject: 'Bienvenue chez Sionohmair Insight Academy - Votre Manuel PFPMA Gratuit',
                html: htmlContent,
              });

              // Marquer l'email de bienvenue comme envoyé
              await db
                .update(subscribers)
                .set({ welcomeEmailSent: 'yes' })
                .where(eq(subscribers.email, email));
            } catch (emailError) {
              console.error(`Error sending welcome email to ${email}:`, emailError);
              // Ne pas bloquer l'import si l'email échoue
            }

            success++;
          }
        } catch (error: any) {
          errors.push(`${email}: ${error.message}`);
          failed++;
        }
      }

      return {
        success,
        failed,
        errors,
      };
    }),
});
