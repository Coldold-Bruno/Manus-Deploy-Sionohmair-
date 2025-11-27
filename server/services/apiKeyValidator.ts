/**
 * Service de Validation des API Keys
 * 
 * Teste les API keys avant de les enregistrer pour éviter les erreurs
 * de configuration en production.
 */

/**
 * Valider une API key Stripe
 */
export async function validateStripeKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Vérifier le format
    if (!apiKey.startsWith('sk_')) {
      return { valid: false, error: "La clé Stripe doit commencer par 'sk_'" };
    }

    // Tester la clé avec l'API Stripe
    const response = await fetch('https://api.stripe.com/v1/balance', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { valid: false, error: `Erreur Stripe: ${response.statusText}` };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key PayPal
 */
export async function validatePayPalKey(clientId: string, secret: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Tester l'authentification PayPal
    const auth = Buffer.from(`${clientId}:${secret}`).toString('base64');
    
    const response = await fetch('https://api-m.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: 'grant_type=client_credentials',
    });

    if (!response.ok) {
      return { valid: false, error: `Erreur PayPal: ${response.statusText}` };
    }

    const data = await response.json();
    if (!data.access_token) {
      return { valid: false, error: "Impossible d'obtenir un token d'accès PayPal" };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key Google Analytics
 */
export async function validateGoogleAnalyticsKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Tester la clé avec l'API Google Analytics
    const response = await fetch(`https://analyticsreporting.googleapis.com/v4/reports:batchGet?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        reportRequests: [],
      }),
    });

    if (response.status === 403) {
      return { valid: false, error: "Clé API invalide ou permissions insuffisantes" };
    }

    if (response.status === 401) {
      return { valid: false, error: "Clé API non autorisée" };
    }

    // 400 est acceptable (requête vide), cela signifie que la clé est valide
    if (response.status === 400 || response.ok) {
      return { valid: true };
    }

    return { valid: false, error: `Erreur Google Analytics: ${response.statusText}` };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key Google Search (Custom Search)
 */
export async function validateGoogleSearchKey(apiKey: string, cx: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Tester la clé avec une recherche simple
    const response = await fetch(
      `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=test&num=1`
    );

    if (response.status === 403) {
      return { valid: false, error: "Clé API invalide ou quota dépassé" };
    }

    if (response.status === 401) {
      return { valid: false, error: "Clé API non autorisée" };
    }

    if (!response.ok) {
      return { valid: false, error: `Erreur Google Search: ${response.statusText}` };
    }

    const data = await response.json();
    if (data.error) {
      return { valid: false, error: data.error.message };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key SendGrid
 */
export async function validateSendGridKey(apiKey: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Vérifier le format
    if (!apiKey.startsWith('SG.')) {
      return { valid: false, error: "La clé SendGrid doit commencer par 'SG.'" };
    }

    // Tester la clé avec l'API SendGrid
    const response = await fetch('https://api.sendgrid.com/v3/scopes', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
      },
    });

    if (!response.ok) {
      return { valid: false, error: `Erreur SendGrid: ${response.statusText}` };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key Mailgun
 */
export async function validateMailgunKey(apiKey: string, domain: string): Promise<{ valid: boolean; error?: string }> {
  try {
    // Tester la clé avec l'API Mailgun
    const auth = Buffer.from(`api:${apiKey}`).toString('base64');
    
    const response = await fetch(`https://api.mailgun.net/v3/${domain}/stats/total`, {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${auth}`,
      },
    });

    if (!response.ok) {
      return { valid: false, error: `Erreur Mailgun: ${response.statusText}` };
    }

    return { valid: true };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Valider une API key selon la plateforme
 */
export async function validateApiKey(
  platform: string,
  apiKey: string,
  apiSecret?: string | null
): Promise<{ valid: boolean; error?: string }> {
  switch (platform) {
    case 'stripe':
      return validateStripeKey(apiKey);
    
    case 'paypal':
      if (!apiSecret) {
        return { valid: false, error: "PayPal nécessite un Client ID et un Secret" };
      }
      return validatePayPalKey(apiKey, apiSecret);
    
    case 'google_analytics':
      return validateGoogleAnalyticsKey(apiKey);
    
    case 'google_search':
      if (!apiSecret) {
        return { valid: false, error: "Google Search nécessite une API Key et un CX (Custom Search Engine ID)" };
      }
      return validateGoogleSearchKey(apiKey, apiSecret);
    
    case 'sendgrid':
      return validateSendGridKey(apiKey);
    
    case 'mailgun':
      if (!apiSecret) {
        return { valid: false, error: "Mailgun nécessite une API Key et un domaine" };
      }
      return validateMailgunKey(apiKey, apiSecret);
    
    default:
      return { valid: false, error: `Plateforme non supportée: ${platform}` };
  }
}
