# Configuration SMTP Automatique - Sionohmair Insight Academy

## 🎯 Objectif

Ce guide vous permet de configurer automatiquement l'envoi d'emails pour les notifications de la plateforme (confirmations d'abonnement, rappels d'essai, etc.).

## ⚡ Configuration Rapide (5 minutes)

### Option 1 : Gmail (Recommandé pour démarrer)

**Étapes :**

1. **Activer l'authentification à 2 facteurs** sur votre compte Gmail
   - Allez sur https://myaccount.google.com/security
   - Activez "Validation en deux étapes"

2. **Générer un mot de passe d'application**
   - Allez sur https://myaccount.google.com/apppasswords
   - Sélectionnez "Autre (nom personnalisé)"
   - Entrez "Sionohmair Academy"
   - Cliquez sur "Générer"
   - **Copiez le mot de passe de 16 caractères**

3. **Configurer les secrets dans Manus**
   - Ouvrez l'interface Manus → **Settings** → **Secrets**
   - Ajoutez les 5 secrets suivants :

```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@gmail.com
SMTP_PASS=xxxx xxxx xxxx xxxx (le mot de passe d'application)
```

4. **Redémarrer le serveur**
   - Cliquez sur "Restart Server" dans l'interface Manus
   - Attendez 30 secondes

5. **Tester l'envoi d'email**
   - Créez un compte test sur votre plateforme
   - Vérifiez que vous recevez l'email de bienvenue

### Option 2 : SendGrid (Recommandé pour production)

**Avantages :** 100 emails/jour gratuits, meilleure délivrabilité, analytics

**Étapes :**

1. **Créer un compte SendGrid**
   - Allez sur https://signup.sendgrid.com/
   - Créez un compte gratuit

2. **Générer une API Key**
   - Dans le dashboard SendGrid → Settings → API Keys
   - Cliquez sur "Create API Key"
   - Nom : "Sionohmair Academy"
   - Permissions : "Full Access"
   - **Copiez la clé API** (commence par SG.)

3. **Configurer les secrets dans Manus**

```
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=apikey
SMTP_PASS=SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

4. **Vérifier votre domaine (optionnel mais recommandé)**
   - Dans SendGrid → Settings → Sender Authentication
   - Suivez les instructions pour vérifier votre domaine
   - Cela améliore la délivrabilité

### Option 3 : Brevo (ex-Sendinblue)

**Avantages :** 300 emails/jour gratuits, interface française

**Étapes :**

1. **Créer un compte Brevo**
   - Allez sur https://www.brevo.com/fr/
   - Créez un compte gratuit

2. **Générer une clé SMTP**
   - Dans le dashboard Brevo → SMTP & API → SMTP
   - Cliquez sur "Générer une nouvelle clé SMTP"
   - **Copiez la clé**

3. **Configurer les secrets dans Manus**

```
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=votre.email@example.com
SMTP_PASS=xxxxxxxxxxxxxxxxxxx (la clé SMTP)
```

## 🧪 Test de Configuration

Une fois les secrets configurés, testez l'envoi d'email :

```bash
# Dans le terminal Manus
cd /home/ubuntu/sionohmair-insight-academy
node scripts/test-email.mjs
```

Si vous voyez "✅ Email de test envoyé avec succès", la configuration est correcte !

## 🔧 Dépannage

### Erreur "Authentication failed"
- Vérifiez que le SMTP_USER et SMTP_PASS sont corrects
- Pour Gmail : assurez-vous d'utiliser un mot de passe d'application (pas votre mot de passe Gmail)
- Pour SendGrid : vérifiez que SMTP_USER est exactement "apikey"

### Erreur "Connection timeout"
- Vérifiez que SMTP_PORT est 587
- Vérifiez que SMTP_SECURE est "false"

### Les emails arrivent dans les spams
- Configurez SPF, DKIM et DMARC pour votre domaine
- Utilisez SendGrid ou Brevo avec vérification de domaine
- Évitez les mots comme "gratuit", "urgent" dans les subject lines

## 📊 Emails Automatiques Configurés

Une fois SMTP configuré, ces emails seront envoyés automatiquement :

1. **Email de bienvenue** : Envoyé immédiatement après inscription
2. **Rappel J-7** : "Plus que 7 jours d'essai gratuit"
3. **Rappel J-3** : "Plus que 3 jours avant expiration"
4. **Rappel J-1** : "Dernier jour d'essai gratuit"
5. **Expiration J-0** : "Votre essai gratuit expire aujourd'hui"
6. **Confirmation d'abonnement** : Après paiement réussi
7. **Livraison d'artefacts** : Quand un artefact est uploadé

## 🎯 Recommandations

- **Pour démarrer** : Utilisez Gmail (gratuit, simple, 5 min de config)
- **Pour production** : Passez à SendGrid ou Brevo (meilleure délivrabilité)
- **Surveillez** : Vérifiez régulièrement que les emails ne tombent pas en spam
- **Optimisez** : Analysez les taux d'ouverture et ajustez les subject lines

## ✅ Checklist Finale

- [ ] Secrets SMTP configurés dans Manus
- [ ] Serveur redémarré
- [ ] Email de test envoyé avec succès
- [ ] Email de bienvenue reçu après inscription test
- [ ] Emails ne tombent pas dans les spams
- [ ] Domaine vérifié (pour SendGrid/Brevo)

---

**Besoin d'aide ?** Consultez la documentation complète dans `/docs/EMAIL_SETUP.md`
