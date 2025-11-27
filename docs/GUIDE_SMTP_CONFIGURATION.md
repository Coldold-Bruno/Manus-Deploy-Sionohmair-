# 📧 Guide de Configuration SMTP

**Durée** : 5-10 minutes
**Recommandation** : Gmail (gratuit et simple)

---

## Option 1 : Gmail (⭐ RECOMMANDÉ)

### Étapes

1. **Activez l'authentification à 2 facteurs**
   - URL : https://myaccount.google.com/security
   - Cliquez sur "Validation en deux étapes"
   - Suivez les instructions

2. **Créez un mot de passe d'application**
   - URL : https://myaccount.google.com/apppasswords
   - Sélectionnez "Mail" et "Autre (nom personnalisé)"
   - Nommez-le "Sionohmair Academy"
   - Copiez le mot de passe généré (16 caractères, format : xxxx xxxx xxxx xxxx)

3. **Ajoutez dans Manus (Settings → Secrets)**

```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx
```

### Test

```bash
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

Vous devriez recevoir un email de test.

---

## Option 2 : SendGrid (100 emails/jour gratuits)

### Étapes

1. **Créez un compte**
   - URL : https://sendgrid.com
   - Inscription gratuite

2. **Créez une API Key**
   - Dashboard → Settings → API Keys
   - Cliquez sur "Create API Key"
   - Name : "Sionohmair Academy"
   - Permissions : "Full Access"
   - Copiez la clé (commence par SG.)

3. **Ajoutez dans Manus (Settings → Secrets)**

```bash
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

---

## Option 3 : Brevo (300 emails/jour gratuits)

### Étapes

1. **Créez un compte**
   - URL : https://www.brevo.com
   - Inscription gratuite

2. **Créez une clé SMTP**
   - Dashboard → Settings → SMTP & API
   - Cliquez sur "Generate a new SMTP key"
   - Name : "Sionohmair Academy"
   - Copiez la clé

3. **Ajoutez dans Manus (Settings → Secrets)**

```bash
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@brevo.com
SMTP_PASS=xxxxxxxxxxxxxxxxxxx
```

---

## Vérification

Après avoir ajouté les variables dans Manus :

1. **Redémarrez le serveur**
   - Dashboard Manus → Restart (icône en haut à droite)
   - Attendez 30 secondes

2. **Testez l'envoi**
   ```bash
   cd /home/ubuntu/sionohmair-insight-academy
   node scripts/test-email.mjs
   ```

3. **Vérifiez votre boîte email**
   - Sujet : "✅ Test SMTP - Sionohmair Insight Academy"
   - Si vous ne le voyez pas, vérifiez les spams

---

## Dépannage

### Erreur : "Invalid login"

**Gmail** : Vérifiez que :
- L'authentification à 2 facteurs est activée
- Le mot de passe d'application est correct (16 caractères)
- Vous utilisez le mot de passe d'application, pas votre mot de passe Gmail

**SendGrid/Brevo** : Vérifiez que :
- La clé API est correcte
- Vous avez bien copié la clé complète

### Erreur : "Connection timeout"

Vérifiez que :
- `SMTP_HOST` est correct
- `SMTP_PORT` est correct (587)
- Votre pare-feu n'bloque pas le port 587

---

## Recommandations

- **Gmail** : Parfait pour commencer (gratuit, simple)
- **SendGrid** : Meilleur pour la scalabilité (100 emails/jour gratuits)
- **Brevo** : Meilleur pour les newsletters (300 emails/jour gratuits)

---

**Prochaine étape** : Configuration CRON_SECRET (voir GUIDE_CRON_CONFIGURATION.md)
