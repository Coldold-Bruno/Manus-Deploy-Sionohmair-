# Configuration SMTP pour l'envoi d'emails automatiques

## Variables requises

Pour activer l'envoi automatique d'emails de confirmation après paiement, vous devez configurer les variables SMTP suivantes dans **Settings → Secrets** du Management UI :

### 1. SMTP_HOST
- **Description** : Serveur SMTP à utiliser
- **Exemples** :
  - Gmail : `smtp.gmail.com`
  - Outlook : `smtp-mail.outlook.com`
  - SendGrid : `smtp.sendgrid.net`
  - Mailgun : `smtp.mailgun.org`

### 2. SMTP_PORT
- **Description** : Port SMTP
- **Valeurs courantes** :
  - `587` : TLS (recommandé)
  - `465` : SSL
  - `25` : Non sécurisé (déconseillé)

### 3. SMTP_SECURE
- **Description** : Utiliser SSL/TLS
- **Valeurs** :
  - `false` : Pour port 587 (TLS)
  - `true` : Pour port 465 (SSL)

### 4. SMTP_USER
- **Description** : Adresse email d'envoi
- **Exemple** : `contact@sionohmair.com`

### 5. SMTP_PASS
- **Description** : Mot de passe ou clé API SMTP
- **Notes** :
  - Pour Gmail : Utiliser un "App Password" (pas le mot de passe principal)
  - Pour SendGrid/Mailgun : Utiliser la clé API fournie

---

## Configuration recommandée : Gmail

Si vous utilisez Gmail, voici la configuration recommandée :

1. **Activer l'authentification à deux facteurs** sur votre compte Gmail
2. **Générer un mot de passe d'application** :
   - Aller sur https://myaccount.google.com/apppasswords
   - Créer un nouveau mot de passe d'application
   - Copier le mot de passe généré (16 caractères)

3. **Ajouter les variables dans Settings → Secrets** :
   ```
   SMTP_HOST = smtp.gmail.com
   SMTP_PORT = 587
   SMTP_SECURE = false
   SMTP_USER = votre.email@gmail.com
   SMTP_PASS = xxxx xxxx xxxx xxxx (mot de passe d'application)
   ```

---

## Configuration recommandée : SendGrid (professionnel)

SendGrid est recommandé pour un usage professionnel (meilleure délivrabilité, statistiques, etc.) :

1. **Créer un compte SendGrid** : https://sendgrid.com
2. **Créer une clé API** :
   - Aller dans Settings → API Keys
   - Créer une nouvelle clé avec permissions "Mail Send"
   - Copier la clé API

3. **Ajouter les variables dans Settings → Secrets** :
   ```
   SMTP_HOST = smtp.sendgrid.net
   SMTP_PORT = 587
   SMTP_SECURE = false
   SMTP_USER = apikey
   SMTP_PASS = SG.xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx (votre clé API)
   ```

4. **Vérifier votre domaine** (optionnel mais recommandé) :
   - Aller dans Settings → Sender Authentication
   - Suivre les instructions pour vérifier votre domaine
   - Cela améliore la délivrabilité et évite le spam

---

## Test de la configuration

Une fois les variables configurées :

1. **Redémarrer le serveur** : Le serveur doit redémarrer pour prendre en compte les nouvelles variables
2. **Effectuer un paiement test** : Utiliser la carte de test Stripe `4242 4242 4242 4242`
3. **Vérifier la réception de l'email** : L'email de confirmation devrait arriver dans les secondes suivant le paiement
4. **Consulter les logs** : En cas de problème, consulter les logs du serveur pour voir les erreurs SMTP

---

## Dépannage

### Email non reçu
- Vérifier que toutes les variables SMTP sont correctement configurées
- Vérifier les logs du serveur pour voir les erreurs
- Vérifier le dossier spam/courrier indésirable
- Vérifier que l'adresse email du client est valide

### Erreur "Authentication failed"
- Vérifier que SMTP_USER et SMTP_PASS sont corrects
- Pour Gmail : Vérifier que l'authentification à deux facteurs est activée et qu'un mot de passe d'application est utilisé
- Pour SendGrid : Vérifier que la clé API est valide et a les bonnes permissions

### Erreur "Connection timeout"
- Vérifier que SMTP_HOST et SMTP_PORT sont corrects
- Vérifier que le serveur peut accéder à Internet
- Essayer avec un autre port (587 ou 465)

---

## Template d'email

Le template d'email de confirmation est défini dans `server/emailService.ts`. Il contient :

- **En-tête** : Logo Sionohmair avec gradient bleu profond + or
- **Corps** : Nom du produit, prix, numéro de commande, prochaines étapes
- **Footer** : Copyright et mentions légales

Pour personnaliser le template, modifier le fichier `server/emailService.ts` et relancer le serveur.

---

## Sécurité

⚠️ **Important** :
- Ne jamais commit les variables SMTP dans le code source
- Utiliser uniquement Settings → Secrets pour stocker les credentials
- Utiliser des mots de passe d'application (pas les mots de passe principaux)
- Activer l'authentification à deux facteurs sur les comptes email
- Pour un usage professionnel, utiliser un service dédié (SendGrid, Mailgun, etc.)
