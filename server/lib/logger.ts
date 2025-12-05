import { writeFileSync, appendFileSync, existsSync } from 'fs';
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

    const logLine = JSON.stringify(log) + '\n';
    
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

    const logLine = JSON.stringify(log) + '\n';
    
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

    const logLine = JSON.stringify(log) + '\n';
    
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
