# 🎯 Guide Visuel : Interface Resend Pas à Pas

Ce guide vous montre **exactement** où cliquer dans l'interface Resend pour configurer votre domaine `academy.com`.

---

## 🔐 ÉTAPE 1 : Se connecter à Resend

### Action à faire :
1. Ouvrez votre navigateur
2. Allez sur : **https://resend.com/login**
3. Entrez votre email et mot de passe
4. Cliquez sur **"Sign in"**

### Ce que vous devez voir :
Après connexion, vous arrivez sur le **Dashboard** (tableau de bord) de Resend.

```
┌─────────────────────────────────────────────────────────┐
│ Resend                                          [Avatar] │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  📊 Dashboard                                            │
│  📧 Emails                                               │
│  🌐 Domains          ← VOUS ALLEZ CLIQUER ICI           │
│  🔑 API Keys                                             │
│  📈 Analytics                                            │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 🌐 ÉTAPE 2 : Accéder à la section Domains

### Action à faire :
1. Dans le menu de gauche (sidebar), cherchez l'icône 🌐
2. Cliquez sur **"Domains"**

### Ce que vous devez voir :
Une page avec le titre "Domains" et un bouton bleu en haut à droite.

```
┌─────────────────────────────────────────────────────────┐
│ Domains                              [+ Add Domain]      │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Vous n'avez peut-être aucun domaine pour le moment     │
│  ou vous voyez une liste de domaines existants          │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## ➕ ÉTAPE 3 : Ajouter votre domaine

### Action à faire :
1. Cliquez sur le bouton bleu **"+ Add Domain"** (en haut à droite)

### Ce que vous devez voir :
Une fenêtre popup (modale) s'ouvre avec un formulaire.

```
┌─────────────────────────────────────────────────────────┐
│                     Add Domain                      [X]  │
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Domain name *                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ example.com                                      │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  Region                                                  │
│  ┌─────────────────────────────────────────────────┐   │
│  │ US East (N. Virginia) ▼                          │   │
│  └─────────────────────────────────────────────────┘   │
│                                                           │
│  [Cancel]                              [Add Domain]      │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Action à faire :
1. **Effacez** le texte "example.com"
2. **Tapez** : `academy.com`
3. Laissez la région par défaut (US East)
4. Cliquez sur le bouton bleu **"Add Domain"**

---

## 📋 ÉTAPE 4 : Récupérer les enregistrements DNS

### Ce que vous devez voir :
Après avoir cliqué sur "Add Domain", Resend affiche une page avec **3 sections** :

```
┌─────────────────────────────────────────────────────────┐
│ academy.com                                    [Settings]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Status: Pending verification ⏳                         │
│                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  📝 SPF Record                                           │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Type: TXT                                        │   │
│  │ Name: @                                          │   │
│  │ Value: v=spf1 include:_spf.resend.com ~all      │   │
│  └─────────────────────────────────────────────────┘   │
│  [Copy]                                                  │
│                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  🔐 DKIM Record                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Type: TXT                                        │   │
│  │ Name: resend._domainkey                          │   │
│  │ Value: p=MIGfMA0GCSqGSIb3DQEBAQUAA4GNA...       │   │
│  │        (très longue chaîne)                      │   │
│  └─────────────────────────────────────────────────┘   │
│  [Copy]                                                  │
│                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  📬 MX Record (Return Path)                              │
│  ┌─────────────────────────────────────────────────┐   │
│  │ Type: MX                                         │   │
│  │ Name: send                                       │   │
│  │ Priority: 10                                     │   │
│  │ Value: feedback-smtp.resend.com                  │   │
│  └─────────────────────────────────────────────────┘   │
│  [Copy]                                                  │
│                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  [Verify DNS Records]                                    │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

---

## 📝 ÉTAPE 5 : Noter les informations DNS

### Action à faire :
Pour chaque enregistrement, **cliquez sur le bouton "Copy"** pour copier les valeurs.

### 1️⃣ Enregistrement SPF
Cliquez sur **[Copy]** sous "SPF Record" et notez :
```
Type: TXT
Name: @
Value: v=spf1 include:_spf.resend.com ~all
```

### 2️⃣ Enregistrement DKIM
Cliquez sur **[Copy]** sous "DKIM Record" et notez :
```
Type: TXT
Name: resend._domainkey
Value: [une TRÈS longue chaîne qui commence par p=MIGfMA0G...]
```
⚠️ **IMPORTANT** : Cette valeur est très longue (plusieurs lignes). Copiez-la en entier !

### 3️⃣ Enregistrement MX
Cliquez sur **[Copy]** sous "MX Record" et notez :
```
Type: MX
Name: send
Priority: 10
Value: feedback-smtp.resend.com
```

---

## 💡 ASTUCE : Gardez cette page ouverte !

**NE FERMEZ PAS** cette page Resend ! Vous en aurez besoin pour :
1. Copier les valeurs DNS
2. Vérifier la configuration après avoir ajouté les enregistrements

---

## ⏭️ ÉTAPE 6 : Ajouter les DNS chez votre fournisseur

Maintenant que vous avez les 3 enregistrements, vous devez les ajouter dans votre gestionnaire de domaine.

**Question importante :** Où avez-vous acheté le domaine `academy.com` ?
- GoDaddy ?
- Namecheap ?
- OVH ?
- Cloudflare ?
- Autre ?

**Dites-moi et je vous donnerai les instructions spécifiques pour votre fournisseur !**

---

## ✅ ÉTAPE 7 : Vérifier la configuration (APRÈS avoir ajouté les DNS)

### Quand faire cette étape ?
**Seulement après** avoir ajouté les 3 enregistrements DNS chez votre fournisseur ET attendu 15-30 minutes.

### Action à faire :
1. Retournez sur la page Resend (celle que vous avez gardée ouverte)
2. Cliquez sur le bouton **"Verify DNS Records"** (en bas de la page)

### Ce que vous devez voir si tout est OK :
```
┌─────────────────────────────────────────────────────────┐
│ academy.com                                    [Settings]│
├─────────────────────────────────────────────────────────┤
│                                                           │
│  Status: Verified ✅                                     │
│                                                           │
│  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│                                                           │
│  ✅ SPF Record - Verified                                │
│  ✅ DKIM Record - Verified                               │
│  ✅ MX Record - Verified                                 │
│                                                           │
└─────────────────────────────────────────────────────────┘
```

### Si vous voyez des ❌ (croix rouges) :
- Attendez encore 15-30 minutes
- Vérifiez que vous avez bien copié toutes les valeurs
- Réessayez "Verify DNS Records"

---

## 🎉 ÉTAPE 8 : Configuration terminée !

Quand vous voyez **3 coches vertes ✅**, c'est bon !

**Dites-moi : "C'est vérifié !"** et je configurerai immédiatement votre application pour utiliser `sionohmair@academy.com` pour tous les emails.

---

## 📍 Où êtes-vous actuellement ?

Cochez votre progression :

- [ ] **Étape 1-2** : Je suis connecté à Resend et j'ai ouvert "Domains"
- [ ] **Étape 3** : J'ai cliqué sur "Add Domain"
- [ ] **Étape 4-5** : J'ai ajouté `academy.com` et je vois les 3 enregistrements DNS
- [ ] **Étape 6** : J'ai ajouté les DNS chez mon fournisseur (GoDaddy, etc.)
- [ ] **Étape 7** : J'attends la vérification (15-30 min)
- [ ] **Étape 8** : ✅ C'est vérifié ! (3 coches vertes)

**Dites-moi où vous en êtes et je vous aide pour la suite !** 😊
