// Logger frontend local (fallback Sentry)
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
    console.log(`[${level.toUpperCase()}]`, message);
  },
};
