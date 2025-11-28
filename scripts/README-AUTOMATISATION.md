# 🚀 Scripts d'Automatisation - Option 2 (Configuration Avancée)

Ce dossier contient tous les scripts d'automatisation pour lancer votre plateforme en production avec la **Configuration Avancée (Option 2)**.

---

## 📁 Structure des Scripts d'Automatisation

```
scripts/
├── launch-production.sh          # 🎯 SCRIPT MAÎTRE (COMMENCEZ ICI)
├── configure-domain.sh           # 🌐 Configuration DNS et domaine
├── configure-stripe.sh           # 💳 Configuration Stripe Live
├── configure-seo.sh              # 🔍 Optimisation SEO
└── templates/
    ├── dns-config-template.txt
    ├── stripe-config-template.txt
    └── seo-checklist-template.txt
```

---

## 🎯 Script Principal

### `launch-production.sh` - Script Maître

**Le script qui orchestre TOUT automatiquement.**

**Utilisation :**

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/launch-production.sh
```

**Ce qu'il fait :**
- ✅ Vous guide à travers toutes les étapes
- ✅ Orchestre les 3 scripts de configuration
- ✅ Vérifie la configuration avant déploiement
- ✅ Génère un rapport final complet

**Modes disponibles :**
1. **Lancement Complet** : Domaine + Stripe + SEO (recommandé)
2. **Lancement Rapide** : Manus + Stripe + SEO
3. **Configuration Personnalisée** : Choisissez les étapes

**Durée estimée :** 30-45 minutes

---

## 🌐 Configuration du Domaine

### `configure-domain.sh`

**Configure votre domaine personnalisé avec DNS automatique.**

**Utilisation :**

```bash
./scripts/configure-domain.sh
```

**Ce qu'il fait :**
- ✅ Génère les enregistrements DNS (CNAME)
- ✅ Ouvre votre registrar automatiquement
- ✅ Vérifie la propagation DNS
- ✅ Guide la configuration dans Manus
- ✅ Active HTTPS automatiquement

**Fichier généré :**
- `dns-config-[VOTRE-DOMAINE].txt`

**Durée estimée :** 10-15 minutes (+ 5-30 min de propagation DNS)

---

## 💳 Configuration Stripe Live

### `configure-stripe.sh`

**Configure Stripe en mode LIVE pour accepter de vrais paiements.**

**Utilisation :**

```bash
./scripts/configure-stripe.sh
```

**Ce qu'il fait :**
- ✅ Guide l'activation du compte Stripe
- ✅ Récupère les clés Live (pk_live_, sk_live_)
- ✅ Configure le webhook automatiquement
- ✅ Génère le fichier de configuration
- ✅ Guide la configuration dans Manus
- ✅ Propose un test de paiement

**Fichier généré :**
- `stripe-live-config.txt` (⚠️ À supprimer après configuration !)

**Durée estimée :** 15-20 minutes (+ 1-3 jours pour activation Stripe)

---

## 🔍 Optimisation SEO

### `configure-seo.sh`

**Optimise le référencement de votre site.**

**Utilisation :**

```bash
./scripts/configure-seo.sh
```

**Ce qu'il fait :**
- ✅ Génère sitemap.xml (15 URLs)
- ✅ Génère robots.txt
- ✅ Ajoute les meta tags Open Graph (optionnel)
- ✅ Configure Google Search Console
- ✅ Soumet le sitemap
- ✅ Envoie les demandes d'indexation

**Fichiers générés :**
- `client/public/sitemap.xml`
- `client/public/robots.txt`
- `seo-configuration-report.txt`

**Durée estimée :** 10-15 minutes

---

## 🚀 Démarrage Rapide

### Option 1 : Lancement Automatique Complet (Recommandé)

```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/launch-production.sh
```

Suivez les instructions à l'écran et choisissez le mode de lancement.

### Option 2 : Configuration Étape par Étape

```bash
# 1. Configuration du domaine
./scripts/configure-domain.sh

# 2. Configuration Stripe Live
./scripts/configure-stripe.sh

# 3. Optimisation SEO
./scripts/configure-seo.sh

# 4. Déploiement manuel sur Manus
# Allez sur https://manus.im → Publish
```

---

## 📊 Fichiers Générés

Après l'exécution des scripts, vous aurez :

```
/home/ubuntu/sionohmair-insight-academy/
├── dns-config-[DOMAINE].txt              # Configuration DNS
├── stripe-live-config.txt                # Configuration Stripe (⚠️ À supprimer !)
├── seo-configuration-report.txt          # Rapport SEO
├── production-launch-report.txt          # Rapport final complet
└── client/public/
    ├── sitemap.xml                       # Sitemap SEO
    └── robots.txt                        # Robots.txt SEO
```

---

## 📖 Documentation Complète

Consultez le guide d'automatisation complet :

```bash
cat /home/ubuntu/sionohmair-insight-academy/GUIDE-AUTOMATISATION.md
```

---

## ⚠️ Sécurité

### Fichiers Sensibles

**NE PARTAGEZ JAMAIS :**
- `stripe-live-config.txt` (contient vos clés secrètes)
- Tout fichier contenant `sk_live_` ou `whsec_`

**Bonnes Pratiques :**
1. Supprimez `stripe-live-config.txt` après configuration
2. Ne commitez jamais les clés dans Git
3. Utilisez les secrets Manus (Settings → Secrets)
4. Activez l'authentification 2FA sur Stripe

---

## 🎯 Checklist de Lancement

- [ ] Compte Manus créé
- [ ] Projet accessible
- [ ] Domaine acheté (optionnel)
- [ ] Compte Stripe créé
- [ ] Informations d'entreprise prêtes
- [ ] Informations bancaires prêtes
- [ ] Script `launch-production.sh` exécuté
- [ ] Domaine configuré
- [ ] Stripe Live activé
- [ ] SEO optimisé
- [ ] Site déployé
- [ ] Tests effectués

---

## 📞 Support

- **Guide complet** : `/GUIDE-AUTOMATISATION.md`
- **Templates** : `/scripts/templates/`
- **Email** : support@sionohmair-academy.com

---

**Bonne chance pour votre lancement ! 🚀**
