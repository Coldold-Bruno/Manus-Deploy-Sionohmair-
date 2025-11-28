# 🚀 Guide d'Automatisation - Lancement en Production

**Sionohmair Insight Academy - L'Ingénierie du Génie**

---

## 📋 Table des Matières

1. [Introduction](#introduction)
2. [Prérequis](#prérequis)
3. [Vue d'ensemble](#vue-densemble)
4. [Méthode 1 : Lancement Automatique Complet](#méthode-1--lancement-automatique-complet)
5. [Méthode 2 : Configuration Étape par Étape](#méthode-2--configuration-étape-par-étape)
6. [Méthode 3 : Configuration Manuelle](#méthode-3--configuration-manuelle)
7. [Dépannage](#dépannage)
8. [FAQ](#faq)
9. [Support](#support)

---

## Introduction

Ce guide vous accompagne dans le **lancement en production** de votre plateforme Sionohmair Insight Academy.

Vous avez le choix entre **3 méthodes** :

- **Méthode 1** : Lancement automatique complet (recommandé) - 30-45 minutes
- **Méthode 2** : Configuration étape par étape - 1-2 heures
- **Méthode 3** : Configuration manuelle - 2-3 heures

---

## Prérequis

Avant de commencer, assurez-vous d'avoir :

### ✅ Compte Manus

- [ ] Compte Manus créé sur [https://manus.im](https://manus.im)
- [ ] Projet `sionohmair-insight-academy` accessible
- [ ] Accès au Management UI (Settings, Secrets, etc.)

### ✅ Domaine Personnalisé (Optionnel)

- [ ] Domaine acheté (Namecheap, OVH, Google Domains, etc.)
- [ ] Accès au panneau de gestion DNS
- [ ] Identifiants de connexion au registrar

### ✅ Compte Stripe

- [ ] Compte Stripe créé sur [https://stripe.com](https://stripe.com)
- [ ] Informations d'entreprise prêtes (SIRET, adresse, etc.)
- [ ] Informations bancaires prêtes (IBAN, BIC)
- [ ] Pièce d'identité disponible (CNI ou passeport)

### ✅ Outils Techniques

- [ ] Terminal / Ligne de commande accessible
- [ ] Git installé (optionnel)
- [ ] Accès SSH au serveur Manus (fourni)

---

## Vue d'ensemble

### Architecture du Système d'Automatisation

```
scripts/
├── launch-production.sh          # Script maître (orchestrateur)
├── configure-domain.sh           # Configuration DNS et domaine
├── configure-stripe.sh           # Configuration Stripe Live
├── configure-seo.sh              # Optimisation SEO
└── templates/
    ├── dns-config-template.txt
    ├── stripe-config-template.txt
    └── seo-checklist-template.txt
```

### Flux de Travail

```
┌─────────────────────────────────────────────────────────────┐
│                                                             │
│  1. Choix du mode de lancement                             │
│     ├── Complet (domaine + Stripe + SEO)                   │
│     ├── Rapide (Manus + Stripe + SEO)                      │
│     └── Personnalisé (choisir les étapes)                  │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  2. Configuration du domaine (optionnel)                    │
│     ├── Saisie du nom de domaine                           │
│     ├── Configuration DNS automatique                       │
│     ├── Vérification de la propagation                     │
│     └── Activation HTTPS                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  3. Configuration Stripe Live                               │
│     ├── Activation du compte Stripe                        │
│     ├── Récupération des clés Live                         │
│     ├── Configuration du webhook                           │
│     └── Test de paiement                                    │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  4. Optimisation SEO                                        │
│     ├── Génération sitemap.xml                             │
│     ├── Génération robots.txt                              │
│     ├── Configuration Google Search Console                │
│     └── Demandes d'indexation                              │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  5. Vérifications pré-déploiement                           │
│     ├── Vérification des fichiers                          │
│     ├── Vérification des dépendances                       │
│     └── Tests de configuration                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  6. Déploiement en production                               │
│     ├── Ouverture de Manus                                 │
│     ├── Clic sur "Publish"                                 │
│     └── Attente du déploiement                             │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  7. Tests post-déploiement                                  │
│     ├── Test d'accessibilité                               │
│     ├── Test des fonctionnalités                           │
│     ├── Test du paiement                                    │
│     └── Test SEO                                            │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  8. Génération du rapport final                             │
│     └── Rapport complet de configuration                   │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## Méthode 1 : Lancement Automatique Complet

**Durée estimée : 30-45 minutes**

Cette méthode utilise le **script maître** qui orchestre toutes les configurations automatiquement.

### Étape 1 : Connexion au Serveur

```bash
# Connectez-vous au serveur Manus via SSH
ssh ubuntu@[VOTRE-SERVEUR-MANUS]

# Ou utilisez le terminal intégré dans Manus UI
```

### Étape 2 : Navigation vers le Projet

```bash
cd /home/ubuntu/sionohmair-insight-academy
```

### Étape 3 : Lancement du Script Maître

```bash
./scripts/launch-production.sh
```

### Étape 4 : Suivez les Instructions

Le script vous guidera à travers toutes les étapes :

1. **Choix du mode de lancement**
   - Tapez `1` pour le lancement complet (recommandé)
   - Tapez `2` pour le lancement rapide (sans domaine personnalisé)
   - Tapez `3` pour une configuration personnalisée

2. **Configuration du domaine** (si mode complet)
   - Entrez votre nom de domaine
   - Entrez votre sous-domaine Manus actuel
   - Choisissez votre registrar
   - Suivez les instructions DNS

3. **Configuration Stripe Live**
   - Activez votre compte Stripe
   - Copiez-collez vos clés Live
   - Configurez le webhook
   - Testez le paiement (optionnel)

4. **Optimisation SEO**
   - Entrez votre domaine de production
   - Le script génère sitemap.xml et robots.txt
   - Configurez Google Search Console
   - Envoyez les demandes d'indexation

5. **Déploiement**
   - Le script ouvre Manus automatiquement
   - Cliquez sur "Publish"
   - Attendez la fin du déploiement

6. **Tests**
   - Testez l'accessibilité du site
   - Testez les fonctionnalités principales
   - Testez le paiement (optionnel)
   - Testez le SEO

7. **Rapport final**
   - Le script génère un rapport complet
   - Sauvegardez ce rapport pour référence

### Étape 5 : Vérification

Une fois le script terminé, vérifiez que tout fonctionne :

```bash
# Vérifier que les fichiers SEO sont créés
ls -la client/public/sitemap.xml
ls -la client/public/robots.txt

# Vérifier que le rapport final est généré
cat production-launch-report.txt
```

### Étape 6 : Célébration ! 🎉

Votre plateforme est maintenant en production !

---

## Méthode 2 : Configuration Étape par Étape

**Durée estimée : 1-2 heures**

Cette méthode vous permet d'exécuter chaque script séparément.

### Étape 1 : Configuration du Domaine

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/configure-domain.sh
```

**Ce script va :**
- Vous demander votre nom de domaine
- Générer les enregistrements DNS
- Ouvrir votre registrar automatiquement
- Vérifier la propagation DNS
- Vous guider pour configurer Manus

**Fichier généré :**
- `dns-config-[VOTRE-DOMAINE].txt`

### Étape 2 : Configuration Stripe Live

```bash
./scripts/configure-stripe.sh
```

**Ce script va :**
- Vous guider pour activer votre compte Stripe
- Vous demander vos clés Live
- Configurer le webhook automatiquement
- Générer le fichier de configuration
- Vous guider pour configurer Manus

**Fichier généré :**
- `stripe-live-config.txt`

⚠️ **IMPORTANT** : Supprimez ce fichier après configuration !

### Étape 3 : Optimisation SEO

```bash
./scripts/configure-seo.sh
```

**Ce script va :**
- Générer sitemap.xml
- Générer robots.txt
- Ajouter les meta tags Open Graph (optionnel)
- Configurer Google Search Console
- Envoyer les demandes d'indexation

**Fichiers générés :**
- `client/public/sitemap.xml`
- `client/public/robots.txt`
- `seo-configuration-report.txt`

### Étape 4 : Déploiement Manuel

1. Allez sur [https://manus.im](https://manus.im)
2. Connectez-vous à votre compte
3. Cliquez sur : Projets → sionohmair-insight-academy
4. Cliquez sur le bouton "Publish" (en haut à droite)
5. Attendez la fin du déploiement (2-5 minutes)

### Étape 5 : Tests

Testez votre site en production :

```bash
# Test d'accessibilité
curl -I https://[VOTRE-DOMAINE]

# Test du sitemap
curl https://[VOTRE-DOMAINE]/sitemap.xml

# Test du robots.txt
curl https://[VOTRE-DOMAINE]/robots.txt
```

---

## Méthode 3 : Configuration Manuelle

**Durée estimée : 2-3 heures**

Cette méthode est pour les utilisateurs avancés qui préfèrent tout configurer manuellement.

### Étape 1 : Configuration DNS Manuelle

1. **Connectez-vous à votre registrar**
   - Namecheap : [https://www.namecheap.com/myaccount/login/](https://www.namecheap.com/myaccount/login/)
   - OVH : [https://www.ovh.com/auth/](https://www.ovh.com/auth/)
   - Google Domains : [https://domains.google.com](https://domains.google.com)

2. **Ajoutez les enregistrements CNAME**

   | Type  | Host/Name | Value                        | TTL  |
   |-------|-----------|------------------------------|------|
   | CNAME | www       | [VOTRE-SOUS-DOMAINE].manus.space | 3600 |
   | CNAME | @         | [VOTRE-SOUS-DOMAINE].manus.space | 3600 |

3. **Vérifiez la propagation DNS**

   ```bash
   dig [VOTRE-DOMAINE]
   dig www.[VOTRE-DOMAINE]
   ```

   Ou utilisez : [https://dnschecker.org](https://dnschecker.org)

4. **Configurez le domaine dans Manus**
   - Allez sur : Settings → Domains
   - Cliquez sur "Add Custom Domain"
   - Entrez votre domaine
   - Cliquez sur "Verify"

### Étape 2 : Configuration Stripe Manuelle

1. **Activez votre compte Stripe**
   - Allez sur [https://dashboard.stripe.com](https://dashboard.stripe.com)
   - Cliquez sur "Activer votre compte"
   - Remplissez les informations demandées
   - Attendez la validation (1-3 jours)

2. **Récupérez les clés Live**
   - Allez sur [https://dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
   - Basculez en mode "Live"
   - Copiez la clé publique (pk_live_...)
   - Copiez la clé secrète (sk_live_...)

3. **Configurez le webhook**
   - Allez sur [https://dashboard.stripe.com/webhooks](https://dashboard.stripe.com/webhooks)
   - Cliquez sur "Ajouter un endpoint"
   - URL : `https://[VOTRE-DOMAINE]/api/stripe/webhook`
   - Événements :
     - customer.subscription.created
     - customer.subscription.updated
     - customer.subscription.deleted
     - invoice.payment_succeeded
     - invoice.payment_failed
     - checkout.session.completed
   - Copiez le secret de signature (whsec_...)

4. **Configurez les secrets dans Manus**
   - Allez sur : Settings → Secrets
   - Modifiez ces 3 secrets :
     - `VITE_STRIPE_PUBLISHABLE_KEY` : pk_live_...
     - `STRIPE_SECRET_KEY` : sk_live_...
     - `STRIPE_WEBHOOK_SECRET` : whsec_...
   - Sauvegardez
   - Redémarrez le serveur (icône 🔄)

### Étape 3 : Optimisation SEO Manuelle

1. **Créez sitemap.xml**

   Créez le fichier `client/public/sitemap.xml` :

   ```xml
   <?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>https://[VOTRE-DOMAINE]/</loc>
       <lastmod>2024-01-01</lastmod>
       <changefreq>weekly</changefreq>
       <priority>1.0</priority>
     </url>
     <!-- Ajoutez toutes vos pages ici -->
   </urlset>
   ```

2. **Créez robots.txt**

   Créez le fichier `client/public/robots.txt` :

   ```
   User-agent: *
   Allow: /
   
   Sitemap: https://[VOTRE-DOMAINE]/sitemap.xml
   
   Disallow: /dashboard/
   Disallow: /admin/
   Disallow: /api/
   ```

3. **Ajoutez les meta tags Open Graph**

   Dans `client/index.html`, ajoutez dans `<head>` :

   ```html
   <!-- Open Graph -->
   <meta property="og:type" content="website">
   <meta property="og:title" content="Sionohmair Insight Academy">
   <meta property="og:description" content="Transformez votre contenu marketing...">
   <meta property="og:image" content="https://[DOMAINE]/og-image.jpg">
   <meta property="og:url" content="https://[DOMAINE]">
   
   <!-- Twitter Card -->
   <meta name="twitter:card" content="summary_large_image">
   <meta name="twitter:title" content="Sionohmair Insight Academy">
   <meta name="twitter:description" content="Transformez votre contenu marketing...">
   <meta name="twitter:image" content="https://[DOMAINE]/twitter-card.jpg">
   ```

4. **Configurez Google Search Console**
   - Allez sur [https://search.google.com/search-console](https://search.google.com/search-console)
   - Ajoutez votre propriété
   - Vérifiez le domaine (balise HTML ou DNS)
   - Soumettez le sitemap
   - Envoyez les demandes d'indexation

### Étape 4 : Déploiement

1. Allez sur [https://manus.im](https://manus.im)
2. Cliquez sur : Projets → sionohmair-insight-academy
3. Cliquez sur "Publish"
4. Attendez la fin du déploiement

---

## Dépannage

### Problème : DNS not found

**Symptôme** : Le domaine ne résout pas vers Manus

**Solutions** :
1. Attendez la propagation DNS (5-30 minutes, parfois jusqu'à 48h)
2. Vérifiez que les enregistrements CNAME sont corrects
3. Utilisez [https://dnschecker.org](https://dnschecker.org) pour vérifier
4. Videz le cache DNS local :
   ```bash
   # macOS
   sudo dscacheutil -flushcache
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

### Problème : CNAME not allowed for @

**Symptôme** : Le registrar n'accepte pas CNAME pour le domaine racine

**Solutions** :
1. Utilisez un enregistrement A avec l'IP Manus (demandez à Manus Support)
2. Utilisez ALIAS ou ANAME si votre registrar le supporte
3. Utilisez uniquement www et redirigez @ vers www

### Problème : Stripe webhook signature verification failed

**Symptôme** : Les webhooks Stripe échouent

**Solutions** :
1. Vérifiez que le secret de signature est correct
2. Vérifiez que l'URL du webhook est correcte
3. Vérifiez que le secret est bien configuré dans Manus (Settings → Secrets)
4. Redémarrez le serveur après avoir modifié les secrets
5. Vérifiez les logs Stripe : [https://dashboard.stripe.com/logs](https://dashboard.stripe.com/logs)

### Problème : Site not indexed in Google

**Symptôme** : Le site n'apparaît pas dans Google après plusieurs jours

**Solutions** :
1. Vérifiez que le sitemap est soumis dans Google Search Console
2. Vérifiez que robots.txt n'bloque pas Google
3. Envoyez des demandes d'indexation manuelles
4. Créez des backlinks vers votre site
5. Publiez du contenu régulièrement
6. Attendez (l'indexation peut prendre 1-7 jours)

### Problème : Payment failed

**Symptôme** : Les paiements Stripe échouent

**Solutions** :
1. Vérifiez que vous utilisez les clés LIVE (pas TEST)
2. Vérifiez que le compte Stripe est activé
3. Vérifiez les logs Stripe Dashboard
4. Testez avec une vraie carte bancaire
5. Vérifiez que les webhooks sont configurés
6. Contactez Stripe Support si le problème persiste

### Problème : Slow page load

**Symptôme** : Le site est lent à charger

**Solutions** :
1. Optimisez les images (WebP, compression)
2. Activez la compression gzip
3. Minifiez CSS/JS (build de production)
4. Utilisez un CDN (Cloudflare)
5. Activez le cache navigateur
6. Testez avec PageSpeed Insights : [https://pagespeed.web.dev](https://pagespeed.web.dev)

---

## FAQ

### Combien de temps prend le lancement en production ?

- **Méthode 1** (automatique) : 30-45 minutes
- **Méthode 2** (étape par étape) : 1-2 heures
- **Méthode 3** (manuelle) : 2-3 heures

### Ai-je besoin d'un domaine personnalisé ?

Non, vous pouvez utiliser le sous-domaine Manus (xxx.manus.space) gratuitement.

Un domaine personnalisé est recommandé pour :
- Plus de professionnalisme
- Meilleur SEO
- Branding personnalisé

### Combien coûte un domaine ?

- **Namecheap** : 10-15€/an
- **OVH** : 8-12€/an
- **Google Domains** : 12€/an

### Ai-je besoin de Stripe Live immédiatement ?

Non, vous pouvez commencer en mode test et passer en Live plus tard.

Le mode test permet de :
- Tester le processus de paiement
- Valider l'intégration
- Former votre équipe

### Combien de temps prend l'activation Stripe ?

L'activation du compte Stripe prend généralement **1-3 jours ouvrés**.

Préparez :
- Informations d'entreprise (SIRET, adresse)
- Informations bancaires (IBAN, BIC)
- Pièce d'identité (CNI ou passeport)

### Le SEO est-il obligatoire au lancement ?

Non, mais c'est **fortement recommandé**.

Sans SEO :
- Votre site ne sera pas indexé dans Google
- Vous n'aurez pas de trafic organique
- Vous devrez compter uniquement sur la publicité payante

Avec SEO :
- Trafic organique gratuit
- Meilleure visibilité
- Croissance à long terme

### Puis-je modifier la configuration après le lancement ?

Oui, vous pouvez modifier à tout moment :
- Domaine (Settings → Domains)
- Secrets Stripe (Settings → Secrets)
- Fichiers SEO (sitemap.xml, robots.txt)

### Comment annuler un abonnement test Stripe ?

1. Allez sur [https://dashboard.stripe.com/customers](https://dashboard.stripe.com/customers)
2. Sélectionnez le client test
3. Cliquez sur l'abonnement
4. Cliquez sur "Annuler l'abonnement"
5. Confirmez

### Que faire si un script échoue ?

1. Lisez le message d'erreur
2. Consultez la section [Dépannage](#dépannage)
3. Relancez le script
4. Si le problème persiste, contactez le support

### Puis-je utiliser les scripts sur un autre projet ?

Oui, les scripts sont génériques et peuvent être adaptés à d'autres projets.

Modifiez simplement :
- Le nom du projet
- Les URLs
- Les chemins de fichiers

---

## Support

### Documentation

- **Guide complet** : `/home/ubuntu/sionohmair-insight-academy/GUIDE-AUTOMATISATION.md`
- **Templates** : `/home/ubuntu/sionohmair-insight-academy/scripts/templates/`
- **Rapports** : Générés automatiquement après chaque script

### Ressources Externes

- **Manus** : [https://manus.im](https://manus.im)
- **Stripe** : [https://stripe.com/docs](https://stripe.com/docs)
- **Google Search Console** : [https://search.google.com/search-console](https://search.google.com/search-console)
- **DNSChecker** : [https://dnschecker.org](https://dnschecker.org)
- **PageSpeed Insights** : [https://pagespeed.web.dev](https://pagespeed.web.dev)

### Contact

- **Email** : support@sionohmair-academy.com
- **Discord** : [À créer]
- **Documentation** : [https://[VOTRE-DOMAINE]/guide](https://[VOTRE-DOMAINE]/guide)

---

## Conclusion

Félicitations ! Vous avez maintenant tous les outils pour lancer votre plateforme en production.

**Prochaines étapes** :

1. ✅ Choisissez votre méthode de lancement
2. ✅ Exécutez les scripts
3. ✅ Testez votre site
4. ✅ Partagez sur les réseaux sociaux
5. ✅ Collectez les feedbacks
6. ✅ Améliorez continuellement

**Bonne chance pour votre aventure entrepreneuriale ! 🚀**

---

*Guide créé le 2024 - Sionohmair Insight Academy*
