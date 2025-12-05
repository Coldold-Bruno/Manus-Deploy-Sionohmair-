import nodemailer from 'nodemailer';
import { ENV } from '../_core/env';

/**
 * Service d'envoi d'emails de parrainage
 * Envoie automatiquement des emails lors de conversions réussies
 */

/**
 * Créer le transporteur nodemailer
 */
function createTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

/**
 * Template d'email de félicitations pour le parrain
 * Envoyé quand un filleul s'abonne
 */
function getReferrerCongratulationsTemplate(
  referrerName: string,
  referredName: string,
  creditDays: number
): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Félicitations ! Vous avez gagné ${creditDays} jours gratuits</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header avec gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 32px; font-weight: 700;">
                🎉 Félicitations !
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 18px;">
                Votre parrainage a été converti
              </p>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Bonjour <strong>${referrerName}</strong>,
              </p>

              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Excellente nouvelle ! <strong>${referredName}</strong> vient de s'abonner à <strong>Sionohmair Insight Academy</strong> grâce à votre lien de parrainage. 🚀
              </p>

              <!-- Bloc de crédit mis en évidence -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F59E0B 0%, #f59e0bcc 100%); border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="color: #ffffff; font-size: 18px; margin: 0 0 10px; font-weight: 600;">
                      🎁 Votre récompense
                    </p>
                    <p style="color: #ffffff; font-size: 42px; font-weight: 700; margin: 0; line-height: 1;">
                      ${creditDays} jours
                    </p>
                    <p style="color: #ffffff; font-size: 16px; margin: 10px 0 0;">
                      d'abonnement gratuit
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Votre crédit a été <strong>automatiquement appliqué</strong> à votre abonnement. Vous pouvez continuer à profiter de tous les avantages de l'Insight Academy sans interruption.
              </p>

              <!-- Statistiques de parrainage -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #0A1929; font-size: 16px; margin: 0 0 15px; font-weight: 600;">
                      💡 Continuez à parrainer !
                    </p>
                    <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 0;">
                      Chaque nouveau filleul qui s'abonne vous rapporte <strong>30 jours gratuits</strong>. Plus vous parrainez, plus vous profitez de l'Academy gratuitement !
                    </p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${ENV.oAuthServerUrl}/referral" style="display: inline-block; background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%); color: #F59E0B; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(10, 25, 41, 0.3);">
                      Voir mes statistiques de parrainage
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
                Merci de faire confiance à <strong>Sionohmair Insight Academy</strong> et de partager notre mission d'excellence en ingénierie du génie. 🙏
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f7fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                <strong>Sionohmair Insight Academy</strong><br>
                L'Ingénierie du Génie
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sionohmair. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Template d'email de bienvenue pour le filleul
 * Envoyé quand un filleul s'abonne via un lien de parrainage
 */
function getReferredWelcomeTemplate(
  referredName: string,
  referrerName: string
): string {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bienvenue à l'Insight Academy !</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden;">
          
          <!-- Header avec gradient -->
          <tr>
            <td style="background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #F59E0B; margin: 0; font-size: 32px; font-weight: 700;">
                🎓 Bienvenue !
              </h1>
              <p style="color: #ffffff; margin: 10px 0 0; font-size: 18px;">
                Vous rejoignez l'Insight Academy
              </p>
            </td>
          </tr>

          <!-- Contenu principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Bonjour <strong>${referredName}</strong>,
              </p>

              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 0 0 20px;">
                Félicitations pour votre inscription à <strong>Sionohmair Insight Academy</strong> ! Vous avez été parrainé par <strong>${referrerName}</strong>, qui vous fait confiance pour rejoindre notre communauté d'excellence. 🚀
              </p>

              <!-- Bloc de bienvenue -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background: linear-gradient(135deg, #F59E0B 0%, #f59e0bcc 100%); border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 30px; text-align: center;">
                    <p style="color: #ffffff; font-size: 18px; margin: 0 0 10px; font-weight: 600;">
                      🎁 Vous aussi, parrainez !
                    </p>
                    <p style="color: #ffffff; font-size: 16px; margin: 0; line-height: 1.6;">
                      Invitez vos collègues et gagnez <strong>30 jours gratuits</strong> par filleul qui s'abonne.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color: #0A1929; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Vous avez maintenant accès à tous les outils, formations et ressources de l'Insight Academy pour maîtriser l'ingénierie du génie et transformer vos messages en résultats mesurables.
              </p>

              <!-- Prochaines étapes -->
              <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f4f7fa; border-radius: 8px; margin: 30px 0;">
                <tr>
                  <td style="padding: 25px;">
                    <p style="color: #0A1929; font-size: 16px; margin: 0 0 15px; font-weight: 600;">
                      📋 Vos prochaines étapes
                    </p>
                    <ul style="color: #4b5563; font-size: 14px; line-height: 1.8; margin: 0; padding-left: 20px;">
                      <li>Complétez votre profil dans le dashboard</li>
                      <li>Explorez les formations disponibles</li>
                      <li>Commencez par le <strong>Sprint de Clarté</strong></li>
                      <li>Partagez votre lien de parrainage unique</li>
                    </ul>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin: 30px 0;">
                <tr>
                  <td align="center">
                    <a href="${ENV.oAuthServerUrl}/dashboard" style="display: inline-block; background: linear-gradient(135deg, #0A1929 0%, #1e3a5f 100%); color: #F59E0B; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-size: 16px; font-weight: 600; box-shadow: 0 4px 12px rgba(10, 25, 41, 0.3);">
                      Accéder à mon dashboard
                    </a>
                  </td>
                </tr>
              </table>

              <p style="color: #4b5563; font-size: 14px; line-height: 1.6; margin: 30px 0 0;">
                Bienvenue dans la communauté <strong>Sionohmair Insight Academy</strong>. Nous sommes ravis de vous accompagner dans votre parcours d'excellence. 🙏
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f4f7fa; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px;">
                <strong>Sionohmair Insight Academy</strong><br>
                L'Ingénierie du Génie
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                © ${new Date().getFullYear()} Sionohmair. Tous droits réservés.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;
}

/**
 * Envoyer l'email de félicitations au parrain
 */
export async function sendReferrerCongratulationsEmail(
  referrerEmail: string,
  referrerName: string,
  referredName: string,
  creditDays: number
): Promise<void> {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Sionohmair Insight Academy" <${process.env.SMTP_USER}>`,
      to: referrerEmail,
      subject: `🎉 Félicitations ! Vous avez gagné ${creditDays} jours gratuits`,
      html: getReferrerCongratulationsTemplate(referrerName, referredName, creditDays),
    });

    console.log('[Referral Email] Congratulations email sent to referrer:', referrerEmail);
  } catch (error: any) {
    console.error('[Referral Email] Error sending congratulations email:', error);
    throw error;
  }
}

/**
 * Envoyer l'email de bienvenue au filleul
 */
export async function sendReferredWelcomeEmail(
  referredEmail: string,
  referredName: string,
  referrerName: string
): Promise<void> {
  try {
    const transporter = createTransporter();

    await transporter.sendMail({
      from: `"Sionohmair Insight Academy" <${process.env.SMTP_USER}>`,
      to: referredEmail,
      subject: '🎓 Bienvenue à l\'Insight Academy !',
      html: getReferredWelcomeTemplate(referredName, referrerName),
    });

    console.log('[Referral Email] Welcome email sent to referred user:', referredEmail);
  } catch (error: any) {
    console.error('[Referral Email] Error sending welcome email:', error);
    throw error;
  }
}
