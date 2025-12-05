/**
 * Service d'alertes intelligentes pour Slack et Discord
 * Envoie des notifications en temps réel pour les événements critiques
 */

import { ENV } from '../_core/env';

// Types d'événements
export type AlertType = 
  | 'hot_lead'          // Lead chaud détecté (score ≥80)
  | 'payment_failed'    // Paiement échoué
  | 'churn_risk'        // Risque de churn imminent
  | 'new_conversion'    // Nouvelle conversion
  | 'goal_reached'      // Objectif atteint (MRR, abonnés)
  | 'trial_expiring'    // Essai gratuit expire bientôt
  | 'high_value_action' // Action à forte valeur (téléchargement, calculateur)
  | 'system_error';     // Erreur système

// Niveaux de priorité
export type AlertPriority = 'low' | 'medium' | 'high' | 'critical';

// Interface d'une alerte
export interface Alert {
  type: AlertType;
  priority: AlertPriority;
  title: string;
  message: string;
  data?: Record<string, any>;
  timestamp?: Date;
}

// Couleurs Slack/Discord selon la priorité
const PRIORITY_COLORS: Record<AlertPriority, string> = {
  low: '#36a64f',      // Vert
  medium: '#ff9800',   // Orange
  high: '#f44336',     // Rouge
  critical: '#9c27b0'  // Violet
};

// Emojis selon le type d'événement
const EVENT_EMOJIS: Record<AlertType, string> = {
  hot_lead: '🔥',
  payment_failed: '💳',
  churn_risk: '⚠️',
  new_conversion: '🎉',
  goal_reached: '🎯',
  trial_expiring: '⏰',
  high_value_action: '⭐',
  system_error: '🚨'
};

/**
 * Envoyer une alerte vers Slack
 */
export async function sendSlackAlert(alert: Alert): Promise<boolean> {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('[Slack] Webhook URL not configured');
    return false;
  }

  try {
    const emoji = EVENT_EMOJIS[alert.type] || '📢';
    const color = PRIORITY_COLORS[alert.priority];
    
    const payload = {
      text: `${emoji} *${alert.title}*`,
      attachments: [
        {
          color: color,
          text: alert.message,
          fields: alert.data ? Object.entries(alert.data).map(([key, value]) => ({
            title: key,
            value: String(value),
            short: true
          })) : [],
          footer: 'Sionohmair Insight Academy',
          ts: Math.floor((alert.timestamp || new Date()).getTime() / 1000)
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('[Slack] Failed to send alert:', await response.text());
      return false;
    }

    console.log('[Slack] Alert sent successfully:', alert.title);
    return true;
  } catch (error) {
    console.error('[Slack] Error sending alert:', error);
    return false;
  }
}

/**
 * Envoyer une alerte vers Discord
 */
export async function sendDiscordAlert(alert: Alert): Promise<boolean> {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  
  if (!webhookUrl) {
    console.warn('[Discord] Webhook URL not configured');
    return false;
  }

  try {
    const emoji = EVENT_EMOJIS[alert.type] || '📢';
    const color = parseInt(PRIORITY_COLORS[alert.priority].replace('#', ''), 16);
    
    const payload = {
      embeds: [
        {
          title: `${emoji} ${alert.title}`,
          description: alert.message,
          color: color,
          fields: alert.data ? Object.entries(alert.data).map(([key, value]) => ({
            name: key,
            value: String(value),
            inline: true
          })) : [],
          footer: {
            text: 'Sionohmair Insight Academy'
          },
          timestamp: (alert.timestamp || new Date()).toISOString()
        }
      ]
    };

    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      console.error('[Discord] Failed to send alert:', await response.text());
      return false;
    }

    console.log('[Discord] Alert sent successfully:', alert.title);
    return true;
  } catch (error) {
    console.error('[Discord] Error sending alert:', error);
    return false;
  }
}

/**
 * Envoyer une alerte vers toutes les plateformes configurées
 */
