# 🚀 Guide Complet : Configuration DNS Resend pour Novice

Ce guide vous accompagne **étape par étape** pour configurer votre domaine `academy.com` avec Resend et permettre l'envoi d'emails depuis `sionohmair@academy.com`.

**Durée estimée :** 15-30 minutes  
**Niveau requis :** Débutant (tout est expliqué !)

---

## 📋 Ce que vous allez faire

1. Ajouter votre domaine dans Resend
2. Récupérer les enregistrements DNS
3. Ajouter ces enregistrements dans votre gestionnaire de domaine
4. Vérifier que tout fonctionne

---

## 🎯 PARTIE 1 : Ajouter votre domaine dans Resend

### Étape 1 : Connectez-vous à Resend
1. Allez sur [resend.com](https://resend.com)
2. Connectez-vous avec votre compte

### Étape 2 : Accédez à la section Domains
1. Dans le menu de gauche, cliquez sur **"Domains"**
2. Cliquez sur le bouton **"Add Domain"** (en haut à droite)

### Étape 3 : Entrez votre domaine
1. Dans le champ "Domain name", tapez : `academy.com`
2. Cliquez sur **"Add"**

### Étape 4 : Récupérez vos enregistrements DNS
Resend va vous afficher **3 enregistrements DNS** à ajouter :

#### 📝 Notez ces informations (vous en aurez besoin) :

**Enregistrement 1 - SPF (Type: TXT)**
```
Type: TXT
Name: @ (ou academy.com)
Value: v=spf1 include:_spf.resend.com ~all
```

**Enregistrement 2 - DKIM (Type: TXT)**
```
Type: TXT
Name: resend._domainkey
Value: [une longue chaîne de caractères fournie par Resend]
```

**Enregistrement 3 - Return Path (Type: MX)**
```
Type: MX
Name: send (ou send.academy.com)
Priority: 10
Value: feedback-smtp.resend.com
```

⚠️ **IMPORTANT** : Gardez cette page Resend ouverte, vous en aurez besoin !

---

## 🌐 PARTIE 2 : Ajouter les enregistrements DNS

Maintenant, vous devez ajouter ces 3 enregistrements dans votre **gestionnaire de domaine**.

### Où est votre gestionnaire de domaine ?

Votre domaine `academy.com` a été acheté quelque part. Les plus courants sont :
- **GoDaddy** (godaddy.com)
- **Namecheap** (namecheap.com)
- **OVH** (ovh.com)
- **Google Domains** (domains.google.com)
- **Cloudflare** (cloudflare.com)

**Question :** Savez-vous où vous avez acheté `academy.com` ?

---

## 📖 Instructions selon votre fournisseur

### Option A : GoDaddy

1. Connectez-vous à [godaddy.com](https://godaddy.com)
2. Allez dans **"Mes produits"** → **"Domaines"**
3. Cliquez sur votre domaine `academy.com`
4. Descendez jusqu'à **"Paramètres supplémentaires"**
5. Cliquez sur **"Gérer le DNS"**

**Ajouter l'enregistrement SPF :**
1. Cliquez sur **"Ajouter"**
2. Type : **TXT**
3. Nom : **@**
4. Valeur : `v=spf1 include:_spf.resend.com ~all`
5. TTL : **1 heure** (par défaut)
6. Cliquez sur **"Enregistrer"**

**Ajouter l'enregistrement DKIM :**
1. Cliquez sur **"Ajouter"**
2. Type : **TXT**
3. Nom : **resend._domainkey**
4. Valeur : [copiez la longue chaîne fournie par Resend]
5. TTL : **1 heure**
6. Cliquez sur **"Enregistrer"**

**Ajouter l'enregistrement MX :**
1. Cliquez sur **"Ajouter"**
2. Type : **MX**
3. Nom : **send**
4. Valeur : **feedback-smtp.resend.com**
5. Priorité : **10**
6. TTL : **1 heure**
7. Cliquez sur **"Enregistrer"**

---

### Option B : Namecheap

1. Connectez-vous à [namecheap.com](https://namecheap.com)
2. Allez dans **"Domain List"**
3. Cliquez sur **"Manage"** à côté de `academy.com`
4. Cliquez sur l'onglet **"Advanced DNS"**

**Ajouter l'enregistrement SPF :**
1. Cliquez sur **"Add New Record"**
2. Type : **TXT Record**
3. Host : **@**
4. Value : `v=spf1 include:_spf.resend.com ~all`
5. TTL : **Automatic**
6. Cliquez sur la coche verte ✓

**Ajouter l'enregistrement DKIM :**
1. Cliquez sur **"Add New Record"**
2. Type : **TXT Record**
3. Host : **resend._domainkey**
4. Value : [copiez la longue chaîne fournie par Resend]
5. TTL : **Automatic**
6. Cliquez sur la coche verte ✓

**Ajouter l'enregistrement MX :**
1. Cliquez sur **"Add New Record"**
2. Type : **MX Record**
3. Host : **send**
4. Value : **feedback-smtp.resend.com**
5. Priority : **10**
6. TTL : **Automatic**
7. Cliquez sur la coche verte ✓

---

### Option C : OVH

1. Connectez-vous à [ovh.com](https://ovh.com)
2. Allez dans **"Noms de domaine"**
3. Cliquez sur `academy.com`
4. Cliquez sur l'onglet **"Zone DNS"**
5. Cliquez sur **"Ajouter une entrée"**

**Ajouter l'enregistrement SPF :**
1. Sélectionnez **"TXT"**
2. Sous-domaine : laissez vide (ou mettez **@**)
3. Valeur : `v=spf1 include:_spf.resend.com ~all`
4. Cliquez sur **"Suivant"** puis **"Valider"**

**Ajouter l'enregistrement DKIM :**
1. Cliquez sur **"Ajouter une entrée"**
2. Sélectionnez **"TXT"**
3. Sous-domaine : **resend._domainkey**
4. Valeur : [copiez la longue chaîne fournie par Resend]
5. Cliquez sur **"Suivant"** puis **"Valider"**

**Ajouter l'enregistrement MX :**
1. Cliquez sur **"Ajouter une entrée"**
2. Sélectionnez **"MX"**
3. Sous-domaine : **send**
4. Priorité : **10**
5. Cible : **feedback-smtp.resend.com.**
6. Cliquez sur **"Suivant"** puis **"Valider"**

---

### Option D : Cloudflare

1. Connectez-vous à [cloudflare.com](https://cloudflare.com)
2. Sélectionnez votre site `academy.com`
3. Allez dans **"DNS"** (menu de gauche)

**Ajouter l'enregistrement SPF :**
1. Cliquez sur **"Add record"**
2. Type : **TXT**
3. Name : **@**
4. Content : `v=spf1 include:_spf.resend.com ~all`
5. TTL : **Auto**
6. Cliquez sur **"Save"**

**Ajouter l'enregistrement DKIM :**
1. Cliquez sur **"Add record"**
2. Type : **TXT**
3. Name : **resend._domainkey**
4. Content : [copiez la longue chaîne fournie par Resend]
5. TTL : **Auto**
6. Cliquez sur **"Save"**

**Ajouter l'enregistrement MX :**
1. Cliquez sur **"Add record"**
2. Type : **MX**
3. Name : **send**
4. Mail server : **feedback-smtp.resend.com**
5. Priority : **10**
6. TTL : **Auto**
7. Cliquez sur **"Save"**

---

## ✅ PARTIE 3 : Vérifier la configuration

### Étape 1 : Attendez la propagation DNS
- Les changements DNS peuvent prendre **5 à 30 minutes** (parfois jusqu'à 24h)
- Soyez patient ! ☕

### Étape 2 : Vérifiez dans Resend
1. Retournez sur votre page Resend (onglet "Domains")
2. Cliquez sur le bouton **"Verify DNS Records"**
3. Si tout est bon, vous verrez des coches vertes ✅

### Étape 3 : Testez l'envoi d'email
1. Dans Resend, allez dans **"API Keys"**
2. Utilisez votre clé API : `re_MtuXoYBT_BR5KtvijNLV9BYij2odAjVHo`
3. Je configurerai ensuite l'application pour utiliser `sionohmair@academy.com`

---

## 🆘 Problèmes courants

### ❌ "Domain not verifying"
**Solution :** Attendez 30 minutes et réessayez. Les DNS prennent du temps à se propager.

### ❌ "SPF record not found"
**Solution :** Vérifiez que vous avez bien mis **@** dans le champ "Name" (ou laissé vide selon le fournisseur).

### ❌ "DKIM record not found"
**Solution :** Vérifiez que vous avez bien copié **toute** la valeur fournie par Resend (elle est très longue).

### ❌ "MX record not found"
**Solution :** Vérifiez que vous avez bien mis **send** dans le champ "Name" et la priorité **10**.

---

## 📞 Besoin d'aide ?

Si vous rencontrez des difficultés :
1. Prenez une capture d'écran de votre interface DNS
2. Prenez une capture d'écran de la page Resend avec les enregistrements
3. Envoyez-moi ces captures et je vous aiderai !

---

## ⏭️ Prochaine étape

Une fois que Resend affiche des coches vertes ✅ pour tous les enregistrements :
1. **Dites-moi "C'est vérifié !"**
2. Je configurerai immédiatement l'application pour utiliser `sionohmair@academy.com`
3. Vous pourrez commencer à envoyer des emails ! 🎉

---

**Où en êtes-vous actuellement ?**
- [ ] Je dois encore ajouter les enregistrements DNS
- [ ] J'ai ajouté les enregistrements, j'attends la vérification
- [ ] C'est vérifié ! (coches vertes dans Resend)
- [ ] J'ai besoin d'aide
