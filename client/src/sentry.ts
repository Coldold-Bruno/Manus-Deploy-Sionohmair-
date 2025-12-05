import * as Sentry from '@sentry/react';

/**
 * Configuration Sentry pour le client React
 * Monitoring des erreurs et performance en production
 */

// Initialiser Sentry uniquement en production
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    
    // Environnement (production, staging)
    environment: import.meta.env.MODE || 'production',
    
    // Version de l'application (pour tracker les releases)
    release: import.meta.env.VITE_APP_VERSION || 'unknown',
    
    // Taux d'échantillonnage des traces (performance monitoring)
    // 1.0 = 100% des transactions, 0.1 = 10%
    tracesSampleRate: import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE 
      ? parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE) 
      : 0.1,
    
    // Taux d'échantillonnage des replays (session replay)
    // Enregistre 10% des sessions normales et 100% des sessions avec erreur
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    
    // Intégrations
    integrations: [
      // Capture automatique des erreurs React et performance monitoring
      Sentry.browserTracingIntegration(),
      
      // Replay des sessions (pour voir ce que l'utilisateur a fait avant l'erreur)
      Sentry.replayIntegration({
        maskAllText: false, // Masquer le texte sensible
        blockAllMedia: false, // Bloquer les médias
      }),
      
      // Capture des erreurs de console
      Sentry.captureConsoleIntegration({ levels: ['error'] }),
      
      // Breadcrumbs pour les clics
      Sentry.breadcrumbsIntegration({
        console: true,
        dom: true,
        fetch: true,
        history: true,
        xhr: true,
      }),
    ],
    
    // Filtrer les erreurs à ne pas envoyer
    beforeSend(event, hint) {
      // Ne pas envoyer les erreurs de développement
      if (import.meta.env.DEV) {
        return null;
      }
      
      // Filtrer les erreurs connues ou non critiques
      const error = hint.originalException;
      
      // Ignorer les erreurs de réseau temporaires
      if (error && error instanceof Error) {
        if (error.message.includes('Failed to fetch') || 
            error.message.includes('NetworkError')) {
          return null;
        }
      }
      
      // Ignorer les erreurs de scripts tiers
      if (event.exception?.values?.[0]?.stacktrace?.frames) {
        const frames = event.exception.values[0].stacktrace.frames;
        const isThirdParty = frames.some(frame => 
          frame.filename?.includes('googleapis.com') ||
          frame.filename?.includes('stripe.com') ||
          frame.filename?.includes('analytics')
        );
        
        if (isThirdParty) {
          return null;
        }
      }
      
      return event;
    },
    
    // Filtrer les breadcrumbs (historique d'actions)
    beforeBreadcrumb(breadcrumb) {
      // Ne pas enregistrer les requêtes vers des endpoints internes
      if (breadcrumb.category === 'fetch' && breadcrumb.data?.url) {
        if (breadcrumb.data.url.includes('/health') || 
            breadcrumb.data.url.includes('/ping')) {
          return null;
        }
      }
      
      // Ne pas enregistrer les clics sur des éléments sensibles
      if (breadcrumb.category === 'ui.click') {
        const target = breadcrumb.message;
        if (target?.includes('password') || target?.includes('credit-card')) {
          return null;
        }
      }
      
      return breadcrumb;
    },
  });
  
  console.log('✅ Sentry initialisé pour le client');
} else {
  console.log('ℹ️ Sentry désactivé (mode développement ou DSN manquant)');
}

// Exporter Sentry pour utilisation dans l'application
export default Sentry;

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

/**
 * ErrorBoundary React avec Sentry
 * Utiliser dans App.tsx pour capturer les erreurs React
 */
export const SentryErrorBoundary = Sentry.ErrorBoundary;

// Importer React pour l'intégration
import React from 'react';
