import { z } from 'zod';
import { publicProcedure, protectedProcedure, router } from './_core/trpc';
import { getDb } from './db';
import { subscribers } from '../drizzle/schema';
import { eq } from 'drizzle-orm';
import { sendEmail } from './emailService';

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

      // Envoyer l'email de bienvenue
      try {
        await sendEmail({
          to: input.email,
          subject: '🎁 Bienvenue chez Sionohmair Insight Academy - Votre Manuel PFPMA Gratuit',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #0A1929;">Bienvenue ${input.name || 'cher abonné'} !</h1>
              
              <p>Merci de vous être inscrit à la newsletter Sionohmair Insight Academy.</p>
              
              <p>Comme promis, voici votre <strong>Manuel PFPMA gratuit</strong> (50 pages) :</p>
              
              <div style="background: #F59E0B; padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0;">
                <h2 style="color: white; margin: 0;">📚 Le Code PFPMA</h2>
                <p style="color: white; margin: 10px 0;">La Grammaire de la Clarté</p>
                <a href="https://sionohmair-insight-academy.manus.space/ressources" 
                   style="display: inline-block; background: white; color: #0A1929; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; margin-top: 10px;">
                  Télécharger le Manuel PDF
                </a>
              </div>
              
              <h3>Ce que vous allez recevoir :</h3>
              <ul>
                <li>📊 <strong>Études de cas exclusives</strong> : +250% de conversion, +117% d'inscriptions</li>
                <li>🎯 <strong>Méthodologie PFPMA</strong> : Les 5 composantes de tout message qui convertit</li>
                <li>💡 <strong>Insights hebdomadaires</strong> : Conseils actionnables pour éliminer les frictions</li>
                <li>🚀 <strong>Offres prioritaires</strong> : Accès anticipé au Sprint de Clarté (490 €)</li>
              </ul>
              
              <p>Vous recevrez un email par semaine (maximum) avec du contenu de haute valeur. Pas de spam, promis.</p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 14px; color: #6b7280;">
                Bruno Coldold<br>
                Fondateur, Sionohmair Insight Academy<br>
                <a href="https://www.linkedin.com/in/brunocoldold" style="color: #F59E0B;">LinkedIn</a>
              </p>
              
              <p style="font-size: 12px; color: #9ca3af; margin-top: 20px;">
                Vous recevez cet email car vous vous êtes inscrit sur sionohmair-insight-academy.manus.space.
                <a href="https://sionohmair-insight-academy.manus.space/unsubscribe?email=${encodeURIComponent(input.email)}" style="color: #9ca3af;">Se désabonner</a>
              </p>
            </div>
          `,
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
});
