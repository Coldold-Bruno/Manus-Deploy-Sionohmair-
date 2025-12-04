# 💎 Spécifications Premium - Sionohmair Insight Academy

## 🎯 Vue d'ensemble

Système de monétisation avec version gratuite limitée et version Premium illimitée avec fonctionnalités avancées.

---

## 📊 Comparaison Gratuit vs Premium

| Fonctionnalité | Gratuit | Premium |
|----------------|---------|---------|
| **Générateur de Copy** | 5 générations/mois | ✅ Illimité |
| **Analyseur de Contenu** | 10 analyses/mois | ✅ Illimité |
| **Persona Builder** | 3 avatars max | ✅ Illimité |
| **Correcteur** | 5 corrections/mois | ✅ Illimité |
| **Générateur de Citations** | 5 citations/mois | ✅ Illimité |
| **Frameworks** | PFPMA, APTEA, AIDA | ✅ Tous (+ PAS, PASTOR, BAB) |
| **Export** | Texte brut uniquement | ✅ PDF, DOCX, JSON |
| **Templates** | ❌ Non disponible | ✅ 50+ templates prêts |
| **Analytics** | Basique | ✅ Dashboard avancé |
| **Historique** | 30 jours | ✅ Illimité |
| **Support** | Email (48h) | ✅ Prioritaire (4h) |
| **API Access** | ❌ Non | ✅ Oui (1000 req/jour) |

---

## 💰 Tarification Stripe

### Plan Mensuel
- **Prix** : 29€/mois
- **Stripe Price ID** : `price_monthly_premium`
- **Facturation** : Mensuelle récurrente
- **Annulation** : Possible à tout moment

### Plan Annuel (Économie 20%)
- **Prix** : 279€/an (23.25€/mois)
- **Stripe Price ID** : `price_yearly_premium`
- **Facturation** : Annuelle
- **Économie** : 69€/an

### Essai Gratuit
- **Durée** : 14 jours
- **Carte requise** : Oui
- **Annulation** : Automatique si non converti

---

## 🔐 Système de Quotas

### Table `user_quotas`
```sql
CREATE TABLE user_quotas (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL REFERENCES users(id),
  
  -- Quotas mensuels
  copy_generations_used INTEGER DEFAULT 0,
  copy_generations_limit INTEGER DEFAULT 5,
  
  content_analyses_used INTEGER DEFAULT 0,
  content_analyses_limit INTEGER DEFAULT 10,
  
  avatars_count INTEGER DEFAULT 0,
  avatars_limit INTEGER DEFAULT 3,
  
  corrections_used INTEGER DEFAULT 0,
  corrections_limit INTEGER DEFAULT 5,
  
  quotes_used INTEGER DEFAULT 0,
  quotes_limit INTEGER DEFAULT 5,
  
  -- Reset mensuel
  reset_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  
  -- Premium
  is_premium BOOLEAN DEFAULT FALSE,
  premium_until TIMESTAMP,
  
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Logique de Vérification

```typescript
// Avant chaque génération
async function checkQuota(userId: string, type: QuotaType) {
  const quota = await getQuota(userId);
  
  // Si Premium, toujours OK
  if (quota.isPremium && quota.premiumUntil > new Date()) {
    return { allowed: true, isPremium: true };
  }
  
  // Vérifier le quota
  const used = quota[`${type}_used`];
  const limit = quota[`${type}_limit`];
  
  if (used >= limit) {
    return { 
      allowed: false, 
      isPremium: false,
      message: `Limite atteinte (${used}/${limit}). Passez Premium pour un accès illimité.`
    };
  }
  
  return { allowed: true, isPremium: false, remaining: limit - used };
}

