# Guide de Test Complet - Système NFT de Gratitude Économique

Ce document fournit un protocole de test détaillé pour valider le fonctionnement end-to-end du système NFT de Gratitude Économique, de la correction initiale jusqu'au paiement de la redevabilité.

---

## 📋 Vue d'Ensemble du Flux

Le système NFT de Gratitude Économique suit ce flux complet :

**Gratuité Initiale** → **Utilisation** → **Génération de Bénéfices** → **Détection Automatique** → **Notification** → **Contribution** → **Enrichissement NFT**

Ce guide vous permet de tester chaque étape de ce flux pour garantir que le système fonctionne correctement.

---

## ✅ Prérequis

Avant de commencer les tests, assurez-vous que les éléments suivants sont en place.

### 1. NFT Sources Initialisés

Les 3 NFT Sources doivent être créés dans la base de données. Pour vérifier leur présence, accédez à la page d'administration `/admin/seed-nft`. Si les NFT Sources n'existent pas encore, la page les créera automatiquement au chargement. Vous devriez voir apparaître trois sources : **Correcteur Universel de Contenu** (5%), **Formation Sprint de Clarté** (7%), et **Coaching Zoom Personnalisé** (10%).

### 2. Compte Utilisateur Créé

Vous devez disposer d'un compte utilisateur actif pour tester le flux complet. Si vous n'avez pas encore de compte, créez-en un via le système d'authentification de l'application.

### 3. Base de Données Accessible

Vérifiez que la base de données est accessible et que toutes les tables nécessaires ont été créées via les migrations Drizzle. Les tables clés incluent `nft_sources`, `nft_beneficiaries`, `nft_contributions`, `nft_royalty_tracking`, `nft_royalty_alerts`, `corrections_history`, `benefit_detections`, et `honofication_inquiries`.

---

## 🧪 Test 1 : Initialisation des NFT Sources

**Objectif** : Vérifier que les NFT Sources sont correctement créés dans la base de données.

### Étapes

1. Accédez à `/admin/seed-nft`
2. La page devrait automatiquement détecter si les NFT Sources existent
3. Si aucun NFT Source n'existe, la page lance automatiquement l'initialisation
4. Vérifiez que le message de succès s'affiche : **"3 NFT Sources créés avec succès"**
5. Vérifiez que les 3 NFT Sources apparaissent dans la liste avec leurs détails (nom, catégorie, pourcentage, facteur α)

### Résultat Attendu

Trois NFT Sources doivent être créés avec les caractéristiques suivantes :

| NFT Source | Catégorie | Redevabilité | Facteur α |
|-----------|-----------|--------------|-----------|
| Correcteur Universel de Contenu | service | 5% | ×22.67 |
| Formation Sprint de Clarté | formation | 7% | ×22.67 |
| Coaching Zoom Personnalisé | coaching | 10% | ×22.67 |

### Validation

Cliquez à nouveau sur le bouton **"Initialiser les NFT Sources"**. Le système devrait afficher le message **"Les NFT Sources existent déjà"** sans créer de doublons, confirmant que l'opération est idempotente.

---

## 🧪 Test 2 : Utilisation du Correcteur Universel

**Objectif** : Vérifier que le Correcteur Universel fonctionne et enregistre les corrections dans l'historique.

### Étapes

1. Accédez à `/correcteur`
2. Sélectionnez le type de correction : **Texte (PFPMA)**
3. Collez le texte suivant dans le champ de saisie :

```
Nous proposons des solutions innovantes pour améliorer votre communication. 
Notre méthodologie unique permet d'augmenter vos conversions de manière significative.
```

4. Cliquez sur **"Analyser et Corriger"**
5. Attendez que l'IA génère l'analyse PFPMA et la version corrigée
6. Vérifiez que les résultats affichent :
   - Un score de clarté avant/après
   - Les 3 frictions identifiées (Attention, Cognitive, Émotionnelle)
   - Une version corrigée du texte

### Résultat Attendu

Le système devrait afficher une analyse complète avec un score de clarté avant (par exemple 12/20) et un score après correction (par exemple 18/20). La version corrigée doit être plus claire et structurée selon la méthode PFPMA.

### Validation

Accédez à `/correcteur` et vérifiez que la correction apparaît dans l'historique en bas de page avec la date, le type, et les scores.

---

## 🧪 Test 3 : Marquer une Correction comme Utilisée

**Objectif** : Vérifier que le système enregistre l'utilisation d'une correction et crée un lien avec le NFT Source.

