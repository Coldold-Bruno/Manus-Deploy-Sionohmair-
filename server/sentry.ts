import * as Sentry from '@sentry/node';

/**
 * Configuration Sentry pour le serveur Node.js
 * Monitoring des erreurs et performance en production
 */

// Initialiser Sentry uniquement en production
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    
    // Environnement (production, staging, development)
    environment: process.env.NODE_ENV || 'development',
    
    // Version de l'application (pour tracker les releases)
    release: process.env.APP_VERSION || 'unknown',
    
    // Taux d'échantillonnage des traces (performance monitoring)
    // 1.0 = 100% des transactions, 0.1 = 10%
    tracesSampleRate: process.env.SENTRY_TRACES_SAMPLE_RATE 
      ? parseFloat(process.env.SENTRY_TRACES_SAMPLE_RATE) 
      : 0.1,
    
    // Profiling (optionnel, pour analyse de performance détaillée)
    profilesSampleRate: process.env.SENTRY_PROFILES_SAMPLE_RATE
      ? parseFloat(process.env.SENTRY_PROFILES_SAMPLE_RATE)
      : 0.1,
    
    // Intégrations
    integrations: [
      // Capture automatique des erreurs non gérées
      Sentry.captureConsoleIntegration({ levels: ['error', 'warn'] }),
      
      // Capture des requêtes HTTP
      Sentry.httpIntegration(),
      
      // Capture des requêtes Express
      Sentry.expressIntegration(),
    ],
    
    // Filtrer les erreurs à ne pas envoyer
    beforeSend(event, hint) {
      // Ne pas envoyer les erreurs de développement
      if (process.env.NODE_ENV !== 'production') {
        return null;
      }
      
      // Filtrer les erreurs connues ou non critiques
      const error = hint.originalException;
      
      // Ignorer les erreurs 404
      if (error && typeof error === 'object' && 'status' in error) {
        if ((error as any).status === 404) {
          return null;
        }
      }
      
      // Ignorer les erreurs de bot/crawler
      const userAgent = event.request?.headers?.['user-agent'];
      if (userAgent && /bot|crawler|spider/i.test(userAgent)) {
        return null;
      }
      
      return event;
    },
    
    // Filtrer les breadcrumbs (historique d'actions)
    beforeBreadcrumb(breadcrumb) {
      // Ne pas enregistrer les requêtes vers des endpoints internes
      if (breadcrumb.category === 'http' && breadcrumb.data?.url) {
        if (breadcrumb.data.url.includes('/health') || breadcrumb.data.url.includes('/ping')) {
          return null;
        }
      }
      
      return breadcrumb;
    },
  });
  
  console.log('✅ Sentry initialisé pour le serveur');
} else {
  console.log('ℹ️ Sentry désactivé (mode développement ou DSN manquant)');
}

// Exporter Sentry pour utilisation dans l'application
export default Sentry;

/**
 * Middleware Express pour capturer les erreurs
 * À utiliser dans server/index.ts
 * Note: Ces middlewares doivent être importés directement depuis @sentry/node
 */

/**
 * Capturer une erreur manuellement
 */
export function captureError(error: Error, context?: Record<string, any>) {
  Sentry.captureException(error, {
    extra: context,
  });
}

/**
 * Capturer un message manuellement
 */
export function captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info') {
  Sentry.captureMessage(message, level);
}

/**
 * Ajouter un contexte utilisateur
 */
export function setUser(user: { id: string; email?: string; username?: string }) {
  Sentry.setUser(user);
}

/**
 * Ajouter des tags personnalisés
 */
export function setTag(key: string, value: string) {
  Sentry.setTag(key, value);
}

/**
 * Ajouter un contexte personnalisé
 */
export function setContext(name: string, context: Record<string, any>) {
  Sentry.setContext(name, context);
}
