# 🔴 BUGS CRITIQUES IDENTIFIÉS

Date: 30 novembre 2025
Version testée: fea11a4c

---

## 🚨 BUG CRITIQUE #1: Erreur 500 sur tous les outils IA

**Statut:** 🔴 CRITIQUE - Bloque toutes les fonctionnalités principales

**Description:**
Tous les outils de copywriting (Analyseur, Générateur, probablement Persona Builder aussi) retournent une erreur 500 lors de l'appel à l'API.

**Symptômes:**
1. **Analyseur de Contenu:**
   - Formulaire s'affiche correctement ✅
   - Saisie du contenu fonctionne ✅
   - Clic sur "Analyser le contenu" → Loader s'affiche
   - Après 15-20 secondes → Erreur 500 dans la console
   - Aucun résultat affiché

2. **Générateur de Copy:**
   - Formulaire s'affiche correctement ✅
   - Saisie du brief fonctionne ✅
   - Clic sur "Générer la copy" → Loader s'affiche
   - Après 20 secondes → Erreur 500 dans la console
   - Aucun résultat affiché

**Erreur console:**
```
Failed to load resource: the server responded with a status of 500 ()
```

**Cause probable:**
1. **API LLM non configurée** ou clé API manquante/invalide
2. **Problème avec invokeLLM()** dans `server/_core/llm.ts`
3. **Variable d'environnement manquante** (BUILT_IN_FORGE_API_KEY ou autre)

**Fichiers concernés:**
- `server/contentMarketingRouter.ts` (ligne 99-105: appel invokeLLM)
- `server/_core/llm.ts` (fonction invokeLLM)
- `.env.local` ou `.env` (variables d'environnement)

**Impact:**
- ❌ Analyseur de Contenu: NON FONCTIONNEL
- ❌ Générateur de Copy: NON FONCTIONNEL
- ❌ Persona Builder: Probablement NON FONCTIONNEL (non testé mais même pattern)
- ❌ Chat IA: Probablement NON FONCTIONNEL
- ❌ Analyseur de Scripts: Probablement NON FONCTIONNEL

**Priorité:** 🔴 CRITIQUE - À corriger immédiatement

---

## 🔍 ANALYSE TECHNIQUE

### Code de l'Analyseur (contentMarketingRouter.ts)

```typescript
analyzeContent: protectedProcedure
  .input(z.object({
    title: z.string().optional(),
    content: z.string(),
    contentType: z.enum(['landing_page', 'email', 'ad', 'blog_post', 'social_post']),
    url: z.string().optional(),
    avatarId: z.number().optional(),
  }))
  .mutation(async ({ ctx, input }) => {
    const userId = ctx.user.id;
    
    // Appeler l'IA pour analyser le contenu
    const analysisPrompt = `Tu es un expert en Content Marketing...`;

    const response = await invokeLLM({  // ← ERREUR ICI
      messages: [
        { role: 'system', content: '...' },
        { role: 'user', content: analysisPrompt }
      ],
      responseFormat: { type: 'json_object' },
    });
    
    // ...
  }),
```

### Hypothèses de correction

**Option 1: Vérifier la configuration LLM**
```bash
# Vérifier si les variables d'environnement sont présentes
cat .env.local | grep -i "api\|llm\|forge"
```

**Option 2: Vérifier le fichier llm.ts**
```typescript
// server/_core/llm.ts
// Vérifier si invokeLLM() est correctement implémenté
// Vérifier si l'API key est bien passée
```

**Option 3: Ajouter des logs pour débugger**
```typescript
console.log('Calling LLM with:', { messages, responseFormat });
const response = await invokeLLM({...});
console.log('LLM response:', response);
```

---

## ✅ FONCTIONNALITÉS TESTÉES ET FONCTIONNELLES

### 1. Routing multilingue ✅
- Navigation `/fr` → `/fr/content-analyzer` ✅
- Navigation `/en` → `/en/content-analyzer` ✅
- Préservation de la langue ✅

### 2. Authentification ✅
- Page de subscription accessible ✅
- Essai gratuit détecté (30 jours) ✅
- Progression affichée ✅
- Bouton d'abonnement fonctionnel ✅

### 3. Interface utilisateur ✅
- Formulaires s'affichent correctement ✅
- Saisie de texte fonctionne ✅
- Boutons cliquables ✅
- Design responsive ✅

---

## 📋 PLAN D'ACTION IMMÉDIAT

### Étape 1: Diagnostiquer l'erreur LLM (15 min)
1. Lire le fichier `server/_core/llm.ts`
2. Vérifier les variables d'environnement
3. Vérifier les logs du serveur
4. Identifier la cause exacte de l'erreur 500

### Étape 2: Corriger le problème (30 min)
1. Si API key manquante → Ajouter la configuration
2. Si problème de code → Corriger invokeLLM()
3. Si problème de format → Ajuster les paramètres

### Étape 3: Tester tous les outils (30 min)
1. Re-tester l'Analyseur de Contenu
2. Re-tester le Générateur de Copy
3. Tester le Persona Builder
4. Tester le Chat IA
5. Tester l'Analyseur de Scripts

### Étape 4: Créer des tests unitaires (30 min)
1. Créer un test pour analyzeContent
2. Créer un test pour generateCopy
3. Créer un test pour createAvatar
4. S'assurer que tous les tests passent

---

## 🎯 RÉSUMÉ

**Bugs critiques:** 1 (erreur 500 sur tous les outils IA)
**Bugs moyens:** 2 (traductions, UX auth)
**Bugs mineurs:** 1 (labels navigation)

**Temps estimé pour corriger le bug critique:** 1-2 heures
**Temps estimé pour tout corriger:** 6-8 heures

**Prochaine action:** Lire `server/_core/llm.ts` et diagnostiquer l'erreur 500

---

**Rapport généré le 30 novembre 2025 à 19:47 UTC**
