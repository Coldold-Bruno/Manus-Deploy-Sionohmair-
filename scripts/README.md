# 🛠️ Scripts de Configuration - Sionohmair Insight Academy

Ce dossier contient des scripts utiles pour configurer et tester le système d'abonnement.

---

## 📋 Liste des Scripts

### 1. `configure-smtp.sh` - Configuration SMTP Interactive

Script interactif pour configurer l'envoi d'emails avec 3 options :
- Gmail (Gratuit, Simple) ⭐ RECOMMANDÉ
- SendGrid (Professionnel, 100 emails/jour gratuits)
- Brevo (ex-Sendinblue) (300 emails/jour gratuits)

**Usage** :
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/configure-smtp.sh
```

Le script vous guidera pas à pas et générera les variables d'environnement à copier dans Manus → Settings → Secrets.

---

### 2. `test-system.sh` - Test Automatique du Système

Script de test automatique qui vérifie :
- ✅ Cron job (emails automatiques)
- ✅ Configuration SMTP
- ✅ Configuration Stripe
- ✅ Base de données

**Usage** :
```bash
cd /home/ubuntu/sionohmair-insight-academy
./scripts/test-system.sh
```

**Variables d'environnement optionnelles** :
```bash
export APP_URL="https://votre-domaine.manus.space"
export CRON_SECRET="votre-secret"
./scripts/test-system.sh
```

---

## 🚀 Workflow de Configuration

Voici l'ordre recommandé pour configurer le système :

### Étape 1 : Lire la documentation

```bash
cat CONFIGURATION_FINALE.md
```

### Étape 2 : Configurer le CRON_SECRET

1. Copiez le secret généré dans `CONFIGURATION_FINALE.md` :
   ```
   7p85rPNhQBlraQZf3sSxpZkxYEwYVoi+ru4DE4kUe/E=
   ```

2. Ajoutez-le dans :
   - **GitHub** → Settings → Secrets → Actions → `CRON_SECRET`
   - **Manus** → Settings → Secrets → `CRON_SECRET`

### Étape 3 : Configurer SMTP

```bash
./scripts/configure-smtp.sh
```

Suivez les instructions et copiez les variables dans Manus → Settings → Secrets.

### Étape 4 : Configurer Stripe

1. Activez votre compte Stripe (voir `CONFIGURATION_FINALE.md`)
2. Créez le produit "Abonnement Sionohmair" (36€/mois)
3. Ajoutez les clés API dans Manus → Settings → Secrets

### Étape 5 : Tester le système

```bash
./scripts/test-system.sh
```

Vérifiez que tous les tests passent.

---

## 📚 Documentation Complète

- **CONFIGURATION_FINALE.md** : Guide complet de configuration (3 étapes)
- **CRON_AUTOMATION.md** : Documentation du cron job automatique
- **GUIDE_UTILISATEUR.md** : Guide utilisateur pour les abonnés

---

## 🆘 Dépannage

### Le cron job ne fonctionne pas

1. Vérifiez que `CRON_SECRET` est identique dans GitHub et Manus
2. Testez manuellement :
   ```bash
   curl -X POST \
     -H "Content-Type: application/json" \
     -d '{"secret":"VOTRE_SECRET"}' \
     https://votre-domaine.manus.space/api/trpc/cron.checkTrialExpirations
   ```

### Les emails ne sont pas envoyés

1. Vérifiez que les variables SMTP sont configurées dans Manus → Settings → Secrets
2. Testez avec `./scripts/configure-smtp.sh`
3. Vérifiez les logs du serveur

### Le paiement Stripe ne fonctionne pas

1. Vérifiez que les clés API Stripe sont correctes
2. Vérifiez que le webhook est configuré
3. Testez avec la carte de test : `4242 4242 4242 4242`

---

## 📞 Support

Pour toute question :
- Consultez `CONFIGURATION_FINALE.md`
- Exécutez `./scripts/test-system.sh` pour diagnostiquer
- Vérifiez les logs du serveur dans Manus

---

**Bon déploiement ! 🚀**
