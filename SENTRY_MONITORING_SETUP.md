# Guide d'Intégration Sentry
## Monitoring des Erreurs en Production - Sionohmair Insight Academy

---

## 📋 Vue d'ensemble

Ce guide explique comment configurer **Sentry** pour le monitoring des erreurs et de la performance en production sur Sionohmair Insight Academy.

**Fonctionnalités Sentry** :
- ✅ Capture automatique des erreurs (serveur + client)
- ✅ Monitoring de performance (temps de réponse, requêtes lentes)
- ✅ Session Replay (voir ce que l'utilisateur a fait avant l'erreur)
- ✅ Alertes en temps réel (email, Slack, etc.)
- ✅ Analyse des tendances et statistiques
- ✅ Contexte détaillé (utilisateur, navigateur, requêtes, etc.)

**Durée estimée** : 20-30 minutes  
**Prérequis** : Compte Sentry créé (gratuit jusqu'à 5 000 erreurs/mois)

---

## 🎯 Objectifs

1. ✅ Créer un projet Sentry
2. ✅ Configurer le DSN (Data Source Name)
3. ✅ Intégrer Sentry côté serveur (Node.js)
4. ✅ Intégrer Sentry côté client (React)
5. ✅ Configurer les alertes
6. ✅ Tester la capture d'erreurs

---

## 📝 Étape 1 : Création du projet Sentry

### 1.1 Créer un compte Sentry

1. Allez sur https://sentry.io
2. Cliquez sur **Sign Up** (ou **Get Started**)
3. Créez un compte avec votre email professionnel
4. Vérifiez votre email

### 1.2 Créer un projet

1. Une fois connecté, cliquez sur **Create Project**
2. Sélectionnez la plateforme :
   - **Node.js** pour le serveur
   - **React** pour le client
   
   **Recommandation** : Créer **2 projets séparés** :
   - `sionohmair-academy-server` (Node.js)
   - `sionohmair-academy-client` (React)

3. Nommez votre projet : `sionohmair-academy-server`
4. Sélectionnez l'équipe (ou créez-en une)
5. Cliquez sur **Create Project**

### 1.3 Récupérer le DSN

Après la création du projet, Sentry affiche le **DSN** (Data Source Name) :

```
https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o123456.ingest.sentry.io/7891011
```

**IMPORTANT** : Copiez ce DSN, vous en aurez besoin pour la configuration.

Répétez l'opération pour créer le projet client et récupérer son DSN.

---

## 🔑 Étape 2 : Configuration des variables d'environnement

### 2.1 Ajouter les DSN dans l'application

**Via l'interface Manus** :

1. Ouvrez le panneau **Management UI** (à droite)
2. Allez dans **Settings** → **Secrets**
3. Ajoutez les variables suivantes :

```bash
# DSN Sentry pour le serveur
SENTRY_DSN=https://xxxxxxxxxxxxxxxxxxxxxxxxxxxxx@o123456.ingest.sentry.io/7891011

# DSN Sentry pour le client (préfixe VITE_ pour Vite)
VITE_SENTRY_DSN=https://yyyyyyyyyyyyyyyyyyyyyyyyyyy@o123456.ingest.sentry.io/7891012

# Taux d'échantillonnage des traces (optionnel, par défaut 0.1 = 10%)
SENTRY_TRACES_SAMPLE_RATE=0.1
VITE_SENTRY_TRACES_SAMPLE_RATE=0.1

# Taux d'échantillonnage des profils (optionnel, par défaut 0.1 = 10%)
SENTRY_PROFILES_SAMPLE_RATE=0.1

# Version de l'application (optionnel, pour tracker les releases)
APP_VERSION=1.0.0
VITE_APP_VERSION=1.0.0
```

4. Cliquez sur **Save** pour chaque variable

### 2.2 Comprendre les taux d'échantillonnage

**Traces Sample Rate** : Pourcentage de transactions à monitorer pour la performance
- `1.0` = 100% (toutes les requêtes sont monitorées)
- `0.1` = 10% (1 requête sur 10 est monitorée)
- `0.01` = 1% (1 requête sur 100 est monitorée)

**Recommandation** :
- **Développement** : 1.0 (100%)
- **Production faible trafic** : 0.5 (50%)
- **Production fort trafic** : 0.1 (10%) ou moins

---

## 🖥️ Étape 3 : Intégration côté serveur (Node.js)

### 3.1 Fichier de configuration créé

Le fichier `server/sentry.ts` a été créé avec la configuration suivante :

```typescript
import * as Sentry from '@sentry/node';

// Initialisation automatique en production
if (process.env.NODE_ENV === 'production' && process.env.SENTRY_DSN) {
  Sentry.init({
    dsn: process.env.SENTRY_DSN,
    environment: process.env.NODE_ENV,
    release: process.env.APP_VERSION,
    tracesSampleRate: 0.1,
    // ... autres options
  });
}
```

### 3.2 Intégrer Sentry dans le serveur Express

**Modifier `server/index.ts`** :

```typescript
import express from 'express';
import * as Sentry from '@sentry/node';
import './sentry'; // Importer la configuration Sentry

const app = express();

// 1. Ajouter le middleware Sentry AVANT tous les autres middlewares
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());

// ... vos middlewares habituels (body-parser, cors, etc.)

// ... vos routes

// 2. Ajouter le middleware d'erreur Sentry APRÈS toutes les routes
app.use(Sentry.Handlers.errorHandler());

// 3. Votre gestionnaire d'erreur personnalisé (optionnel)
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});
```

### 3.3 Capturer des erreurs manuellement

Dans vos routes ou fonctions :

```typescript
import { captureError, captureMessage } from './sentry';

// Capturer une erreur
try {
  // Code qui peut échouer
  await riskyOperation();
} catch (error) {
  captureError(error as Error, {
    context: 'Payment processing',
    userId: user.id,
  });
  throw error;
}

// Capturer un message
captureMessage('Payment processed successfully', 'info');
```

---

## 🌐 Étape 4 : Intégration côté client (React)

### 4.1 Fichier de configuration créé

Le fichier `client/src/sentry.ts` a été créé avec la configuration suivante :

```typescript
import * as Sentry from '@sentry/react';

// Initialisation automatique en production
if (import.meta.env.PROD && import.meta.env.VITE_SENTRY_DSN) {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.MODE,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: 0.1,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    // ... autres options
  });
}
```

### 4.2 Intégrer Sentry dans l'application React

**Modifier `client/src/main.tsx`** :

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './sentry'; // Importer la configuration Sentry AVANT App

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### 4.3 Ajouter un ErrorBoundary

**Modifier `client/src/App.tsx`** :

```typescript
import { SentryErrorBoundary } from './sentry';

function App() {
  return (
    <SentryErrorBoundary
      fallback={({ error, resetError }) => (
        <div>
          <h1>Une erreur est survenue</h1>
          <p>{error.message}</p>
          <button onClick={resetError}>Réessayer</button>
        </div>
      )}
      showDialog
    >
      {/* Votre application */}
      <ThemeProvider>
        <Router />
      </ThemeProvider>
    </SentryErrorBoundary>
  );
}
```

### 4.4 Capturer des erreurs manuellement

Dans vos composants ou fonctions :

```typescript
import { captureError, captureMessage, setUser } from '@/sentry';

// Capturer une erreur
try {
  // Code qui peut échouer
  await fetchData();
} catch (error) {
  captureError(error as Error, {
    component: 'Dashboard',
    action: 'fetchOrders',
  });
}

// Capturer un message
captureMessage('User completed checkout', 'info');

// Définir l'utilisateur connecté
setUser({
  id: user.id,
  email: user.email,
  username: user.name,
});
```

---

## 🧪 Étape 5 : Tester l'intégration

### 5.1 Tester côté serveur

Créer une route de test dans `server/index.ts` :

```typescript
app.get('/api/test-sentry', (req, res) => {
  throw new Error('Test Sentry Server Error');
});
```

Accéder à `http://localhost:3000/api/test-sentry` et vérifier que l'erreur apparaît dans Sentry.

### 5.2 Tester côté client

Créer un bouton de test dans un composant :

```typescript
<button onClick={() => {
  throw new Error('Test Sentry Client Error');
}}>
  Tester Sentry
</button>
```

Cliquer sur le bouton et vérifier que l'erreur apparaît dans Sentry.

### 5.3 Vérifier dans le Dashboard Sentry

1. Allez sur https://sentry.io
2. Sélectionnez votre projet
3. Allez dans **Issues** → Vous devriez voir les erreurs de test
4. Cliquez sur une erreur pour voir les détails :
   - Stack trace complète
   - Contexte utilisateur
   - Breadcrumbs (historique d'actions)
   - Variables locales
   - Environnement (navigateur, OS, etc.)

---

## 🔔 Étape 6 : Configuration des alertes

### 6.1 Alertes par email

1. Dans le Dashboard Sentry, allez dans **Settings** → **Alerts**
2. Cliquez sur **Create Alert Rule**
3. Sélectionnez **Issues**
4. Configurez les conditions :
   - **When** : An issue is first seen
   - **Then** : Send a notification to **Email**
5. Ajoutez votre email
6. Cliquez sur **Save Rule**

### 6.2 Alertes Slack (optionnel)

1. Allez dans **Settings** → **Integrations**
2. Cherchez **Slack** et cliquez sur **Install**
3. Autorisez Sentry à accéder à votre workspace Slack
4. Sélectionnez le canal où envoyer les alertes (ex: `#alerts`)
5. Créez une règle d'alerte comme ci-dessus, mais choisissez **Slack** au lieu d'Email

### 6.3 Alertes personnalisées

Exemples de règles d'alerte utiles :

**Alerte sur taux d'erreur élevé** :
- **When** : The issue is seen more than **100 times** in **1 hour**
- **Then** : Send a notification to **Slack #critical-alerts**

**Alerte sur nouvelle erreur** :
- **When** : An issue is first seen
- **Then** : Send a notification to **Email** and **Slack**

**Alerte sur erreur récurrente** :
- **When** : The issue has happened at least **10 times**
- **Then** : Send a notification to **Slack #dev-team**

---

## 📊 Étape 7 : Monitoring et analyse

### 7.1 Dashboard Sentry

Le Dashboard Sentry affiche :

- **Issues** : Liste des erreurs capturées
- **Performance** : Temps de réponse des requêtes
- **Releases** : Suivi des versions déployées
- **Replays** : Enregistrements de sessions utilisateur

### 7.2 Métriques importantes

**Taux d'erreur** :
- Nombre d'erreurs / Nombre de requêtes
- Objectif : < 0.1% (1 erreur pour 1000 requêtes)

**Temps de réponse** :
- P50 (médiane) : < 200ms
- P95 : < 500ms
- P99 : < 1000ms

**Erreurs critiques** :
- Erreurs de paiement : 0
- Erreurs de base de données : < 5/jour
- Erreurs 500 : < 10/jour

### 7.3 Analyse des tendances

1. Allez dans **Stats** pour voir les tendances
2. Filtrez par :
   - **Environnement** (production, staging)
   - **Release** (version de l'application)
   - **Utilisateur** (erreurs par utilisateur)
   - **Navigateur** (erreurs par navigateur)

---

## 🔒 Sécurité et confidentialité

### 8.1 Données sensibles

**Par défaut, Sentry filtre** :
- ✅ Mots de passe (champs `password`, `passwd`, etc.)
- ✅ Cartes bancaires (détectées automatiquement)
- ✅ Tokens d'authentification (headers `Authorization`)

**Configuration supplémentaire** :

Dans `client/src/sentry.ts` et `server/sentry.ts`, ajoutez :

```typescript
beforeSend(event) {
  // Supprimer les données sensibles
  if (event.request?.headers) {
    delete event.request.headers['Authorization'];
    delete event.request.headers['Cookie'];
  }
  
  // Masquer les emails dans les messages d'erreur
  if (event.message) {
    event.message = event.message.replace(/[\w.-]+@[\w.-]+\.\w+/g, '[EMAIL]');
  }
  
  return event;
}
```

### 8.2 Session Replay

Le Session Replay enregistre les actions de l'utilisateur avant une erreur.

**Configuration de confidentialité** :

```typescript
Sentry.replayIntegration({
  maskAllText: true,        // Masquer tout le texte
  blockAllMedia: true,      // Bloquer les images/vidéos
  maskAllInputs: true,      // Masquer les champs de formulaire
})
```

**Recommandation** :
- Activer le masquage en production
- Désactiver en staging pour faciliter le debug

---

## 🚀 Releases et Source Maps

### 9.1 Créer une release

Les releases permettent de tracker les erreurs par version de l'application.

**Créer une release manuellement** :

```bash
# Installer Sentry CLI
npm install -g @sentry/cli

# Se connecter
sentry-cli login

# Créer une release
sentry-cli releases new 1.0.0

# Uploader les source maps (pour React)
sentry-cli releases files 1.0.0 upload-sourcemaps ./dist

# Finaliser la release
sentry-cli releases finalize 1.0.0
```

### 9.2 Automatiser avec CI/CD

**GitHub Actions** (`.github/workflows/deploy.yml`) :

```yaml
- name: Create Sentry release
  env:
    SENTRY_AUTH_TOKEN: ${{ secrets.SENTRY_AUTH_TOKEN }}
    SENTRY_ORG: your-org
    SENTRY_PROJECT: sionohmair-academy-client
  run: |
    npm install -g @sentry/cli
    sentry-cli releases new ${{ github.sha }}
    sentry-cli releases files ${{ github.sha }} upload-sourcemaps ./dist
    sentry-cli releases finalize ${{ github.sha }}
```

---

## 🛠️ Dépannage

### Problème : Sentry ne capture pas les erreurs

**Solutions** :

1. ✅ Vérifier que `SENTRY_DSN` et `VITE_SENTRY_DSN` sont configurés
2. ✅ Vérifier que `NODE_ENV=production` (Sentry est désactivé en dev)
3. ✅ Vérifier que `import './sentry'` est appelé AVANT l'application
4. ✅ Vérifier les logs console : "✅ Sentry initialisé"
5. ✅ Tester avec une erreur manuelle (voir Étape 5)

### Problème : Trop d'erreurs capturées

**Solutions** :

1. ✅ Filtrer les erreurs non critiques dans `beforeSend`
2. ✅ Ignorer les erreurs de bots/crawlers
3. ✅ Ignorer les erreurs 404
4. ✅ Réduire le taux d'échantillonnage

### Problème : Session Replay ne fonctionne pas

**Solutions** :

1. ✅ Vérifier que `replaysSessionSampleRate` > 0
2. ✅ Vérifier que le plan Sentry inclut Session Replay (payant)
3. ✅ Vérifier que le navigateur supporte Session Replay (Chrome, Firefox, Safari)

---

## 📈 Plan Sentry gratuit vs payant

### Plan gratuit (Developer)

- ✅ 5 000 erreurs/mois
- ✅ 10 000 transactions de performance/mois
- ✅ 1 projet
- ✅ 30 jours de rétention
- ❌ Pas de Session Replay
- ❌ Pas de support prioritaire

### Plan payant (Team)

- ✅ 50 000 erreurs/mois (à partir de 26$/mois)
- ✅ 100 000 transactions/mois
- ✅ Projets illimités
- ✅ 90 jours de rétention
- ✅ Session Replay (50 replays/mois)
- ✅ Support prioritaire

**Recommandation** :
- Commencer avec le plan gratuit
- Passer au plan payant quand le trafic augmente

---

## ✅ Checklist de validation

Avant de passer en production, vérifier :

- [ ] Compte Sentry créé
- [ ] 2 projets créés (serveur + client)
- [ ] DSN configurés dans les variables d'environnement
- [ ] Sentry intégré côté serveur (`server/sentry.ts`)
- [ ] Middlewares Express ajoutés (`server/index.ts`)
- [ ] Sentry intégré côté client (`client/src/sentry.ts`)
- [ ] Import dans `main.tsx` avant l'application
- [ ] ErrorBoundary ajouté dans `App.tsx`
- [ ] Tests d'erreur réussis (serveur + client)
- [ ] Erreurs visibles dans le Dashboard Sentry
- [ ] Alertes configurées (email ou Slack)
- [ ] Données sensibles filtrées
- [ ] Taux d'échantillonnage configuré
- [ ] Documentation lue et comprise

---

## 📚 Ressources supplémentaires

**Documentation Sentry** :
- [Guide officiel](https://docs.sentry.io/)
- [Node.js Integration](https://docs.sentry.io/platforms/node/)
- [React Integration](https://docs.sentry.io/platforms/javascript/guides/react/)
- [Best Practices](https://docs.sentry.io/product/best-practices/)

**Tutoriels** :
- [Sentry for Beginners](https://sentry.io/for/beginners/)
- [Error Monitoring 101](https://blog.sentry.io/error-monitoring-101/)

**Support** :
- Dashboard Sentry : https://sentry.io
- Support Sentry : https://sentry.io/support/
- Community Forum : https://forum.sentry.io/

---

**Date de création** : Décembre 2025  
**Version** : 1.0  
**Auteur** : Sionohmair Insight Academy
