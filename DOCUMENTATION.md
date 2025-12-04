# Documentation Complète - Sionohmair Insight Academy

**Version:** 1.0.0  
**Date:** 4 décembre 2025  
**Auteur:** Manus AI

---

## Table des Matières

1. [Introduction](#introduction)
2. [Architecture Technique](#architecture-technique)
3. [Configuration Stripe](#configuration-stripe)
4. [Système Premium](#système-premium)
5. [Gestion des Quotas](#gestion-des-quotas)
6. [Outils IA Disponibles](#outils-ia-disponibles)
7. [Administration](#administration)
8. [Déploiement](#déploiement)
9. [Maintenance](#maintenance)
10. [Dépannage](#dépannage)

---

## Introduction

**Sionohmair Insight Academy** est une plateforme complète de copywriting et d'analyse de contenu basée sur l'IA, développée selon la méthodologie PFPMA (Problème, Formule, Preuve, Méthode, Appel). Cette plateforme offre un ensemble d'outils professionnels pour améliorer la clarté et l'efficacité des messages commerciaux.

### Objectifs de la Plateforme

La plateforme vise à transformer la manière dont les professionnels créent et optimisent leurs contenus marketing en fournissant des outils d'analyse et de génération alimentés par l'intelligence artificielle. Elle s'adresse aux copywriters, marketeurs, entrepreneurs et consultants qui cherchent à maximiser l'impact de leurs messages.

### Modèle Économique

Le modèle freemium permet aux utilisateurs de découvrir les outils avec des quotas mensuels gratuits, puis de passer à un abonnement Premium (29€/mois) pour un accès illimité. Cette approche favorise l'adoption tout en générant des revenus récurrents prévisibles.

---

## Architecture Technique

### Stack Technologique

L'application repose sur une architecture moderne et performante qui garantit une expérience utilisateur fluide et une maintenance simplifiée.

**Frontend:**
- **React 19** avec TypeScript pour une interface utilisateur réactive et type-safe
- **Tailwind CSS 4** pour un design system cohérent et personnalisable
- **shadcn/ui** pour des composants UI modernes et accessibles
- **Wouter** pour le routing côté client, léger et performant
- **tRPC** pour une communication type-safe avec le backend

**Backend:**
- **Node.js 22** avec TypeScript pour la logique métier
- **Express** comme serveur HTTP
- **tRPC** pour l'API type-safe entre frontend et backend
- **Drizzle ORM** pour la gestion de la base de données MySQL
- **Stripe** pour les paiements et abonnements

**Infrastructure:**
- **MySQL** pour le stockage des données relationnelles
- **AWS S3** pour le stockage des fichiers et artefacts
- **Nodemailer** pour l'envoi d'emails transactionnels
- **Manus OAuth** pour l'authentification sécurisée

### Structure du Projet

La structure du projet suit les meilleures pratiques de séparation des préoccupations, facilitant la maintenance et l'évolution du code.

```
sionohmair-insight-academy/
├── client/                 # Application React frontend
│   ├── src/
│   │   ├── pages/         # Pages de l'application
│   │   ├── components/    # Composants réutilisables
│   │   ├── hooks/         # Hooks React personnalisés
│   │   ├── lib/           # Utilitaires et helpers
│   │   └── App.tsx        # Point d'entrée et routing
│   └── public/            # Assets statiques
├── server/                # Backend Node.js
│   ├── routes/            # Routes tRPC
│   ├── lib/               # Logique métier
│   ├── db.ts              # Configuration base de données
│   └── emailService.ts    # Service d'envoi d'emails
├── drizzle/               # Schéma et migrations DB
│   └── schema.ts          # Définition des tables
└── shared/                # Code partagé frontend/backend
    └── const.ts           # Constantes globales
```

Cette organisation modulaire permet une collaboration efficace entre développeurs et facilite l'ajout de nouvelles fonctionnalités sans impacter le code existant.

---

## Configuration Stripe

### Prérequis

Avant de configurer Stripe, vous devez disposer d'un compte Stripe actif. Si vous n'en avez pas encore, créez-en un sur [stripe.com](https://stripe.com).

### Étape 1 : Récupération des Clés API

Les clés API Stripe sont essentielles pour connecter votre application au système de paiement. Stripe fournit deux environnements distincts pour séparer les tests du mode production.

**Mode Test (Développement):**

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Activez le mode "Test" (toggle en haut à droite)
3. Naviguez vers **Développeurs** → **Clés API**
4. Copiez la **Clé publiable** (commence par `pk_test_`)
5. Copiez la **Clé secrète** (commence par `sk_test_`)

**Mode Production:**

1. Dans le Dashboard Stripe, désactivez le mode "Test"
2. Naviguez vers **Développeurs** → **Clés API**
3. Copiez la **Clé publiable** (commence par `pk_live_`)
4. Copiez la **Clé secrète** (commence par `sk_live_`)

### Étape 2 : Configuration des Variables d'Environnement

Les clés API doivent être configurées dans l'interface de gestion Manus pour garantir leur sécurité et leur accessibilité par l'application.

1. Ouvrez l'interface de gestion du projet (icône en haut à droite)
2. Cliquez sur **Settings** → **Secrets**
3. Ajoutez ou modifiez les variables suivantes :

| Variable | Valeur | Description |
|----------|--------|-------------|
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` ou `pk_live_...` | Clé publique Stripe (frontend) |
| `STRIPE_SECRET_KEY` | `sk_test_...` ou `sk_live_...` | Clé secrète Stripe (backend) |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Secret du webhook Stripe |

**⚠️ Sécurité:** Ne partagez jamais vos clés secrètes Stripe. Elles donnent un accès complet à votre compte de paiement.

### Étape 3 : Création du Produit Premium

Le produit Premium doit être créé dans Stripe pour permettre les abonnements récurrents.

1. Dans le Dashboard Stripe, allez dans **Produits**
2. Cliquez sur **+ Ajouter un produit**
3. Remplissez les informations :
   - **Nom:** Sionohmair Insight Academy - Premium
   - **Description:** Accès illimité à tous les outils de copywriting IA
   - **Prix:** 29,00 EUR
   - **Facturation:** Récurrente - Mensuelle
4. Cliquez sur **Enregistrer le produit**
5. Copiez l'**ID du prix** (commence par `price_`)

### Étape 4 : Configuration du Webhook

Les webhooks Stripe permettent à votre application de recevoir des notifications en temps réel sur les événements de paiement (paiement réussi, abonnement annulé, etc.).

1. Dans le Dashboard Stripe, allez dans **Développeurs** → **Webhooks**
2. Cliquez sur **+ Ajouter un point de terminaison**
3. Configurez le webhook :
   - **URL du point de terminaison:** `https://votre-domaine.manus.space/api/stripe/webhook`
   - **Description:** Webhook Sionohmair Insight Academy
   - **Événements à écouter:** Sélectionnez les événements suivants :
     - `checkout.session.completed`
     - `customer.subscription.created`
     - `customer.subscription.updated`
     - `customer.subscription.deleted`
     - `invoice.payment_succeeded`
     - `invoice.payment_failed`
4. Cliquez sur **Ajouter un point de terminaison**
5. Copiez le **Secret de signature** (commence par `whsec_`)
6. Ajoutez ce secret dans **Settings** → **Secrets** sous le nom `STRIPE_WEBHOOK_SECRET`

### Étape 5 : Test de la Configuration

Avant de passer en production, il est crucial de tester l'intégralité du flux de paiement en mode test.

**Cartes de Test Stripe:**

| Numéro de Carte | Résultat |
|-----------------|----------|
| `4242 4242 4242 4242` | Paiement réussi |
| `4000 0000 0000 0002` | Paiement refusé |
| `4000 0000 0000 9995` | Paiement nécessitant une authentification 3D Secure |

**Procédure de Test:**

1. Connectez-vous à votre application en mode test
2. Accédez à la page **/premium**
3. Cliquez sur **Passer à Premium**
4. Utilisez la carte `4242 4242 4242 4242` avec :
   - **Date d'expiration:** N'importe quelle date future (ex: 12/34)
   - **CVC:** N'importe quel code à 3 chiffres (ex: 123)
   - **Code postal:** N'importe quel code postal valide
5. Complétez le paiement
6. Vérifiez que vous êtes redirigé vers **/premium** avec le statut Premium actif
7. Vérifiez dans le Dashboard Stripe que le paiement apparaît dans **Paiements**
8. Vérifiez que le webhook a été reçu dans **Développeurs** → **Webhooks** → **Logs**

### Passage en Production

Une fois les tests validés, vous pouvez passer en mode production en remplaçant les clés de test par les clés de production.

**Checklist avant Production:**

- ✅ Toutes les clés API sont en mode production (`pk_live_`, `sk_live_`)
- ✅ Le webhook pointe vers l'URL de production
- ✅ Le produit Premium est créé en mode production
- ✅ Les tests de paiement en mode production ont réussi
- ✅ Les emails de confirmation sont correctement envoyés
- ✅ Le statut Premium est correctement attribué après paiement

---

## Système Premium

### Fonctionnalités Premium

L'abonnement Premium débloque l'accès illimité à tous les outils de la plateforme, permettant aux utilisateurs professionnels de travailler sans contraintes.

**Avantages Premium:**

| Fonctionnalité | Gratuit | Premium |
|----------------|---------|---------|
| Générateur de Copy | 5/mois | ♾️ Illimité |
| Analyseur de Contenu | 10/mois | ♾️ Illimité |
| Persona Builder | 3 avatars | ♾️ Illimité |
| Correcteur Universel | 5/mois | ♾️ Illimité |
| Générateur de Citations | 5/mois | ♾️ Illimité |
| Support | Standard | Prioritaire |
| Nouvelles Fonctionnalités | - | Accès anticipé |

### Gestion des Abonnements

Les utilisateurs Premium peuvent gérer leur abonnement directement depuis la page **/premium** via le portail Stripe.

**Actions Disponibles:**

- Mettre à jour le moyen de paiement
- Consulter l'historique de facturation
- Télécharger les factures
- Annuler l'abonnement (accès maintenu jusqu'à la fin de la période payée)
- Réactiver un abonnement annulé

### Logique de Vérification Premium

Le backend vérifie le statut Premium de l'utilisateur avant chaque opération consommant des quotas. Cette vérification garantit une application correcte des limites.

```typescript
// Exemple de vérification dans une procédure tRPC
const isPremium = await checkUserPremiumStatus(userId);

if (!isPremium) {
  const quotaUsed = await getQuotaUsage(userId, 'copyGenerations');
  if (quotaUsed >= FREE_TIER_LIMITS.copyGenerations) {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Quota mensuel atteint. Passez à Premium pour continuer.',
    });
  }
}
```

Cette approche centralisée assure la cohérence des règles métier à travers toute l'application.

---

## Gestion des Quotas

### Quotas Gratuits

Les utilisateurs gratuits disposent de quotas mensuels qui se réinitialisent automatiquement tous les 30 jours à partir de leur première utilisation.

**Limites par Défaut:**

```typescript
const FREE_TIER_LIMITS = {
  copyGenerations: 5,      // Générations de copy par mois
  contentAnalyses: 10,     // Analyses de contenu par mois
  avatars: 3,              // Nombre maximum d'avatars clients
  corrections: 5,          // Corrections par mois
  quotes: 5,               // Citations générées par mois
};
```

### Réinitialisation Automatique

La réinitialisation des quotas est gérée automatiquement par le système lors de chaque vérification de quota.

**Logique de Réinitialisation:**

1. Lors d'une demande d'utilisation d'un outil, le système vérifie la date de réinitialisation
2. Si la date de réinitialisation est dépassée (> 30 jours depuis la dernière réinitialisation), tous les compteurs sont remis à zéro
3. Une nouvelle date de réinitialisation est calculée (+30 jours)
4. L'utilisateur peut à nouveau utiliser ses quotas mensuels

### Notifications de Quotas

Pour améliorer l'expérience utilisateur et encourager les conversions Premium, le système peut envoyer des notifications automatiques par email.

**Seuils de Notification:**

- **80% du quota atteint:** Email d'avertissement invitant à passer Premium
- **100% du quota atteint:** Email de limite atteinte avec CTA Premium

**Note:** Cette fonctionnalité nécessite la configuration du service SMTP (voir section Administration).

---

## Outils IA Disponibles

### 1. Générateur de Copy PFPMA

Le générateur de copy utilise le framework PFPMA pour créer des messages commerciaux structurés et persuasifs.

**Inputs:**
- Produit/service à promouvoir
- Public cible (avatar client)
- Objectif de conversion (vente, inscription, téléchargement, etc.)
- Ton souhaité (professionnel, décontracté, urgent, etc.)

**Output:**
- Message structuré selon PFPMA :
  - **P**roblème : Identification du pain point
  - **F**ormule : Solution proposée
  - **P**reuve : Éléments de crédibilité
  - **M**éthode : Comment ça fonctionne
  - **A**ppel : Call-to-action clair

**Exemple d'Utilisation:**

Un consultant en marketing souhaite promouvoir une formation sur LinkedIn. Il entre les informations suivantes dans le générateur :

- **Produit:** Formation LinkedIn pour entrepreneurs
- **Public cible:** Entrepreneurs B2B cherchant à générer des leads
- **Objectif:** Inscription à la formation (497€)
- **Ton:** Professionnel et orienté résultats

Le générateur produit un message complet optimisé pour la conversion, prêt à être utilisé dans une campagne publicitaire ou une landing page.

### 2. Analyseur de Contenu

L'analyseur évalue la qualité et l'efficacité d'un texte existant selon plusieurs critères objectifs.

**Critères d'Analyse:**

| Critère | Description | Score |
|---------|-------------|-------|
| Clarté | Facilité de compréhension du message | /20 |
| Structure PFPMA | Présence et qualité des 5 éléments | /20 |
| Frictions | Détection des obstacles à la conversion | /20 |
| Call-to-Action | Clarté et force de l'appel à l'action | /20 |
| Ton et Cohérence | Adéquation avec le public cible | /20 |

**Output:**
- Score global /100
- Analyse détaillée par critère
- Recommandations actionnables pour améliorer le texte
- Exemples de reformulation pour les points faibles

### 3. Persona Builder (Avatars Clients)

Le Persona Builder permet de créer des profils détaillés de clients idéaux pour mieux cibler les messages.

**Informations Collectées:**

- **Démographiques:** Âge, genre, localisation, profession
- **Psychographiques:** Valeurs, motivations, peurs, aspirations
- **Comportementaux:** Habitudes d'achat, canaux préférés, objections courantes
- **Pain Points:** Problèmes spécifiques que le produit/service résout

**Utilisation:**

Les avatars créés peuvent être sélectionnés lors de la génération de copy pour personnaliser automatiquement le message en fonction du public cible. Cette approche data-driven améliore significativement les taux de conversion.

### 4. Correcteur Universel

Le correcteur analyse et améliore la qualité linguistique et stylistique d'un texte.

**Fonctionnalités:**

- Correction orthographique et grammaticale
- Amélioration de la syntaxe et de la fluidité
- Suggestions de vocabulaire plus impactant
- Détection des répétitions et lourdeurs
- Optimisation de la longueur des phrases

### 5. Générateur de Citations

Le générateur crée des citations percutantes et mémorables pour renforcer l'impact d'un message.

**Types de Citations:**

- Citations inspirantes pour motiver l'action
- Citations d'autorité pour renforcer la crédibilité
- Citations de témoignages clients (basées sur des retours réels)
- Citations de statistiques pour appuyer les arguments

---

## Administration

### Interface Admin

L'interface d'administration est accessible uniquement aux utilisateurs ayant le rôle `admin` dans la base de données.

**URL:** `/admin`

**Fonctionnalités:**

- Vue d'ensemble des commandes et paiements
- Gestion des utilisateurs et de leurs abonnements
- Upload et gestion des artefacts pour les clients
- Statistiques de conversion et d'utilisation
- Gestion des articles de blog et études de cas

### Configuration SMTP

Pour activer l'envoi d'emails transactionnels (confirmations de commande, notifications de quotas, etc.), vous devez configurer un service SMTP.

**Providers Recommandés:**

| Provider | Prix | Limite Gratuite | Recommandation |
|----------|------|-----------------|----------------|
| **SendGrid** | Gratuit puis $19.95/mois | 100 emails/jour | Idéal pour démarrer |
| **Mailgun** | $35/mois | 5000 emails/mois | Bon rapport qualité/prix |
| **AWS SES** | $0.10/1000 emails | - | Le plus économique à grande échelle |
| **Postmark** | $15/mois | - | Meilleure délivrabilité |

**Configuration dans Manus:**

1. Ouvrez **Settings** → **Secrets**
2. Ajoutez les variables suivantes :

| Variable | Exemple | Description |
|----------|---------|-------------|
| `SMTP_HOST` | `smtp.sendgrid.net` | Serveur SMTP |
| `SMTP_PORT` | `587` | Port SMTP (587 ou 465) |
| `SMTP_SECURE` | `false` | TLS activé (false pour 587, true pour 465) |
| `SMTP_USER` | `apikey` | Nom d'utilisateur SMTP |
| `SMTP_PASS` | `SG.xxx...` | Mot de passe ou clé API |

**Test de Configuration:**

Après avoir configuré les variables SMTP, testez l'envoi d'emails en effectuant une commande test ou en utilisant la fonction de test dans l'interface admin.

### Gestion des Artefacts

Les artefacts (livrables pour les clients) sont stockés sur AWS S3 et liés aux commandes dans la base de données.

**Workflow d'Upload:**

1. Un client effectue une commande (Sprint de Clarté, Formation, etc.)
2. L'admin reçoit une notification de nouvelle commande
3. L'admin accède à **/admin**, trouve la commande
4. L'admin upload les artefacts (PDF, vidéos, templates, etc.)
5. Les fichiers sont automatiquement stockés sur S3
6. Le client reçoit un email avec les liens de téléchargement
7. Le client peut télécharger les artefacts depuis son dashboard **/dashboard**

**Sécurité:**

Les URLs de téléchargement sont signées et temporaires (expiration après 7 jours) pour éviter le partage non autorisé des artefacts.

---

## Déploiement

### Prérequis

Avant de déployer l'application en production, assurez-vous que tous les éléments suivants sont configurés.

**Checklist de Déploiement:**

- ✅ Base de données MySQL provisionnée et accessible
- ✅ Variables d'environnement configurées (Stripe, SMTP, OAuth, S3)
- ✅ Clés API Stripe en mode production
- ✅ Webhook Stripe configuré et testé
- ✅ Service SMTP configuré et testé
- ✅ Bucket S3 créé avec les permissions appropriées
- ✅ Tests de bout en bout réussis en environnement de staging

### Déploiement sur Manus

Le déploiement sur la plateforme Manus est simplifié grâce au système de checkpoints intégré.

**Procédure:**

1. Vérifiez que toutes les fonctionnalités sont testées et fonctionnelles
2. Créez un checkpoint final depuis l'interface de chat
3. Ouvrez l'interface de gestion du projet (icône en haut à droite)
4. Cliquez sur l'onglet **Dashboard**
5. Cliquez sur le bouton **Publish** dans le header
6. Confirmez le déploiement
7. Attendez la fin du déploiement (généralement 1-2 minutes)
8. Votre application est maintenant accessible publiquement

**URL de Production:**

Par défaut, votre application sera accessible à l'adresse :
```
https://sionohmair-insight-academy.manus.space
```

Vous pouvez configurer un domaine personnalisé dans **Settings** → **Domains**.

### Configuration du Domaine Personnalisé

Pour utiliser votre propre nom de domaine (ex: `app.sionohmair.com`), suivez ces étapes.

1. Allez dans **Settings** → **Domains**
2. Cliquez sur **Add Custom Domain**
3. Entrez votre nom de domaine (ex: `app.sionohmair.com`)
4. Copiez les enregistrements DNS fournis
5. Ajoutez ces enregistrements dans la configuration DNS de votre registrar
6. Attendez la propagation DNS (jusqu'à 48h, généralement quelques heures)
7. Le certificat SSL sera automatiquement provisionné par Manus

**Enregistrements DNS Typiques:**

| Type | Nom | Valeur |
|------|-----|--------|
| CNAME | app | sionohmair-insight-academy.manus.space |

---

## Maintenance

### Monitoring

Pour garantir la disponibilité et les performances de l'application, mettez en place un monitoring régulier.

**Métriques Clés à Surveiller:**

| Métrique | Seuil d'Alerte | Action |
|----------|----------------|--------|
| Taux d'erreur API | > 5% | Vérifier les logs backend |
| Temps de réponse | > 2s | Optimiser les requêtes DB |
| Taux de conversion Premium | < 2% | Revoir le pricing ou l'UX |
| Taux de désabonnement | > 10%/mois | Analyser les raisons de churn |
| Utilisation des quotas | Tendances | Ajuster les limites si nécessaire |

### Sauvegardes

Les sauvegardes automatiques de la base de données sont essentielles pour prévenir la perte de données.

**Stratégie Recommandée:**

- **Sauvegardes quotidiennes** : Rétention 7 jours
- **Sauvegardes hebdomadaires** : Rétention 4 semaines
- **Sauvegardes mensuelles** : Rétention 12 mois

**Note:** Vérifiez que votre provider de base de données (ex: PlanetScale, AWS RDS) a activé les sauvegardes automatiques.

### Mises à Jour

Planifiez des mises à jour régulières pour corriger les bugs, améliorer les performances et ajouter de nouvelles fonctionnalités.

**Cycle de Mise à Jour Recommandé:**

- **Correctifs de sécurité:** Immédiatement
- **Corrections de bugs:** Hebdomadaire
- **Nouvelles fonctionnalités:** Mensuel
- **Mises à jour majeures:** Trimestriel

**Procédure de Mise à Jour:**

1. Développez et testez les changements en local
2. Créez un checkpoint de sauvegarde avant déploiement
3. Déployez en production via le bouton **Publish**
4. Vérifiez que tout fonctionne correctement
5. En cas de problème, utilisez **Rollback** pour revenir au checkpoint précédent

---

## Dépannage

### Problèmes Courants

Cette section répertorie les problèmes les plus fréquents et leurs solutions.

#### 1. Les Paiements Stripe Ne Fonctionnent Pas

**Symptômes:**
- Erreur lors du clic sur "Passer à Premium"
- Redirection vers une page d'erreur Stripe
- Paiement non enregistré dans le Dashboard

**Solutions:**

1. Vérifiez que les clés API Stripe sont correctement configurées dans **Settings** → **Secrets**
2. Assurez-vous d'utiliser les bonnes clés (test vs production)
3. Vérifiez que le webhook Stripe est configuré et actif
4. Consultez les logs du webhook dans le Dashboard Stripe (**Développeurs** → **Webhooks** → **Logs**)
5. Vérifiez que l'URL du webhook est correcte et accessible publiquement

#### 2. Les Emails Ne Sont Pas Envoyés

**Symptômes:**
- Aucun email de confirmation après commande
- Aucune notification de quota

**Solutions:**

1. Vérifiez la configuration SMTP dans **Settings** → **Secrets**
2. Testez la connexion SMTP avec un outil comme [SMTP Test Tool](https://www.smtper.net/)
3. Vérifiez que le port SMTP est correct (587 pour TLS, 465 pour SSL)
4. Consultez les logs du serveur pour identifier les erreurs SMTP
5. Vérifiez que votre provider SMTP n'a pas bloqué votre compte (limite dépassée, spam détecté, etc.)

#### 3. Les Quotas Ne Se Réinitialisent Pas

**Symptômes:**
- Les utilisateurs gratuits ne peuvent plus utiliser les outils même après 30 jours
- Les compteurs de quotas ne reviennent pas à zéro

**Solutions:**

1. Vérifiez la logique de réinitialisation dans le code backend
2. Consultez la table `quotaUsage` dans la base de données pour vérifier les dates de réinitialisation
3. Exécutez manuellement une réinitialisation via une requête SQL si nécessaire :
   ```sql
   UPDATE quotaUsage 
   SET copyGenerationsUsed = 0, 
       contentAnalysesUsed = 0, 
       correctionsUsed = 0, 
       quotesUsed = 0,
       resetAt = DATE_ADD(NOW(), INTERVAL 30 DAY)
   WHERE userId = [USER_ID];
   ```

#### 4. Erreur "Database Not Available"

**Symptômes:**
- Message d'erreur "Database not available" dans l'application
- Impossible de se connecter ou d'accéder aux données

**Solutions:**

1. Vérifiez que la variable `DATABASE_URL` est correctement configurée
2. Testez la connexion à la base de données depuis un client MySQL
3. Vérifiez que la base de données est accessible depuis l'IP du serveur Manus
4. Consultez les logs du serveur pour identifier l'erreur de connexion exacte
5. Vérifiez que les migrations Drizzle ont été exécutées (`pnpm db:push`)

#### 5. Les Artefacts Ne Se Téléchargent Pas

**Symptômes:**
- Erreur 403 ou 404 lors du clic sur un lien de téléchargement
- Liens de téléchargement expirés

**Solutions:**

1. Vérifiez que les credentials AWS S3 sont correctement configurés
2. Assurez-vous que le bucket S3 existe et est accessible
3. Vérifiez les permissions du bucket (lecture publique ou URLs signées)
4. Régénérez les URLs de téléchargement si elles sont expirées
5. Consultez les logs AWS CloudWatch pour identifier les erreurs S3

### Logs et Debugging

Pour diagnostiquer les problèmes, consultez les logs du serveur.

**Accès aux Logs:**

Les logs sont accessibles via la console du serveur dans l'interface Manus ou via SSH si activé.

**Logs Importants:**

- `[Database]` : Erreurs de connexion ou de requêtes DB
- `[Stripe]` : Erreurs de paiement ou de webhook
- `[Email]` : Erreurs d'envoi d'emails
- `[Quota]` : Vérifications et réinitialisations de quotas
- `[Auth]` : Problèmes d'authentification OAuth

**Exemple de Log Typique:**

```
[2025-12-04 16:43:55] [Database] Failed to connect: Error: Connection timeout
[2025-12-04 16:44:04] [Stripe] Webhook received: checkout.session.completed
[2025-12-04 16:44:05] [Email] Sending confirmation email to user@example.com
[2025-12-04 16:44:06] [Email] Email sent successfully
```

### Support

Si vous rencontrez un problème non résolu par cette documentation, contactez le support Manus.

**Ressources de Support:**

- **Documentation Manus:** [docs.manus.im](https://docs.manus.im)
- **Support Manus:** [help.manus.im](https://help.manus.im)
- **Communauté Discord:** [discord.gg/manus](https://discord.gg/manus) (exemple)
- **Email Support:** support@manus.im

**Informations à Fournir:**

Lors d'une demande de support, incluez toujours les informations suivantes pour accélérer la résolution :

- Description détaillée du problème
- Étapes pour reproduire l'erreur
- Captures d'écran ou vidéos si pertinent
- Logs du serveur (sans informations sensibles)
- Version de l'application (checkpoint ID)
- Environnement (test ou production)

---

## Conclusion

Cette documentation couvre l'ensemble des aspects techniques et opérationnels de la plateforme **Sionohmair Insight Academy**. Elle est conçue pour être un guide de référence complet pour les développeurs, administrateurs et utilisateurs avancés.

**Prochaines Étapes Recommandées:**

1. Configurer Stripe en mode production
2. Activer le service SMTP pour les emails transactionnels
3. Créer les premiers articles de blog et études de cas
4. Mettre en place un monitoring des performances
5. Planifier les futures fonctionnalités (intégrations, API publique, etc.)

**Évolutions Futures Suggérées:**

- **API Publique:** Permettre aux développeurs d'intégrer les outils IA dans leurs propres applications
- **Intégrations:** Connexions avec Zapier, Make, HubSpot, Salesforce
- **Fonctionnalités IA Avancées:** Génération d'images, vidéos, voix-off pour les copies
- **Marketplace de Templates:** Bibliothèque de templates de copy prêts à l'emploi
- **Programme d'Affiliation:** Système de parrainage avec commissions récurrentes

---

**Version:** 1.0.0  
**Dernière Mise à Jour:** 4 décembre 2025  
**Auteur:** Manus AI  
**Licence:** Propriétaire - Sionohmair Insight Academy