### Étapes

1. Dans l'historique des corrections (en bas de `/correcteur`), localisez la correction que vous venez de créer
2. Cliquez sur le bouton **"Marquer comme utilisé"**
3. Confirmez l'action dans la boîte de dialogue
4. Vérifiez que le statut de la correction passe de **"Non utilisé"** à **"Utilisé"**

### Résultat Attendu

Le système devrait afficher un message de succès : **"Correction marquée comme utilisée"**. Le statut de la correction dans l'historique doit changer visuellement (par exemple, avec un badge vert **"Utilisé"**).

### Validation

Accédez à `/dashboard/nft-royalties` et vérifiez qu'une nouvelle alerte de redevabilité a été créée avec le type **"correction_used"** et le statut **"pending"**.

---

## 🧪 Test 4 : Vérification du Dashboard NFT Gratitude

**Objectif** : Vérifier que le dashboard NFT affiche correctement les informations du bénéficiaire.

### Étapes

1. Accédez à `/dashboard/nft-gratitude`
2. Vérifiez que votre profil NFT s'affiche avec :
   - Votre niveau de gratitude actuel (par défaut : **Bronze** si aucune contribution)
   - Le badge NFT visuel correspondant
   - Le total de vos contributions (0€ au début)
   - L'historique de vos contributions (vide au début)

### Résultat Attendu

Le dashboard devrait afficher un profil NFT complet avec le badge **Bronze** et un message indiquant que vous n'avez pas encore de contributions enregistrées.

### Validation

Vérifiez que le badge NFT affiché correspond bien au fichier `/nft-badge-bronze.png` généré précédemment.

---

## 🧪 Test 5 : Vérification du Dashboard Redevances Temps Réel

**Objectif** : Vérifier que le dashboard des redevances affiche les alertes en temps réel.

### Étapes