export async function sendAlert(alert: Alert): Promise<{ slack: boolean; discord: boolean }> {
  const results = {
    slack: false,
    discord: false
  };

  // Envoyer vers Slack si configuré
  if (process.env.SLACK_WEBHOOK_URL) {
    results.slack = await sendSlackAlert(alert);
  }

  // Envoyer vers Discord si configuré
  if (process.env.DISCORD_WEBHOOK_URL) {
    results.discord = await sendDiscordAlert(alert);
  }

  return results;
}

/**
 * Alertes pré-configurées pour les événements courants
 */

export async function alertHotLead(leadEmail: string, score: number, activities: string[]) {
  return sendAlert({
    type: 'hot_lead',
    priority: 'high',
    title: 'Nouveau Lead Chaud Détecté',
    message: `Un lead vient d'atteindre un score de ${score} points !`,
    data: {
      'Email': leadEmail,
      'Score': score,
      'Dernières activités': activities.slice(0, 3).join(', '),
      'Action': 'Contacter dans les 24h'
    }
  });
}

export async function alertPaymentFailed(customerEmail: string, amount: number, reason: string) {
  return sendAlert({
    type: 'payment_failed',
    priority: 'high',
    title: 'Paiement Échoué',
    message: `Le paiement de ${amount}€ a échoué pour ${customerEmail}`,
    data: {
      'Client': customerEmail,
      'Montant': `${amount}€`,
      'Raison': reason,
      'Action': 'Contacter le client'
    }
  });
}

export async function alertChurnRisk(customerEmail: string, riskScore: number, reason: string) {
  return sendAlert({
    type: 'churn_risk',
    priority: 'medium',
    title: 'Risque de Churn Détecté',
    message: `Client à risque de désabonnement (score: ${riskScore}%)`,
    data: {
      'Client': customerEmail,
      'Risque': `${riskScore}%`,
      'Raison': reason,
      'Action': 'Campagne de rétention'
    }
  });
}

export async function alertNewConversion(customerEmail: string, plan: string, amount: number) {
  return sendAlert({
    type: 'new_conversion',
    priority: 'medium',
    title: 'Nouvelle Conversion ! 🎉',
    message: `${customerEmail} vient de s'abonner au plan ${plan}`,
    data: {
      'Client': customerEmail,
      'Plan': plan,
      'Montant': `${amount}€`,
      'Statut': 'Actif'
    }
  });
}

export async function alertGoalReached(goalName: string, currentValue: number, targetValue: number) {
  return sendAlert({
    type: 'goal_reached',
    priority: 'low',
    title: 'Objectif Atteint ! 🎯',
    message: `L'objectif "${goalName}" a été atteint !`,
    data: {
      'Objectif': goalName,
      'Valeur actuelle': currentValue,
      'Cible': targetValue,
      'Progression': '100%'
    }
  });
}

export async function alertTrialExpiring(customerEmail: string, daysLeft: number) {
  return sendAlert({
    type: 'trial_expiring',
    priority: daysLeft <= 1 ? 'high' : 'medium',
    title: 'Essai Gratuit Expire Bientôt',
    message: `L'essai de ${customerEmail} expire dans ${daysLeft} jour(s)`,
    data: {
      'Client': customerEmail,
      'Jours restants': daysLeft,
      'Action': 'Envoyer email de conversion'
    }
  });
}

export async function alertHighValueAction(userEmail: string, action: string, value: number) {
  return sendAlert({
    type: 'high_value_action',
    priority: 'low',
    title: 'Action à Forte Valeur',
    message: `${userEmail} a effectué une action importante : ${action}`,
    data: {
      'Utilisateur': userEmail,
      'Action': action,
      'Valeur': value,
      'Statut': 'Lead qualifié'
    }
  });
}

export async function alertSystemError(errorMessage: string, context: string) {
  return sendAlert({
    type: 'system_error',
    priority: 'critical',
    title: 'Erreur Système Critique',
    message: errorMessage,
    data: {
      'Contexte': context,
      'Timestamp': new Date().toISOString(),
      'Action': 'Vérifier les logs'
    }
  });
}
