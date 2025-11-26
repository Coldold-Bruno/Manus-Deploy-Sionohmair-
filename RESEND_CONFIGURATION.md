# 🔧 Configuration Resend - Sionohmair Insight Academy

## ✅ Informations de Configuration

**Date de configuration :** 26 novembre 2024

### Clé API Resend
```
RESEND_API_KEY=re_MtuXoYBT_BR5KtvijNLV9BYij2odAjVHo
```

### Email d'expéditeur
```
SMTP_FROM_EMAIL=sionohmair@academy.com
SMTP_FROM_NAME=Sionohmair Insight Academy
```

---

## ⚠️ Important : Vérification DNS Requise

Pour que les emails fonctionnent, vous devez **vérifier votre domaine `academy.com` dans Resend** :

1. Connectez-vous à [resend.com](https://resend.com)
2. Allez dans **Domains** → Ajoutez `academy.com`
3. Ajoutez les 3 enregistrements DNS chez votre fournisseur :
   - SPF (TXT)
   - DKIM (TXT)
   - MX (Return Path)
4. Attendez 15-30 minutes
5. Cliquez sur **"Verify DNS Records"** dans Resend

**Statut actuel :** ⏳ En attente de vérification DNS

---

## 📧 Fonctionnalités Email Activées

Une fois la vérification DNS terminée, votre application pourra envoyer :

✅ **Emails de bienvenue** (nouveaux inscrits newsletter)  
✅ **Confirmations de commande** (après paiement Stripe)  
✅ **Livraison d'artefacts** (avec liens de téléchargement)  
✅ **Rappels automatiques** (suivi client)  
✅ **Demandes de feedback** (satisfaction client)  
✅ **Emails de suivi** (nurturing)  
✅ **Notifications de leads chauds** (pour l'admin)

---

## 🧪 Test de Configuration

Pour tester l'envoi d'emails après la vérification DNS :

1. Allez dans l'interface admin de votre application
2. Utilisez la fonction de test d'email
3. Vérifiez que l'email arrive bien dans votre boîte de réception

---

## 📚 Documentation

- [Documentation Resend](https://resend.com/docs)
- [Guide de vérification DNS](https://resend.com/docs/dashboard/domains/introduction)
- [Limites du plan gratuit](https://resend.com/pricing) : 100 emails/jour

---

## 🔐 Sécurité

- ✅ La clé API est stockée de manière sécurisée dans les variables d'environnement
- ✅ Elle n'est jamais exposée dans le code frontend
- ✅ Elle n'est jamais commitée dans Git
- ⚠️ Ne partagez JAMAIS votre clé API publiquement

---

## 🆘 Support

En cas de problème :
- [Support Resend](https://resend.com/support)
- [Documentation de dépannage](https://resend.com/docs/knowledge-base)
