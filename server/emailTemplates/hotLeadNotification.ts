interface HotLeadNotificationData {
  email: string;
  name?: string;
  leadScore: number;
  engagementScore: number;
  interests: string;
  recentActivities: Array<{
    type: string;
    label: string;
    timestamp: string;
    score: number;
  }>;
  profileUrl: string;
}

export function getHotLeadNotificationEmail(data: HotLeadNotificationData): string {
  const interestLabel = 
    data.interests === 'diagnostic' ? 'Sprint de Clarté (490€)' :
    data.interests === 'formation' ? 'Architecture de l\'Insight (10k€)' :
    data.interests === 'transformation' ? 'Partenariat Stratégique (50k€)' :
    'Général';

  const activitiesHtml = data.recentActivities.map(activity => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
        <strong>${activity.label}</strong>
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; color: #6b7280;">
        ${activity.timestamp}
      </td>
      <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right;">
        <span style="background: #fef3c7; color: #92400e; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: 600;">
          +${activity.score} pts
        </span>
      </td>
    </tr>
  `).join('');

  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>🔥 Nouveau Lead Chaud Détecté !</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f3f4f6; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); overflow: hidden;">
          
          <!-- Header with flame icon -->
          <tr>
            <td style="background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); padding: 40px 30px; text-align: center;">
              <div style="font-size: 64px; margin-bottom: 16px;">🔥</div>
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700;">
                Nouveau Lead Chaud Détecté !
              </h1>
              <p style="margin: 12px 0 0 0; color: #fef3c7; font-size: 16px;">
                Un prospect vient d'atteindre le statut HOT
              </p>
            </td>
          </tr>

          <!-- Score Banner -->
          <tr>
            <td style="background-color: #fef3c7; padding: 24px 30px; text-align: center; border-bottom: 4px solid #f59e0b;">
              <div style="font-size: 48px; font-weight: 800; color: #dc2626; margin-bottom: 8px;">
                ${data.leadScore} points
              </div>
              <div style="font-size: 14px; color: #92400e; font-weight: 600; text-transform: uppercase; letter-spacing: 1px;">
                Score de Lead Total
              </div>
            </td>
          </tr>

          <!-- Lead Information -->
          <tr>
            <td style="padding: 30px;">
              <h2 style="margin: 0 0 20px 0; color: #111827; font-size: 20px; font-weight: 600;">
                Informations du Lead
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 24px;">
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Email :</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right;">
                    <a href="mailto:${data.email}" style="color: #2563eb; text-decoration: none;">
                      ${data.email}
                    </a>
                  </td>
                </tr>
                ${data.name ? `
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Nom :</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                    ${data.name}
                  </td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Intérêt principal :</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                    ${interestLabel}
                  </td>
                </tr>
                <tr>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb;">
                    <strong style="color: #374151;">Engagement Newsletter :</strong>
                  </td>
                  <td style="padding: 12px 0; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280;">
                    ${data.engagementScore}/100
                  </td>
                </tr>
              </table>

              <!-- Recent Activities -->
              <h2 style="margin: 24px 0 16px 0; color: #111827; font-size: 20px; font-weight: 600;">
                Activités Récentes
              </h2>
              
              <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 8px; overflow: hidden;">
                ${activitiesHtml}
              </table>

              <!-- Recommendations -->
              <div style="margin-top: 30px; padding: 20px; background-color: #fef3c7; border-left: 4px solid #f59e0b; border-radius: 4px;">
                <h3 style="margin: 0 0 12px 0; color: #92400e; font-size: 16px; font-weight: 700;">
                  ⚡ Recommandations d'Action
                </h3>
                <ul style="margin: 0; padding-left: 20px; color: #78350f; line-height: 1.8;">
                  <li><strong>Contacter dans les 24h</strong> pour maximiser les chances de conversion</li>
                  <li>Proposer un <strong>appel découverte de 15 minutes</strong></li>
                  <li>Mentionner les pages visitées pour personnaliser l'approche</li>
                  <li>Faire référence aux activités récentes (calculateur, téléchargements)</li>
                </ul>
              </div>

              <!-- CTA Button -->
              <div style="margin-top: 30px; text-align: center;">
                <a href="${data.profileUrl}" style="display: inline-block; background: linear-gradient(135deg, #f59e0b 0%, #dc2626 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 8px; font-weight: 700; font-size: 16px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  📊 Voir le Profil Complet
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9fafb; padding: 24px 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                Cette notification a été générée automatiquement par le système de scoring de leads.
              </p>
              <p style="margin: 8px 0 0 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} Sionohmair Insight Academy - L'Ingénierie du Génie
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

export function getHotLeadNotificationSubject(email: string, score: number): string {
  return `🔥 Lead Chaud Détecté : ${email} (${score} points)`;
}
