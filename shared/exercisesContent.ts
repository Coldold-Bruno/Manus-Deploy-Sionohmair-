/**
 * CONTENU DES 27 EXERCICES - FORMATION SPRINT DE CLARTÉ
 * 
 * Structure : 9 modules × 3 exercices = 27 exercices
 * Chaque exercice contient :
 * - title : Titre de l'exercice
 * - instructions : Consignes détaillées
 * - example : Exemple (optionnel)
 * - expectedAnswer : Réponse attendue (pour validation)
 * - hints : Indices (optionnel)
 */

export interface Exercise {
  moduleNumber: number;
  exerciseNumber: number;
  title: string;
  instructions: string;
  example?: string;
  expectedKeywords: string[]; // Mots-clés attendus pour la validation
  minLength: number;
  maxLength: number;
  hints?: string[];
}

export const EXERCISES: Exercise[] = [
  // ============================================================================
  // MODULE 1 : LE CODE PFPMA (FONDATIONS)
  // ============================================================================
  {
    moduleNumber: 1,
    exerciseNumber: 1,
    title: "Identifier les 5 parties du Code PFPMA",
    instructions: `Lis ce message de vente et identifie les 5 parties (P, F, P, M, A) :

**Message :**

"Vous perdez 2h par jour à rédiger des messages qui ne convertissent pas. C'est frustrant, coûteux, et vous savez que ça doit changer.

Nous avons créé le Code PFPMA : 5 lettres pour transformer n'importe quel message en machine à conversion. Simple, mémorable, efficace.

Résultat : +340% de conversion en moyenne sur 50 clients (Facteur α = 22.67). Ce n'est pas de la magie, c'est de la science.

Notre méthode en 3 étapes : 1) Analyse de votre message actuel, 2) Réécriture avec le Code PFPMA, 3) Tests A/B pour valider les résultats.

Testez gratuitement votre message en 2 minutes avec notre Calculateur PFPMA."

**Ta réponse :**
Identifie chaque partie en indiquant les mots-clés ou phrases qui correspondent à chaque lettre du Code PFPMA.

Exemple de format :
- **P (Problème)** : "Vous perdez 2h par jour..."
- **F (Formule)** : "Code PFPMA : 5 lettres..."
- **P (Preuve)** : "+340% de conversion..."
- **M (Méthode)** : "3 étapes : 1) Analyse..."
- **A (Appel)** : "Testez gratuitement..."`,
    expectedKeywords: ["problème", "formule", "preuve", "méthode", "appel", "pfpma"],
    minLength: 100,
    maxLength: 500,
    hints: [
      "Le Problème commence souvent par 'Vous perdez...' ou 'Vous avez du mal...'",
      "La Formule est une phrase courte et mémorable qui nomme ta solution",
      "La Preuve contient des chiffres précis (%, €, nombre de clients)",
    ],
  },
  {
    moduleNumber: 1,
    exerciseNumber: 2,
    title: "Diagnostiquer un message sans PFPMA",
    instructions: `Ce message ne convertit pas. Identifie ce qui manque :

**Message :**

"Notre entreprise propose des solutions innovantes pour améliorer votre productivité. Nous avons une équipe expérimentée et nous utilisons les dernières technologies. Contactez-nous pour en savoir plus."

**Ta réponse :**
Coche les cases correspondant à ce qui manque dans ce message :

- [ ] Problème clair (douleur du client)
- [ ] Formule mémorable (nom de la solution)
- [ ] Preuve crédible (chiffres, témoignages)
- [ ] Méthode actionnable (étapes claires)
- [ ] Appel sans friction (action précise + temps)

Explique en 2-3 phrases pourquoi ce message ne convertit pas.`,
    expectedKeywords: ["problème", "formule", "preuve", "méthode", "appel", "vague", "générique"],
    minLength: 50,
    maxLength: 300,
    hints: [
      "Un message sans Problème ne crée pas de résonance émotionnelle",
      "Un message sans Preuve ne génère pas de crédibilité",
      "Un CTA vague comme 'Contactez-nous' crée de la friction",
    ],
  },
  {
    moduleNumber: 1,
    exerciseNumber: 3,
    title: "Rédiger ton premier message PFPMA",
    instructions: `Rédige un message de vente complet (100-150 mots) pour vendre une **bouteille d'eau réutilisable**.

**Contraintes :**
- ✅ Utilise les 5 parties PFPMA
- ✅ Sois concret et spécifique (pas de généralités)
- ✅ Inclus au moins 1 chiffre dans la Preuve
- ✅ CTA avec action précise + temps requis

**Ta réponse :**
[Rédige ton message ici]`,
    expectedKeywords: ["problème", "solution", "preuve", "étapes", "action"],
    minLength: 80,
    maxLength: 200,
    hints: [
      "Problème : Combien de bouteilles plastiques jetées par an ?",
      "Formule : Donne un nom à ta bouteille (ex: 'La Bouteille Éternelle')",
      "Preuve : Économie réalisée en 1 an (€, nombre de bouteilles)",
    ],
  },

  // ============================================================================
  // MODULE 2 : LES 3 FRICTIONS (DIAGNOSTIC)
  // ============================================================================
  {
    moduleNumber: 2,
    exerciseNumber: 1,
    title: "Détecter la Friction d'Attention",
    instructions: `Lis ces 5 titres. Lesquels captent ton attention en 3 secondes ?

1. "Améliorez votre productivité avec notre solution innovante"
2. "Tu perds 2h/jour. Voici comment les récupérer."
3. "Logiciel de gestion de projet pour entreprises"
4. "Ton boss te déteste ? C'est à cause de tes emails."
5. "Plateforme collaborative en temps réel"

**Ta réponse :**
- Sélectionne les numéros des titres qui captent l'attention (ex: 2, 4)
- Explique en 2-3 phrases pourquoi ces titres fonctionnent mieux que les autres.`,
    expectedKeywords: ["2", "4", "concret", "spécifique", "émotion", "problème"],
    minLength: 50,
    maxLength: 200,
    hints: [
      "Un bon titre est spécifique, pas vague",
      "Un bon titre mentionne un problème concret ou un bénéfice mesurable",
      "Les titres 1, 3, 5 sont trop génériques",
    ],
  },
  {
    moduleNumber: 2,
    exerciseNumber: 2,
    title: "Éliminer la Friction Cognitive",
    instructions: `Ce paragraphe est incompréhensible. Réécris-le en 50 mots maximum.

**Paragraphe original :**

"Notre solution SaaS B2B offre une approche holistique de la gestion de projet agile avec des fonctionnalités de collaboration asynchrone, une intégration seamless avec vos outils existants, et un dashboard analytique en temps réel pour optimiser vos KPIs et maximiser votre ROI."

**Ta réponse :**
[Réécris le paragraphe ici en langage simple]`,
    expectedKeywords: ["simple", "clair", "comprendre", "équipe", "projet"],
    minLength: 30,
    maxLength: 70,
    hints: [
      "Remplace le jargon par des mots simples (SaaS → logiciel, B2B → entreprises)",
      "Supprime les mots inutiles (holistique, seamless, optimiser)",
      "Concentre-toi sur le bénéfice principal en 1 phrase",
    ],
  },
  {
    moduleNumber: 2,
    exerciseNumber: 3,
    title: "Ajouter un Déclencheur Émotionnel",
    instructions: `Ce message est plat et n'éveille aucune émotion. Ajoute un déclencheur émotionnel.

**Message original :**

"Notre formation vous apprend le copywriting en 9 jours."

**Ta réponse :**
Réécris ce message en ajoutant un déclencheur émotionnel (peur, désir, urgence, preuve sociale).

Exemples de déclencheurs :
- **Peur** : "Tu perds 10 clients par mois à cause de tes messages..."
- **Désir** : "Imagine doubler tes ventes en 9 jours..."
- **Urgence** : "Places limitées : 5 restantes pour cette session..."
- **Preuve sociale** : "7000+ entrepreneurs ont déjà transformé leur communication..."`,
    expectedKeywords: ["émotion", "peur", "désir", "urgence", "preuve", "transformation"],
    minLength: 30,
    maxLength: 100,
    hints: [
      "Utilise 'tu' au lieu de 'vous' pour créer une connexion",
      "Ajoute un chiffre concret (nombre de jours, clients, résultats)",
      "Mentionne une conséquence négative (peur) ou positive (désir)",
    ],
  },

  // ============================================================================
  // MODULE 3 : LE FACTEUR ALPHA (α = 22.67)
  // ============================================================================
  {
    moduleNumber: 3,
    exerciseNumber: 1,
    title: "Calculer le Facteur Alpha",
    instructions: `Un message linéaire génère +15% de conversion.
Un message exponentiel (PFPMA optimisé) génère +340% de conversion.

**Question :**
Quel est le facteur de multiplication ?

**Ta réponse :**
[Indique le nombre exact, arrondi à 2 décimales]

**Calcul :**
Facteur Alpha = Gain Exponentiel ÷ Gain Linéaire`,
    expectedKeywords: ["22", "22.67", "23"],
    minLength: 2,
    maxLength: 10,
    hints: [
      "Divise 340 par 15",
      "Le résultat est environ 22.67",
    ],
  },
  {
    moduleNumber: 3,
    exerciseNumber: 2,
    title: "Comprendre la TVA NI (Taux de Valeur Ajoutée Non-Intuitive)",
    instructions: `Ton message actuel génère +15% de conversion.
Avec le Code PFPMA, il pourrait générer +340%.

**Question :**
Combien de % de potentiel est actuellement bloqué par les 3 frictions ?

**Ta réponse :**
[Indique le nombre en %]

**Explication :**
Explique en 2-3 phrases ce que représente ce chiffre.`,
    expectedKeywords: ["325", "potentiel", "bloqué", "friction"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Calcul : 340% - 15% = ?",
      "Ce chiffre représente le potentiel caché dans ton message",
    ],
  },
  {
    moduleNumber: 3,
    exerciseNumber: 3,
    title: "Identifier un message à Facteur Alpha élevé",
    instructions: `Lis ces 2 messages. Lequel a un Facteur Alpha élevé ?

**Message A :**
"Nous proposons des services de copywriting pour améliorer vos textes marketing. Contactez-nous pour un devis gratuit."

**Message B :**
"Tu perds 10 clients par mois à cause de tes messages flous. Le Code PFPMA transforme ça en +340% de conversion (50 clients testés). Méthode en 3 étapes : Analyse → Réécriture → Tests A/B. Teste ton message gratuitement en 2 min."

**Ta réponse :**
- Sélectionne A ou B
- Explique en 3-4 phrases pourquoi ce message a un Facteur Alpha élevé.`,
    expectedKeywords: ["B", "pfpma", "problème", "preuve", "méthode", "appel"],
    minLength: 80,
    maxLength: 200,
    hints: [
      "Le message B utilise le Code PFPMA complet",
      "Le message B contient des chiffres précis (+340%, 50 clients)",
      "Le message B a un CTA sans friction (2 min, gratuit)",
    ],
  },

  // ============================================================================
  // MODULE 4 : LE PROBLÈME (P)
  // ============================================================================
  {
    moduleNumber: 4,
    exerciseNumber: 1,
    title: "Identifier le VRAI problème",
    instructions: `Tu vends une formation en copywriting.

**Question :**
Quel est le VRAI problème de ton client ?

A) Il ne sait pas écrire
B) Il perd 10h/semaine à rédiger des messages qui ne convertissent pas
C) Il n'a pas de diplôme en marketing

**Ta réponse :**
- Sélectionne A, B, ou C
- Explique en 2-3 phrases pourquoi c'est le vrai problème.`,
    expectedKeywords: ["B", "temps", "conversion", "résultat", "frustration"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Le vrai problème n'est pas le manque de compétence, mais la conséquence",
      "Un bon problème est mesurable (temps perdu, argent perdu, clients perdus)",
    ],
  },
  {
    moduleNumber: 4,
    exerciseNumber: 2,
    title: "Rédiger un Problème avec émotion",
    instructions: `Rédige le Problème (P) pour vendre une **bouteille d'eau réutilisable**.

**Contraintes :**
- 50 mots maximum
- 1 émotion forte (culpabilité, peur, urgence)
- 1 chiffre concret (nombre de bouteilles, coût, impact)

**Ta réponse :**
[Rédige le Problème ici]`,
    expectedKeywords: ["plastique", "pollution", "argent", "santé", "planète"],
    minLength: 30,
    maxLength: 70,
    hints: [
      "Combien de bouteilles plastiques une personne jette-t-elle par an ?",
      "Quel est l'impact environnemental ou financier ?",
      "Utilise 'tu' pour créer une connexion directe",
    ],
  },
  {
    moduleNumber: 4,
    exerciseNumber: 3,
    title: "Corriger un Problème faible",
    instructions: `Ce Problème ne convertit pas. Réécris-le.

**AVANT :**
"Beaucoup de gens ont du mal à écrire des messages efficaces."

**Ta réponse :**
Réécris ce Problème en :
- Remplaçant "beaucoup de gens" par "tu"
- Ajoutant une conséquence mesurable (temps, argent, clients perdus)
- Ajoutant une émotion (frustration, peur, urgence)`,
    expectedKeywords: ["tu", "perds", "temps", "argent", "clients", "frustration"],
    minLength: 30,
    maxLength: 80,
    hints: [
      "Exemple : 'Tu perds 10h par semaine à rédiger des messages qui...'",
      "Sois spécifique : combien de temps ? Combien d'argent ?",
    ],
  },

  // ============================================================================
  // MODULE 5 : LA FORMULE (F)
  // ============================================================================
  {
    moduleNumber: 5,
    exerciseNumber: 1,
    title: "Identifier une bonne Formule",
    instructions: `Laquelle de ces Formules est la plus mémorable ?

A) "Notre solution innovante de copywriting"
B) "Le Code PFPMA : 5 lettres pour +340%"
C) "Méthode de rédaction persuasive"

**Ta réponse :**
- Sélectionne A, B, ou C
- Explique en 2-3 phrases pourquoi cette Formule est mémorable.`,
    expectedKeywords: ["B", "court", "chiffre", "mémorable", "acronyme"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Une bonne Formule est courte (10 mots max)",
      "Une bonne Formule contient un chiffre ou un acronyme",
      "Une bonne Formule se retient en 1 lecture",
    ],
  },
  {
    moduleNumber: 5,
    exerciseNumber: 2,
    title: "Créer ta Formule",
    instructions: `Tu vends une formation en copywriting.

**Crée une Formule mémorable (10 mots max).**

**Contraintes :**
- Inclure un chiffre OU un acronyme
- Être spécifique (pas de mots vagues comme "solution", "innovant")
- Se retenir en 1 lecture

**Ta réponse :**
[Rédige ta Formule ici]`,
    expectedKeywords: ["code", "méthode", "système", "chiffre", "jours"],
    minLength: 5,
    maxLength: 15,
    hints: [
      "Exemples : 'Le Sprint de Clarté : 9 jours pour maîtriser le PFPMA'",
      "Exemples : 'La Méthode 3F : Friction zéro en 7 jours'",
    ],
  },
  {
    moduleNumber: 5,
    exerciseNumber: 3,
    title: "Tester la mémorabilité",
    instructions: `Lis cette Formule une seule fois, puis cache-la.

**Formule :**
"Le Sprint de Clarté : 9 jours pour maîtriser le Code PFPMA."

**Maintenant, cache la Formule et essaie de la répéter de mémoire.**

**Ta réponse :**
[Répète la Formule de mémoire]

**Auto-évaluation :**
As-tu retenu au moins 80% des mots-clés (Sprint, Clarté, 9 jours, PFPMA) ?`,
    expectedKeywords: ["sprint", "clarté", "9", "jours", "pfpma"],
    minLength: 10,
    maxLength: 30,
    hints: [
      "Une bonne Formule se retient en 1 lecture",
      "Les mots-clés importants : Sprint, Clarté, 9 jours, PFPMA",
    ],
  },

  // ============================================================================
  // MODULE 6 : LA PREUVE (P)
  // ============================================================================
  {
    moduleNumber: 6,
    exerciseNumber: 1,
    title: "Identifier une Preuve forte",
    instructions: `Laquelle de ces Preuves est la plus crédible ?

A) "Nos clients sont satisfaits"
B) "+340% de conversion en moyenne sur 50 clients (α = 22.67)"
C) "Nous avons de l'expérience"

**Ta réponse :**
- Sélectionne A, B, ou C
- Explique en 2-3 phrases pourquoi cette Preuve est crédible.`,
    expectedKeywords: ["B", "chiffre", "précis", "mesurable", "crédible"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Une Preuve forte contient des chiffres précis",
      "Une Preuve forte est mesurable (%, €, nombre de clients)",
    ],
  },
  {
    moduleNumber: 6,
    exerciseNumber: 2,
    title: "Rédiger une Preuve avec chiffres",
    instructions: `Tu vends une formation en copywriting.

**Rédige une Preuve crédible (50 mots max).**

**Contraintes :**
- Inclure au moins 2 chiffres précis
- Être mesurable (%, €, nombre de clients, temps)
- Éviter les mots vagues ("beaucoup", "nombreux")

**Ta réponse :**
[Rédige ta Preuve ici]`,
    expectedKeywords: ["clients", "résultats", "conversion", "chiffre", "%"],
    minLength: 30,
    maxLength: 70,
    hints: [
      "Exemples de chiffres : +340% de conversion, 50 clients, 7000+ formés",
      "Exemples de résultats : économie de 10h/semaine, +15 clients/mois",
    ],
  },
  {
    moduleNumber: 6,
    exerciseNumber: 3,
    title: "Corriger une Preuve faible",
    instructions: `Cette Preuve ne convainc pas. Réécris-la.

**AVANT :**
"Beaucoup de clients ont aimé notre formation."

**Ta réponse :**
Réécris cette Preuve en :
- Remplaçant "beaucoup" par un chiffre précis
- Ajoutant un résultat mesurable (%, €, temps économisé)
- Ajoutant une source de crédibilité (nombre de clients, années d'expérience)`,
    expectedKeywords: ["chiffre", "clients", "résultats", "conversion", "précis"],
    minLength: 30,
    maxLength: 80,
    hints: [
      "Exemple : '7000+ entrepreneurs formés, +340% de conversion en moyenne'",
      "Sois précis : combien de clients ? Quel résultat ?",
    ],
  },

  // ============================================================================
  // MODULE 7 : LA MÉTHODE (M)
  // ============================================================================
  {
    moduleNumber: 7,
    exerciseNumber: 1,
    title: "Simplifier une Méthode complexe",
    instructions: `Cette Méthode est trop complexe (10 étapes). Réduis-la à 3 étapes.

**Méthode originale (10 étapes) :**
1. Analyse de votre message actuel
2. Identification des 3 frictions
3. Calcul du Score de Clarté
4. Recherche avatar (client idéal)
5. Rédaction du Problème
6. Rédaction de la Formule
7. Rédaction de la Preuve
8. Rédaction de la Méthode
9. Rédaction de l'Appel
10. Tests A/B et optimisation

**Ta réponse :**
Réduis cette Méthode à 3 étapes (10 mots max par étape).

1. [Étape 1]
2. [Étape 2]
3. [Étape 3]`,
    expectedKeywords: ["analyse", "réécriture", "test", "pfpma"],
    minLength: 30,
    maxLength: 100,
    hints: [
      "Regroupe les étapes similaires (1-3 = Analyse, 4-9 = Réécriture, 10 = Tests)",
      "Exemple : 1) Analyse, 2) Réécriture PFPMA, 3) Tests A/B",
    ],
  },
  {
    moduleNumber: 7,
    exerciseNumber: 2,
    title: "Rédiger une Méthode en 3 étapes",
    instructions: `Tu vends une formation en copywriting.

**Rédige la Méthode en 3 étapes (50 mots max).**

**Contraintes :**
- Exactement 3 étapes (numérotées 1, 2, 3)
- Chaque étape = 10 mots max
- Être actionnable (verbes d'action)

**Ta réponse :**
[Rédige ta Méthode ici]`,
    expectedKeywords: ["étape", "analyse", "rédaction", "test", "pfpma"],
    minLength: 30,
    maxLength: 70,
    hints: [
      "Utilise des verbes d'action : Analyse, Rédige, Teste",
      "Exemple : 1) Analyse ton message, 2) Rédige avec PFPMA, 3) Teste et optimise",
    ],
  },
  {
    moduleNumber: 7,
    exerciseNumber: 3,
    title: "Tester la clarté de ta Méthode",
    instructions: `Lis cette Méthode et explique-la à un enfant de 10 ans.

**Méthode :**
1. Analyse ton message actuel avec le Calculateur PFPMA
2. Rédige un nouveau message avec le Code PFPMA
3. Teste les 2 versions et garde la meilleure

**Ta réponse :**
Explique cette Méthode en langage simple (50-100 mots), comme si tu parlais à un enfant de 10 ans.`,
    expectedKeywords: ["simple", "comprendre", "test", "meilleur", "message"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Utilise des mots simples (pas de jargon)",
      "Utilise des comparaisons ou métaphores",
      "Exemple : 'C'est comme comparer 2 recettes de gâteau pour voir laquelle est la meilleure'",
    ],
  },

  // ============================================================================
  // MODULE 8 : L'APPEL (A)
  // ============================================================================
  {
    moduleNumber: 8,
    exerciseNumber: 1,
    title: "Identifier un bon CTA",
    instructions: `Lequel de ces CTA a le moins de friction ?

A) "Cliquez ici pour en savoir plus"
B) "Téléchargez le guide gratuit (2 min)"
C) "Contactez-nous"

**Ta réponse :**
- Sélectionne A, B, ou C
- Explique en 2-3 phrases pourquoi ce CTA a moins de friction.`,
    expectedKeywords: ["B", "action", "temps", "gratuit", "précis"],
    minLength: 50,
    maxLength: 150,
    hints: [
      "Un bon CTA précise l'action ET le temps requis",
      "Un bon CTA réduit la friction (gratuit, rapide, sans engagement)",
    ],
  },
  {
    moduleNumber: 8,
    exerciseNumber: 2,
    title: "Rédiger un CTA sans friction",
    instructions: `Tu vends une formation en copywriting.

**Rédige un CTA sans friction (10 mots max).**

**Contraintes :**
- Inclure l'action (verbe d'action)
- Inclure le temps requis (2 min, 1 clic, gratuit)
- Éviter les mots vagues ("en savoir plus", "contactez-nous")

**Ta réponse :**
[Rédige ton CTA ici]`,
    expectedKeywords: ["télécharge", "teste", "commence", "gratuit", "min", "clic"],
    minLength: 5,
    maxLength: 15,
    hints: [
      "Exemples : 'Télécharge le guide gratuit (2 min)'",
      "Exemples : 'Teste ton message gratuitement (1 clic)'",
    ],
  },
  {
    moduleNumber: 8,
    exerciseNumber: 3,
    title: "Corriger un CTA faible",
    instructions: `Ce CTA ne convertit pas. Réécris-le.

**AVANT :**
"En savoir plus"

**Ta réponse :**
Réécris ce CTA en :
- Remplaçant "en savoir plus" par une action spécifique
- Ajoutant le temps requis ou un bénéfice
- Réduisant la friction (gratuit, rapide, sans engagement)`,
    expectedKeywords: ["action", "temps", "gratuit", "télécharge", "teste"],
    minLength: 5,
    maxLength: 20,
    hints: [
      "Exemple : 'Télécharge le guide gratuit (2 min)'",
      "Sois spécifique : quelle action ? Combien de temps ?",
    ],
  },

  // ============================================================================
  // MODULE 9 : CERTIFICATION FINALE
  // ============================================================================
  {
    moduleNumber: 9,
    exerciseNumber: 1,
    title: "Rédiger un message PFPMA complet (Partie 1)",
    instructions: `Rédige un message de vente complet (200-300 mots) pour vendre un produit de ton choix.

**Contraintes :**
- ✅ Utiliser les 5 parties PFPMA
- ✅ Éliminer les 3 frictions (Attention, Cognitive, Émotionnelle)
- ✅ Inclure au moins 2 chiffres (Preuve)
- ✅ CTA sans friction

**Partie 1 : Problème + Formule (100 mots max)**

**Ta réponse :**
[Rédige le Problème et la Formule ici]`,
    expectedKeywords: ["problème", "formule", "émotion", "spécifique"],
    minLength: 80,
    maxLength: 150,
    hints: [
      "Commence par un Problème concret avec émotion",
      "Enchaîne avec une Formule mémorable (chiffre ou acronyme)",
    ],
  },
  {
    moduleNumber: 9,
    exerciseNumber: 2,
    title: "Rédiger un message PFPMA complet (Partie 2)",
    instructions: `**Partie 2 : Preuve + Méthode (100 mots max)**

Continue ton message de vente en ajoutant la Preuve et la Méthode.

**Ta réponse :**
[Rédige la Preuve et la Méthode ici]`,
    expectedKeywords: ["preuve", "chiffre", "méthode", "étapes", "résultats"],
    minLength: 80,
    maxLength: 150,
    hints: [
      "Preuve : Ajoute au moins 2 chiffres précis (%, €, nombre de clients)",
      "Méthode : Limite à 3 étapes maximum",
    ],
  },
  {
    moduleNumber: 9,
    exerciseNumber: 3,
    title: "Rédiger un message PFPMA complet (Partie 3)",
    instructions: `**Partie 3 : Appel (50 mots max)**

Termine ton message de vente avec un Appel à l'action sans friction.

**Ta réponse :**
[Rédige l'Appel ici]

**Auto-évaluation :**
Relis ton message complet (Parties 1 + 2 + 3) et vérifie :
- [ ] Les 5 parties PFPMA sont présentes
- [ ] Au moins 2 chiffres dans la Preuve
- [ ] CTA avec action précise + temps
- [ ] Aucun jargon technique (Friction Cognitive)
- [ ] Émotion forte dans le Problème (Friction Émotionnelle)`,
    expectedKeywords: ["appel", "action", "temps", "gratuit", "cta"],
    minLength: 30,
    maxLength: 80,
    hints: [
      "CTA : Action précise + Temps requis + Réduction de friction",
      "Exemple : 'Télécharge le guide gratuit (2 min, sans engagement)'",
    ],
  },
];

/**
 * Récupérer un exercice par module et numéro
 */
export function getExercise(moduleNumber: number, exerciseNumber: number): Exercise | undefined {
  return EXERCISES.find(
    (ex) => ex.moduleNumber === moduleNumber && ex.exerciseNumber === exerciseNumber
  );
}

/**
 * Récupérer tous les exercices d'un module
 */
export function getModuleExercises(moduleNumber: number): Exercise[] {
  return EXERCISES.filter((ex) => ex.moduleNumber === moduleNumber);
}
