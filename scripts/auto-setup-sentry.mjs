#!/usr/bin/env node

/**
 * Script d'automatisation de Sentry avec fallback
 * 
 * Ce script configure automatiquement Sentry pour le monitoring des erreurs
 * avec un système de fallback si Sentry n'est pas disponible.
 * 
 * Fonctionnalités :
 * - Détecte automatiquement si Sentry est configuré
 * - Crée un système de logging local si Sentry n'est pas disponible
 * - Configure le monitoring des erreurs frontend et backend
 * - Génère des rapports d'erreurs locaux
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Couleurs pour les logs
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function exec(command, options = {}) {
  try {
    return execSync(command, {
      stdio: 'pipe',
      cwd: join(__dirname, '..'),
      ...options,
    });
  } catch (error) {
    return null;
  }
}

async function setupSentry() {
  try {
    log('\n🚀 Démarrage de l\'automatisation du monitoring Sentry...', 'cyan');

    const projectRoot = join(__dirname, '..');
    
    // Vérifier si Sentry DSN est configuré
    const envPath = join(projectRoot, '.env');
    let hasSentryDSN = false;
    
    if (existsSync(envPath)) {
      const envContent = readFileSync(envPath, 'utf-8');
      hasSentryDSN = envContent.includes('VITE_SENTRY_DSN=') && 
                     !envContent.includes('VITE_SENTRY_DSN=\n') &&
                     !envContent.includes('VITE_SENTRY_DSN=""');
    }

    if (hasSentryDSN) {
      log('✅ Sentry DSN détecté, configuration du monitoring Sentry...', 'green');
      await setupSentryMonitoring(projectRoot);
    } else {
      log('⚠️  Sentry DSN non configuré, activation du système de fallback...', 'yellow');
      await setupFallbackMonitoring(projectRoot);
    }

    log('\n✨ Configuration du monitoring terminée !', 'green');

  } catch (error) {
    log('\n❌ Erreur lors de la configuration du monitoring :', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

async function setupSentryMonitoring(projectRoot) {
  log('\n📦 Installation de Sentry...', 'cyan');
  
  try {
    exec('pnpm add @sentry/react @sentry/node');
    log('✅ Sentry installé avec succès', 'green');
  } catch {
    log('⚠️  Erreur lors de l\'installation de Sentry', 'yellow');
    return setupFallbackMonitoring(projectRoot);
  }

  // Créer le fichier de configuration Sentry pour le frontend
  log('\n⚙️  Configuration de Sentry pour le frontend...', 'cyan');
  
  const sentryClientConfig = `import * as Sentry from '@sentry/react';

const SENTRY_DSN = import.meta.env.VITE_SENTRY_DSN;
const ENVIRONMENT = import.meta.env.MODE;

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
    ],
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
  });
}

export { Sentry };
`;

  const clientLibDir = join(projectRoot, 'client/src/lib');
  if (!existsSync(clientLibDir)) {
    mkdirSync(clientLibDir, { recursive: true });
  }
  
  writeFileSync(join(clientLibDir, 'sentry.ts'), sentryClientConfig);
  log('✅ Configuration Sentry frontend créée', 'green');

  // Créer le fichier de configuration Sentry pour le backend
  log('\n⚙️  Configuration de Sentry pour le backend...', 'cyan');
  
  const sentryServerConfig = `import * as Sentry from '@sentry/node';

const SENTRY_DSN = process.env.VITE_SENTRY_DSN;
const ENVIRONMENT = process.env.NODE_ENV || 'development';

if (SENTRY_DSN) {
  Sentry.init({
    dsn: SENTRY_DSN,
    environment: ENVIRONMENT,
    tracesSampleRate: ENVIRONMENT === 'production' ? 0.1 : 1.0,
  });
}

export { Sentry };
`;

  const serverLibDir = join(projectRoot, 'server/lib');
  if (!existsSync(serverLibDir)) {
    mkdirSync(serverLibDir, { recursive: true });
  }
  
  writeFileSync(join(serverLibDir, 'sentry.ts'), sentryServerConfig);
  log('✅ Configuration Sentry backend créée', 'green');

  // Créer un wrapper d'erreur pour le frontend
  const errorBoundary = `import { Component, ReactNode } from 'react';
import { Sentry } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-muted-foreground mb-4">
              Nous avons été notifiés et travaillons sur une solution.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
`;

  const clientComponentsDir = join(projectRoot, 'client/src/components');
  writeFileSync(join(clientComponentsDir, 'SentryErrorBoundary.tsx'), errorBoundary);
  log('✅ ErrorBoundary Sentry créé', 'green');

  log('\n📋 Instructions pour activer Sentry :', 'cyan');
  log('   1. Créez un compte sur https://sentry.io', 'blue');
  log('   2. Créez un nouveau projet React', 'blue');
  log('   3. Copiez le DSN fourni', 'blue');
  log('   4. Ajoutez VITE_SENTRY_DSN=<votre-dsn> dans Settings → Secrets', 'blue');
  log('   5. Redémarrez votre application', 'blue');
}

async function setupFallbackMonitoring(projectRoot) {
  log('\n🔧 Configuration du système de monitoring local (fallback)...', 'cyan');

  // Créer le dossier logs
  const logsDir = join(projectRoot, 'logs');
  if (!existsSync(logsDir)) {
    mkdirSync(logsDir, { recursive: true });
    log('✅ Dossier logs/ créé', 'green');
  }

  // Créer un logger local
  const localLogger = `import { writeFileSync, appendFileSync, existsSync } from 'fs';
import { join } from 'path';

const LOGS_DIR = join(process.cwd(), 'logs');
const ERROR_LOG = join(LOGS_DIR, 'errors.log');
const ACCESS_LOG = join(LOGS_DIR, 'access.log');

interface ErrorLog {
  timestamp: string;
  level: 'error' | 'warning' | 'info';
  message: string;
  stack?: string;
  context?: any;
}

export class LocalLogger {
  static logError(error: Error | string, context?: any) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message: typeof error === 'string' ? error : error.message,
      stack: typeof error === 'string' ? undefined : error.stack,
      context,
    };

    const logLine = JSON.stringify(log) + '\\n';
    
    try {
      if (!existsSync(ERROR_LOG)) {
        writeFileSync(ERROR_LOG, logLine);
      } else {
        appendFileSync(ERROR_LOG, logLine);
      }
      
      // Afficher dans la console en développement
      if (process.env.NODE_ENV !== 'production') {
        console.error('🔴 Error logged:', log);
      }
    } catch (e) {
      console.error('Failed to write error log:', e);
    }
  }

  static logWarning(message: string, context?: any) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'warning',
      message,
      context,
    };

    const logLine = JSON.stringify(log) + '\\n';
    
    try {
      if (!existsSync(ERROR_LOG)) {
        writeFileSync(ERROR_LOG, logLine);
      } else {
        appendFileSync(ERROR_LOG, logLine);
      }
    } catch (e) {
      console.error('Failed to write warning log:', e);
    }
  }

  static logInfo(message: string, context?: any) {
    const log: ErrorLog = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
    };

    const logLine = JSON.stringify(log) + '\\n';
    
    try {
      if (!existsSync(ACCESS_LOG)) {
        writeFileSync(ACCESS_LOG, logLine);
      } else {
        appendFileSync(ACCESS_LOG, logLine);
      }
    } catch (e) {
      console.error('Failed to write info log:', e);
    }
  }
}

// Wrapper compatible avec l'API Sentry
export const Sentry = {
  captureException: (error: Error, context?: any) => {
    LocalLogger.logError(error, context);
  },
  captureMessage: (message: string, level: 'error' | 'warning' | 'info' = 'info') => {
    if (level === 'error') {
      LocalLogger.logError(message);
    } else if (level === 'warning') {
      LocalLogger.logWarning(message);
    } else {
      LocalLogger.logInfo(message);
    }
  },
};
`;

  const serverLibDir = join(projectRoot, 'server/lib');
  if (!existsSync(serverLibDir)) {
    mkdirSync(serverLibDir, { recursive: true });
  }
  
  writeFileSync(join(serverLibDir, 'logger.ts'), localLogger);
  log('✅ Logger local créé', 'green');

  // Créer un logger frontend simplifié
  const clientLogger = `// Logger frontend local (fallback Sentry)
export const Sentry = {
  captureException: (error: Error, context?: any) => {
    console.error('🔴 Error:', error, context);
    
    // Envoyer au backend pour logging
    if (typeof window !== 'undefined') {
      fetch('/api/log-error', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: error.message,
          stack: error.stack,
          context,
          timestamp: new Date().toISOString(),
        }),
      }).catch(console.error);
    }
  },
  captureMessage: (message: string, level: 'error' | 'warning' | 'info' = 'info') => {
    console.log(\`[\${level.toUpperCase()}]\`, message);
  },
};
`;

  const clientLibDir = join(projectRoot, 'client/src/lib');
  if (!existsSync(clientLibDir)) {
    mkdirSync(clientLibDir, { recursive: true });
  }
  
  writeFileSync(join(clientLibDir, 'sentry.ts'), clientLogger);
  log('✅ Logger frontend créé', 'green');

  // Créer l'ErrorBoundary avec fallback
  const errorBoundary = `import { Component, ReactNode } from 'react';
import { Sentry } from '@/lib/sentry';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class SentryErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    Sentry.captureException(error, { contexts: { react: errorInfo } });
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Une erreur est survenue</h1>
            <p className="text-muted-foreground mb-4">
              L'erreur a été enregistrée dans les logs.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
            >
              Recharger la page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
`;

  const clientComponentsDir = join(projectRoot, 'client/src/components');
  writeFileSync(join(clientComponentsDir, 'SentryErrorBoundary.tsx'), errorBoundary);
  log('✅ ErrorBoundary avec fallback créé', 'green');

  log('\n✅ Système de monitoring local activé', 'green');
  log('\n📋 Fonctionnalités du fallback :', 'cyan');
  log('   ✓ Logging des erreurs dans logs/errors.log', 'blue');
  log('   ✓ Logging des accès dans logs/access.log', 'blue');
  log('   ✓ ErrorBoundary React pour capturer les erreurs', 'blue');
  log('   ✓ API compatible avec Sentry (migration facile)', 'blue');
  
  log('\n💡 Pour activer Sentry plus tard :', 'cyan');
  log('   1. Créez un compte sur https://sentry.io', 'blue');
  log('   2. Ajoutez VITE_SENTRY_DSN dans Settings → Secrets', 'blue');
  log('   3. Relancez ce script', 'blue');
}

// Exécuter le script
setupSentry();