1. Accédez à `/dashboard/nft-royalties`
2. Vérifiez que l'alerte créée à l'étape Test 3 apparaît dans la liste
3. Vérifiez les détails de l'alerte :
   - Type : **correction_used**
   - Statut : **pending**
   - Montant estimé : **0€** (car aucun bénéfice n'a encore été déclaré)
   - Date de création : date actuelle

### Résultat Attendu

Le dashboard devrait afficher au moins une alerte de redevabilité avec le statut **"En attente"** et un bouton **"Déclarer Bénéfice"**.

### Validation

Cliquez sur le bouton **"Déclarer Bénéfice"**. Un formulaire devrait s'ouvrir vous permettant de saisir le montant des bénéfices générés grâce à la correction.

---

## 🧪 Test 6 : Déclaration Manuelle de Bénéfices

**Objectif** : Vérifier que le système calcule correctement la redevabilité après déclaration de bénéfices.

### Étapes

1. Dans le dashboard `/dashboard/nft-royalties`, cliquez sur **"Déclarer Bénéfice"** pour l'alerte créée
2. Saisissez un montant de bénéfice : **1000€**
3. Ajoutez une description : **"Augmentation des conversions grâce au texte corrigé"**
4. Cliquez sur **"Soumettre"**
5. Vérifiez que le système calcule automatiquement la redevabilité : **5% de 1000€ = 50€**

### Résultat Attendu

Le système devrait afficher un message de succès : **"Bénéfice déclaré avec succès. Redevabilité calculée : 50€"**. L'alerte devrait passer au statut **"Redevabilité calculée"** avec le montant dû affiché.

### Validation

Vérifiez que le montant de **50€** apparaît dans la colonne **"Montant Dû"** de l'alerte. Un bouton **"Payer"** devrait également apparaître.

---

## 🧪 Test 7 : Vérification du Dashboard Honofication

**Objectif** : Vérifier que le système d'honofication détecte et enregistre les bénéfices déclarés.

### Étapes

1. Accédez à `/dashboard/honofication`
2. Vérifiez que la déclaration de bénéfice apparaît dans la section **"Détections Récentes"**
3. Vérifiez les détails de la détection :
   - Type : **benefit_declared**
   - Montant : **1000€**
   - Redevabilité calculée : **50€**
   - Statut : **pending**

### Résultat Attendu

Le dashboard d'honofication devrait afficher la détection avec un indice de confiance élevé (par exemple **95%**) car il s'agit d'une déclaration volontaire.

### Validation

Vérifiez que la détection est liée au bon NFT Source (**Correcteur Universel de Contenu**) et au bon bénéficiaire (vous).

---

## 🧪 Test 8 : Simulation de Paiement (Sans Stripe Réel)

**Objectif** : Vérifier que le bouton de paiement fonctionne et redirige vers Stripe (ou affiche un message si Stripe n'est pas configuré).

### Étapes

1. Dans le dashboard `/dashboard/nft-royalties`, cliquez sur le bouton **"Payer"** pour l'alerte avec redevabilité calculée
2. Si Stripe est configuré, vous devriez être redirigé vers la page de paiement Stripe
3. Si Stripe n'est pas configuré, un message d'erreur devrait s'afficher : **"Stripe n'est pas configuré. Veuillez contacter l'administrateur."**

### Résultat Attendu

Si Stripe est configuré, la redirection vers Stripe Checkout devrait fonctionner avec le montant correct (**50€**). Si Stripe n'est pas configuré, un message d'erreur clair devrait apparaître.

### Validation

Pour tester sans payer réellement, vous pouvez utiliser les cartes de test Stripe (par exemple `4242 4242 4242 4242` avec n'importe quelle date future et CVC). Après un paiement test réussi, vérifiez que le statut de l'alerte passe à **"Payé"** et que votre niveau NFT augmente si le total des contributions dépasse le seuil (1000€ pour passer à Argent).

---

## 🧪 Test 9 : Vérification de l'Enrichissement du NFT Source

**Objectif** : Vérifier que le NFT Source s'enrichit après une contribution.

### Étapes

1. Accédez à `/admin/nft-gratitude`
2. Localisez le NFT Source **"Correcteur Universel de Contenu"**
3. Vérifiez la valeur actuelle du NFT avant contribution
4. Simulez une contribution de **50€** (via le test précédent ou manuellement en base de données)
5. Rechargez la page et vérifiez que la valeur du NFT a augmenté de **50€ × 22.67 = 1133.50€**

### Résultat Attendu

La valeur du NFT Source devrait augmenter proportionnellement selon le facteur α (×22.67). Par exemple, si la valeur initiale était **0€**, elle devrait passer à **1133.50€** après une contribution de **50€**.

### Validation

Vérifiez que l'historique des contributions du NFT Source affiche la nouvelle contribution avec la date, le montant, et le bénéficiaire.

---

## 🧪 Test 10 : Vérification de l'Évolution du Niveau de Gratitude

**Objectif** : Vérifier que le niveau de gratitude du bénéficiaire évolue selon le total des contributions.

### Étapes

1. Accédez à `/dashboard/nft-gratitude`
2. Vérifiez votre niveau actuel (par défaut : **Bronze** pour 0-999€)
3. Effectuez plusieurs contributions jusqu'à atteindre **1000€** de total
4. Rechargez la page et vérifiez que votre niveau passe à **Argent**
5. Vérifiez que le badge NFT change pour afficher `/nft-badge-argent.png`

### Résultat Attendu

Le niveau de gratitude devrait évoluer selon le tableau suivant :

| Niveau | Plage de Contributions | Badge |
|--------|------------------------|-------|
| Bronze | 100€ - 999€ | nft-badge-bronze.png |
| Argent | 1 000€ - 4 999€ | nft-badge-argent.png |
| Or | 5 000€ - 19 999€ | nft-badge-or.png |
| Platine | 20 000€ - 99 999€ | nft-badge-platine.png |
| Diamant | 100 000€+ | nft-badge-diamant.png |

### Validation

Vérifiez que le pourcentage de redevabilité change également selon le niveau (par exemple, **5%** pour Argent au lieu de **3%** pour Bronze).

---

## 🧪 Test 11 : Test de Détection Automatique (Stripe)

**Objectif** : Vérifier que le système détecte automatiquement les transactions Stripe.

### Prérequis

Vous devez avoir configuré une vraie clé API Stripe dans `/admin/api-keys`.

### Étapes

1. Accédez à `/admin/api-keys`
2. Ajoutez votre clé Stripe (format : `sk_live_...` ou `sk_test_...`)
3. Le système valide automatiquement la clé avant de l'enregistrer
4. Effectuez une transaction test sur votre compte Stripe (par exemple, un paiement de **100€**)
5. Attendez que le cron job quotidien s'exécute (ou déclenchez-le manuellement via `/api/trpc/cron.runDailyDetection`)
6. Accédez à `/admin/honofication` et vérifiez qu'une nouvelle détection apparaît avec le type **"transaction_detected"**

### Résultat Attendu

Le système devrait détecter automatiquement la transaction Stripe et créer une alerte de redevabilité avec le montant calculé (par exemple, **5€** pour une transaction de **100€** avec un taux de 5%).

### Validation

Vérifiez que la détection affiche les détails de la transaction (montant, date, ID de transaction Stripe) et qu'une notification a été envoyée au bénéficiaire.

---

## 🧪 Test 12 : Test de Scraping OSINT (Mentions Publiques)

**Objectif** : Vérifier que le système détecte les mentions publiques de Sionohmair dans un contexte commercial.

### Prérequis

Vous devez avoir configuré une vraie clé API Google Search dans `/admin/api-keys`.

### Étapes

1. Accédez à `/admin/api-keys`
2. Ajoutez votre clé Google Search API et votre CX (Custom Search Engine ID)
3. Le système valide automatiquement la clé avant de l'enregistrer
4. Publiez un article de blog ou un post LinkedIn mentionnant **"Sionohmair Insight Academy"** dans un contexte commercial (par exemple, **"Grâce à Sionohmair, j'ai augmenté mes conversions de 250%"**)
5. Attendez que le cron job hebdomadaire s'exécute (ou déclenchez-le manuellement via `/api/trpc/cron.runWeeklyDetection`)
6. Accédez à `/admin/honofication` et vérifiez qu'une nouvelle détection apparaît avec le type **"public_mention_detected"**

### Résultat Attendu

Le système devrait détecter automatiquement la mention publique et créer une enquête de recouvrement avec un indice de confiance moyen (par exemple **60%**) car il s'agit d'une détection indirecte.

### Validation

Vérifiez que la détection affiche l'URL de la mention, un extrait du texte, et un lien vers l'enquête de recouvrement.

---

## 🧪 Test 13 : Test des Emails Automatiques

**Objectif** : Vérifier que le système envoie automatiquement les emails de notification, rappel, et mise en demeure.

### Prérequis

Vous devez avoir configuré une vraie clé API SendGrid ou Mailgun dans `/admin/api-keys`.

### Étapes

1. Accédez à `/admin/api-keys`
2. Ajoutez votre clé SendGrid (format : `SG....`) ou Mailgun
3. Le système valide automatiquement la clé avant de l'enregistrer
4. Créez une alerte de redevabilité (via Test 6)
5. Attendez que le cron job quotidien s'exécute (ou déclenchez-le manuellement via `/api/trpc/cron.runDailyReminders`)
6. Vérifiez que vous recevez un email de notification avec les détails de la redevabilité

### Résultat Attendu

Vous devriez recevoir un email avec le sujet **"Notification de Redevabilité - Sionohmair Insight Academy"** contenant :
- Le montant dû
- La date limite de paiement (30 jours)
- Un lien pour payer directement
- Un lien pour contester

### Validation

Vérifiez que l'email est bien formaté (HTML), contient toutes les informations nécessaires, et que les liens fonctionnent.

---

## 🧪 Test 14 : Test du Tribunal Arbitral

**Objectif** : Vérifier que le système de contestation et d'arbitrage fonctionne correctement.

### Étapes

1. Accédez à `/dashboard/honofication`
2. Localisez une alerte de redevabilité avec le statut **"pending"**
3. Cliquez sur le bouton **"Contester"**
4. Remplissez le formulaire de contestation avec une raison valide (par exemple, **"Les bénéfices déclarés sont incorrects"**)
5. Soumettez la contestation
6. Accédez à `/admin/honofication` (en tant qu'administrateur)
7. Vérifiez qu'une nouvelle contestation apparaît avec le statut **"pending_arbitration"**
8. Assignez 3 arbitres à la contestation
9. Simulez les votes des arbitres (2 pour, 1 contre)
10. Vérifiez que la décision finale est **"approved"** (majorité pour)

### Résultat Attendu

Le système devrait créer une contestation, assigner des arbitres, collecter les votes, et calculer la décision finale selon la règle de majorité (2/3 minimum).

### Validation

Vérifiez que le statut de l'alerte change selon la décision arbitrale :
- Si **approved** : l'alerte est annulée
- Si **rejected** : l'alerte reste active avec une pénalité de +5%

---

## 🧪 Test 15 : Test de la Page de Présentation NFT Gratitude

**Objectif** : Vérifier que la page de présentation `/nft-gratitude` affiche correctement toutes les informations.

### Étapes

1. Accédez à `/nft-gratitude`
2. Vérifiez que la page affiche :
   - Le titre principal : **"La Gratitude comme Modèle Économique"**
   - Les 3 principes (Gratuité Initiale, Bénéfices Générés, Redevabilité)
   - Les 5 niveaux de gratitude avec leurs badges visuels
   - Le fonctionnement en 4 étapes
   - Les avantages du système
   - Les CTA (Call-to-Action) vers `/correcteur` et `/dashboard/nft-gratitude`

### Résultat Attendu

La page devrait être visuellement attrayante, avec des badges NFT bien affichés, des sections claires, et des boutons fonctionnels.

### Validation

Cliquez sur les boutons CTA et vérifiez qu'ils redirigent vers les bonnes pages (`/correcteur` et `/dashboard/nft-gratitude`).

---

## 📊 Récapitulatif des Tests

Voici un tableau récapitulatif de tous les tests avec leurs statuts attendus.

| Test | Objectif | Statut Attendu |
|------|----------|----------------|
| Test 1 | Initialisation des NFT Sources | ✅ 3 NFT Sources créés |
| Test 2 | Utilisation du Correcteur Universel | ✅ Correction enregistrée |
| Test 3 | Marquer une Correction comme Utilisée | ✅ Alerte créée |
| Test 4 | Dashboard NFT Gratitude | ✅ Profil affiché |
| Test 5 | Dashboard Redevances Temps Réel | ✅ Alerte affichée |
| Test 6 | Déclaration Manuelle de Bénéfices | ✅ Redevabilité calculée |
| Test 7 | Dashboard Honofication | ✅ Détection affichée |
| Test 8 | Simulation de Paiement | ✅ Redirection Stripe |
| Test 9 | Enrichissement du NFT Source | ✅ Valeur augmentée |
| Test 10 | Évolution du Niveau de Gratitude | ✅ Niveau changé |
| Test 11 | Détection Automatique Stripe | ✅ Transaction détectée |
| Test 12 | Scraping OSINT | ✅ Mention détectée |
| Test 13 | Emails Automatiques | ✅ Email reçu |
| Test 14 | Tribunal Arbitral | ✅ Décision rendue |
| Test 15 | Page de Présentation | ✅ Page affichée |

---

## 🐛 Dépannage

Si un test échoue, voici quelques pistes de dépannage.

### Erreur : "NFT Sources non trouvés"

**Cause** : Les NFT Sources n'ont pas été initialisés correctement.

**Solution** : Accédez à `/admin/seed-nft` et cliquez sur **"Initialiser les NFT Sources"**. Si l'erreur persiste, vérifiez que la base de données est accessible et que les migrations ont été appliquées.

### Erreur : "Impossible de calculer la redevabilité"

**Cause** : Le NFT Source lié à la correction n'existe pas ou le pourcentage de redevabilité est invalide.

**Solution** : Vérifiez que le NFT Source existe dans la base de données et que le champ `baseRoyaltyPercentage` est correctement défini (entre 0 et 100).

### Erreur : "Stripe n'est pas configuré"

**Cause** : La clé API Stripe n'a pas été ajoutée dans `/admin/api-keys`.

**Solution** : Accédez à `/admin/api-keys`, ajoutez votre clé Stripe (format `sk_live_...` ou `sk_test_...`), et vérifiez qu'elle est validée avec succès.

### Erreur : "Email non envoyé"

**Cause** : La clé API SendGrid ou Mailgun n'a pas été configurée correctement.

**Solution** : Accédez à `/admin/api-keys`, ajoutez votre clé SendGrid (format `SG....`) ou Mailgun, et vérifiez qu'elle est validée avec succès. Assurez-vous également que le domaine d'envoi est vérifié dans SendGrid/Mailgun.

### Erreur : "Détection automatique ne fonctionne pas"

**Cause** : Les cron jobs ne sont pas configurés ou les clés API sont invalides.

**Solution** : Suivez le guide `CRON_SETUP.md` pour configurer les cron jobs via GitHub Actions, Vercel Cron, ou crontab Linux. Vérifiez également que les clés API (Stripe, PayPal, Google Analytics, Google Search) sont valides et actives.

---

## 📞 Support

Si vous rencontrez des problèmes non couverts par ce guide, consultez la documentation complète ou contactez le support Sionohmair Insight Academy.

---

**Auteur** : Manus AI  
**Date** : 27 novembre 2024  
**Version** : 1.0