// Après chaque génération
async function incrementQuota(userId: string, type: QuotaType) {
  await db.update(userQuotas)
    .set({ [`${type}_used`]: sql`${type}_used + 1` })
    .where(eq(userQuotas.userId, userId));
}
```

---

## 🎨 UX de Conversion

### 1. Banners de Limitation

Quand l'utilisateur atteint 80% du quota :
```
⚠️ Attention : Il vous reste 1 génération gratuite ce mois-ci.
[Passer Premium] pour un accès illimité.
```

Quand le quota est dépassé :
```
🚫 Limite mensuelle atteinte (5/5 générations)
Passez Premium pour continuer à générer du copy illimité.
[Voir les Plans Premium] [Plus tard]
```

### 2. Modal de Conversion

Affichage automatique au 5ème usage :
- Titre : "Vous adorez Sionohmair ! 🎉"
- Message : "Vous avez utilisé toutes vos générations gratuites. Passez Premium pour débloquer l'accès illimité."
- CTA : "Essayer Premium 14 jours gratuits"
- Lien : "Continuer en gratuit"

### 3. Badge Premium

Affichage sur tous les outils Premium :
```
💎 PREMIUM
Fonctionnalité réservée aux membres Premium
[Débloquer maintenant]
```

---

## 📄 Page de Tarification

### URL : `/fr/pricing`

### Structure

**Hero Section**
- Titre : "Choisissez votre Plan"
- Sous-titre : "Commencez gratuitement, passez Premium quand vous êtes prêt"

**Tableau Comparatif**
- 3 colonnes : Gratuit | Premium Mensuel | Premium Annuel
- Highlight sur Premium Mensuel (recommandé)
- Badge "Économisez 20%" sur Annuel

**FAQ**
- Puis-je annuler à tout moment ?
- Que se passe-t-il après l'essai gratuit ?
- Puis-je changer de plan ?
- Les quotas se cumulent-ils ?

**Témoignages**
- 3 témoignages d'utilisateurs Premium
- Photos + noms + résultats chiffrés

---

## 🔧 Fonctionnalités Premium Avancées

### 1. Dashboard Analytics

**URL** : `/fr/dashboard/analytics`

**Métriques affichées** :
- Nombre total de générations
- Frameworks les plus utilisés
- Taux de conversion moyen des copies
- Évolution mensuelle
- Avatars les plus performants

**Visualisations** :
- Graphique en ligne : Générations par jour
- Graphique en barres : Frameworks utilisés
- Radar : Performance par dimension PFPMA

### 2. Templates Prêts à l'Emploi

**URL** : `/fr/templates`

**Catégories** :
- Landing Pages (15 templates)
- Emails de Vente (10 templates)
- Pages de Vente Longues (8 templates)
- Publicités Facebook/Instagram (12 templates)
- Scripts Vidéo (5 templates)

**Fonctionnalités** :
- Prévisualisation
- Personnalisation par variables
- Export direct vers Générateur de Copy

### 3. Exports Avancés

**Formats disponibles** :
- PDF (avec mise en page professionnelle)
- DOCX (compatible Word)
- JSON (pour intégrations)
- HTML (pour sites web)

**Options** :
- Logo personnalisé
- Couleurs de marque
- Footer personnalisé

### 4. API Access

**Endpoint** : `https://api.sionohmair.com/v1/`

**Méthodes** :
- `POST /generate-copy` : Générer du copy
- `POST /analyze-content` : Analyser du contenu
- `GET /avatars` : Récupérer les avatars
- `POST /correct-text` : Corriger un texte

**Authentification** : Bearer token
**Rate limit** : 1000 requêtes/jour

---

## 🛠️ Implémentation Technique

### 1. Middleware de Vérification

```typescript
// server/middleware/checkPremium.ts
export const checkPremium = async (userId: string) => {
  const quota = await db.query.userQuotas.findFirst({
    where: eq(userQuotas.userId, userId)
  });
  
  if (!quota) return false;
  
  return quota.isPremium && quota.premiumUntil > new Date();
};

export const checkQuotaMiddleware = (type: QuotaType) => {
  return async (userId: string) => {
    const result = await checkQuota(userId, type);
    
    if (!result.allowed) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: result.message
      });
    }
    
    return result;
  };
};
```

### 2. Procédures tRPC Modifiées

```typescript
// Exemple : generateCopy
generateCopy: protectedProcedure
  .input(generateCopySchema)
  .mutation(async ({ ctx, input }) => {
    // 1. Vérifier le quota
    const quotaCheck = await checkQuota(ctx.user.id, 'copy_generations');
    
    if (!quotaCheck.allowed) {
      throw new TRPCError({
        code: 'FORBIDDEN',
        message: quotaCheck.message,
        cause: 'QUOTA_EXCEEDED'
      });
    }
    
    // 2. Générer le copy
    const result = await generateCopyWithAI(input);
    
    // 3. Incrémenter le quota (sauf si Premium)
    if (!quotaCheck.isPremium) {
      await incrementQuota(ctx.user.id, 'copy_generations');
    }
    
    // 4. Retourner avec info quota
    return {
      ...result,
      quotaInfo: {
        isPremium: quotaCheck.isPremium,
        remaining: quotaCheck.remaining
      }
    };
  })
```

### 3. Webhook Stripe

```typescript
// server/routes/stripe-webhook.ts
app.post('/api/stripe/webhook', async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  
  switch (event.type) {
    case 'checkout.session.completed':
      // Activer Premium
      await activatePremium(event.data.object);
      break;
      
    case 'customer.subscription.deleted':
      // Désactiver Premium
      await deactivatePremium(event.data.object);
      break;
      
    case 'invoice.payment_failed':
      // Notifier l'utilisateur
      await notifyPaymentFailed(event.data.object);
      break;
  }
  
  res.json({ received: true });
});
```

---

## 📱 Composants UI

### PremiumBadge
```tsx
<PremiumBadge 
  feature="Générateur de Copy Illimité"
  onUpgrade={() => router.push('/fr/pricing')}
/>
```

### QuotaDisplay
```tsx
<QuotaDisplay 
  used={3}
  limit={5}
  type="copy_generations"
  isPremium={false}
/>
```

### UpgradeModal
```tsx
<UpgradeModal 
  isOpen={showUpgrade}
  onClose={() => setShowUpgrade(false)}
  feature="copy_generation"
  message="Vous avez atteint votre limite mensuelle"
/>
```

---

## 🎯 KPIs de Conversion

### Métriques à Suivre

1. **Taux de conversion Gratuit → Premium** : Objectif 5%
2. **Temps moyen avant conversion** : Objectif < 7 jours
3. **Taux de rétention Premium** : Objectif > 85%
4. **Valeur vie client (LTV)** : Objectif > 300€
5. **Taux d'annulation** : Objectif < 5%/mois

### A/B Tests à Réaliser

- Prix (27€ vs 29€ vs 32€)
- Durée essai gratuit (7j vs 14j vs 30j)
- Position CTA (header vs sidebar vs modal)
- Message de limitation (urgence vs bénéfice)

---

## 📅 Plan de Déploiement

### Phase 1 : Infrastructure (Jour 1-2)
- [x] Créer table `user_quotas`
- [ ] Implémenter middleware de vérification
- [ ] Créer les procédures tRPC modifiées
- [ ] Tester le système de quotas

### Phase 2 : Stripe (Jour 2-3)
- [ ] Créer les produits Stripe
- [ ] Configurer les webhooks
- [ ] Implémenter la page de paiement
- [ ] Tester le flux complet

### Phase 3 : UI/UX (Jour 3-4)
- [ ] Créer la page de tarification
- [ ] Implémenter les composants Premium
- [ ] Ajouter les CTA de conversion
- [ ] Tester l'expérience utilisateur

### Phase 4 : Fonctionnalités Premium (Jour 4-5)
- [ ] Dashboard Analytics
- [ ] Templates
- [ ] Exports avancés
- [ ] API Access

### Phase 5 : Tests & Lancement (Jour 5-6)
- [ ] Tests end-to-end
- [ ] Tests de paiement (mode test Stripe)
- [ ] Documentation
- [ ] Lancement soft

---

## ✅ Checklist de Validation

- [ ] Les quotas se réinitialisent correctement chaque mois
- [ ] Le paiement Stripe fonctionne (test mode)
- [ ] L'activation Premium est instantanée après paiement
- [ ] Les webhooks Stripe sont bien reçus
- [ ] Les utilisateurs Premium n'ont pas de limitations
- [ ] Les CTA de conversion sont bien placés
- [ ] La page de tarification est claire et convaincante
- [ ] Les exports Premium fonctionnent
- [ ] Le dashboard Analytics affiche les bonnes données
- [ ] L'annulation d'abonnement fonctionne correctement

---

**Prêt pour implémentation !** 🚀
