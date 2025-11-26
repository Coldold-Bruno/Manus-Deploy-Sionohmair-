/**
 * ANALYSEUR DE CONTENU AUTOMATIQUE
 * 
 * Analyse un texte selon la méthodologie Sionohmair Insight Academy :
 * - Code PFPMA (Problème, Formule, Preuve, Méthode, Appel)
 * - 3 Frictions (Attention, Cognitive, Émotionnelle)
 * - Facteur Alpha (α = 22.67)
 * - Score de Clarté global (0-100)
 */

export interface AnalysisResult {
  // Scores globaux
  clarityScore: number; // 0-100
  alphaFactor: number; // α = 22.67
  
  // Analyse PFPMA
  pfpma: {
    probleme: { detected: boolean; score: number; excerpt?: string };
    formule: { detected: boolean; score: number; excerpt?: string };
    preuve: { detected: boolean; score: number; excerpt?: string };
    methode: { detected: boolean; score: number; excerpt?: string };
    appel: { detected: boolean; score: number; excerpt?: string };
    overallScore: number; // 0-100
  };
  
  // Analyse des 3 Frictions
  frictions: {
    attention: { score: number; issues: string[] }; // 0-100 (100 = pas de friction)
    cognitive: { score: number; issues: string[] };
    emotionnelle: { score: number; issues: string[] };
    overallScore: number; // 0-100
  };
  
  // Métriques de lisibilité
  readability: {
    fleschKincaid: number; // 0-100 (100 = très facile)
    averageSentenceLength: number;
    averageWordLength: number;
    complexWords: number;
    passiveVoice: number;
    parasiteWords: number;
  };
  
  // Analyse émotionnelle
  emotional: {
    fear: number; // 0-100
    urgency: number;
    hope: number;
    trust: number;
  };
  
  // Suggestions d'amélioration
  suggestions: Array<{
    category: 'pfpma' | 'friction' | 'readability' | 'emotional';
    priority: 'high' | 'medium' | 'low';
    issue: string;
    suggestion: string;
  }>;
  
  // Statistiques du texte
  stats: {
    characterCount: number;
    wordCount: number;
    sentenceCount: number;
    paragraphCount: number;
  };
}

/**
 * Analyser un texte complet
 */
export function analyzeContent(text: string): AnalysisResult {
  const stats = calculateStats(text);
  const pfpma = analyzePFPMA(text);
  const frictions = analyzeFrictions(text, stats);
  const readability = analyzeReadability(text, stats);
  const emotional = analyzeEmotional(text);
  
  // Calculer le score de clarté global
  const clarityScore = calculateClarityScore(pfpma, frictions, readability);
  
  // Calculer le Facteur Alpha
  const alphaFactor = calculateAlphaFactor(pfpma, frictions, readability, emotional);
  
  // Générer les suggestions
  const suggestions = generateSuggestions(pfpma, frictions, readability, emotional);
  
  return {
    clarityScore,
    alphaFactor,
    pfpma,
    frictions,
    readability,
    emotional,
    suggestions,
    stats,
  };
}

// ============================================================================
// STATISTIQUES DU TEXTE
// ============================================================================

function calculateStats(text: string) {
  const characterCount = text.length;
  const words = text.trim().split(/\s+/).filter(w => w.length > 0);
  const wordCount = words.length;
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const sentenceCount = sentences.length;
  const paragraphs = text.split(/\n\n+/).filter(p => p.trim().length > 0);
  const paragraphCount = paragraphs.length;
  
  return {
    characterCount,
    wordCount,
    sentenceCount,
    paragraphCount,
  };
}

// ============================================================================
// ANALYSE PFPMA
// ============================================================================

function analyzePFPMA(text: string) {
  const normalizedText = text.toLowerCase();
  
  // Détection du Problème (P)
  const problemeKeywords = [
    'problème', 'difficulté', 'défi', 'obstacle', 'frustration', 'peine',
    'souffrir', 'perdre', 'gaspiller', 'manquer', 'échouer', 'erreur',
    'pourquoi', 'comment se fait-il', 'vous avez du mal', 'vous n\'arrivez pas'
  ];
  const problemeDetected = problemeKeywords.some(kw => normalizedText.includes(kw));
  const problemeScore = problemeDetected ? 100 : 0;
  const problemeExcerpt = problemeDetected ? extractExcerpt(text, problemeKeywords) : undefined;
  
  // Détection de la Formule (F)
  const formuleKeywords = [
    'méthode', 'système', 'formule', 'code', 'framework', 'modèle',
    'approche', 'stratégie', 'technique', 'processus', 'solution',
    'pfpma', 'facteur alpha', 'théorème', 'principe'
  ];
  const formuleDetected = formuleKeywords.some(kw => normalizedText.includes(kw));
  const formuleScore = formuleDetected ? 100 : 0;
  const formuleExcerpt = formuleDetected ? extractExcerpt(text, formuleKeywords) : undefined;
  
  // Détection de la Preuve (P)
  const preuveKeywords = [
    '%', 'fois', 'augmentation', 'résultat', 'étude', 'recherche',
    'preuve', 'démontré', 'prouvé', 'testé', 'validé', 'confirmé',
    'chiffre', 'statistique', 'données', 'cas', 'exemple', 'témoignage'
  ];
  const preuveDetected = preuveKeywords.some(kw => normalizedText.includes(kw));
  const preuveScore = preuveDetected ? 100 : 0;
  const preuveExcerpt = preuveDetected ? extractExcerpt(text, preuveKeywords) : undefined;
  
  // Détection de la Méthode (M)
  const methodeKeywords = [
    'étape', 'phase', 'processus', 'comment', 'guide', 'tutoriel',
    'instruction', 'procédure', 'marche à suivre', 'voici comment',
    'premièrement', 'deuxièmement', 'ensuite', 'puis', 'enfin',
    'il suffit de', 'vous devez', 'commencez par'
  ];
  const methodeDetected = methodeKeywords.some(kw => normalizedText.includes(kw));
  const methodeScore = methodeDetected ? 100 : 0;
  const methodeExcerpt = methodeDetected ? extractExcerpt(text, methodeKeywords) : undefined;
  
  // Détection de l'Appel (A)
  const appelKeywords = [
    'cliquez', 'commencez', 'essayez', 'découvrez', 'téléchargez', 'inscrivez',
    'réservez', 'achetez', 'obtenez', 'profitez', 'rejoignez', 'contactez',
    'maintenant', 'aujourd\'hui', 'immédiatement', 'sans attendre',
    'gratuit', 'offre', 'promotion', 'limité', 'exclusif'
  ];
  const appelDetected = appelKeywords.some(kw => normalizedText.includes(kw));
  const appelScore = appelDetected ? 100 : 0;
  const appelExcerpt = appelDetected ? extractExcerpt(text, appelKeywords) : undefined;
  
  // Score global PFPMA
  const overallScore = Math.round(
    (problemeScore + formuleScore + preuveScore + methodeScore + appelScore) / 5
  );
  
  return {
    probleme: { detected: problemeDetected, score: problemeScore, excerpt: problemeExcerpt },
    formule: { detected: formuleDetected, score: formuleScore, excerpt: formuleExcerpt },
    preuve: { detected: preuveDetected, score: preuveScore, excerpt: preuveExcerpt },
    methode: { detected: methodeDetected, score: methodeScore, excerpt: methodeExcerpt },
    appel: { detected: appelDetected, score: appelScore, excerpt: appelExcerpt },
    overallScore,
  };
}

// ============================================================================
// ANALYSE DES 3 FRICTIONS
// ============================================================================

function analyzeFrictions(text: string, stats: ReturnType<typeof calculateStats>) {
  const normalizedText = text.toLowerCase();
  
  // Friction d'Attention (titre, accroche, longueur)
  const attentionIssues: string[] = [];
  let attentionScore = 100;
  
  // Vérifier la longueur (trop long = perte d'attention)
  if (stats.wordCount > 500) {
    attentionIssues.push('Texte trop long (> 500 mots). Risque de perte d\'attention.');
    attentionScore -= 20;
  }
  
  // Vérifier la présence d'un titre accrocheur (première ligne)
  const firstLine = text.split('\n')[0];
  if (firstLine.length < 20 || !firstLine.match(/[?!]/)) {
    attentionIssues.push('Titre peu accrocheur. Ajoutez une question ou une affirmation forte.');
    attentionScore -= 20;
  }
  
  // Vérifier la présence de mots d'attention
  const attentionWords = ['attention', 'urgent', 'important', 'nouveau', 'exclusif', 'limité'];
  if (!attentionWords.some(w => normalizedText.includes(w))) {
    attentionIssues.push('Manque de mots d\'attention (urgent, exclusif, nouveau...).');
    attentionScore -= 10;
  }
  
  // Friction Cognitive (complexité, jargon, clarté)
  const cognitiveIssues: string[] = [];
  let cognitiveScore = 100;
  
  // Vérifier les phrases trop longues
  const avgSentenceLength = stats.wordCount / stats.sentenceCount;
  if (avgSentenceLength > 20) {
    cognitiveIssues.push(`Phrases trop longues (moyenne : ${Math.round(avgSentenceLength)} mots). Simplifiez.`);
    cognitiveScore -= 20;
  }
  
  // Vérifier les mots complexes (> 12 lettres)
  const words = text.split(/\s+/);
  const complexWords = words.filter(w => w.length > 12).length;
  if (complexWords > 10) {
    cognitiveIssues.push(`Trop de mots complexes (${complexWords}). Utilisez des mots simples.`);
    cognitiveScore -= 15;
  }
  
  // Vérifier le jargon technique
  const jargonWords = ['synergies', 'paradigme', 'disruptif', 'holistique', 'scalable'];
  const jargonCount = jargonWords.filter(w => normalizedText.includes(w)).length;
  if (jargonCount > 0) {
    cognitiveIssues.push(`Jargon détecté (${jargonCount} mots). Évitez le langage technique.`);
    cognitiveScore -= 10 * jargonCount;
  }
  
  // Friction Émotionnelle (confiance, crédibilité, peur)
  const emotionnelleIssues: string[] = [];
  let emotionnelleScore = 100;
  
  // Vérifier les mots parasites (doute)
  const parasiteWords = ['peut-être', 'probablement', 'essayer', 'tenter', 'espérer'];
  const parasiteCount = parasiteWords.filter(w => normalizedText.includes(w)).length;
  if (parasiteCount > 0) {
    emotionnelleIssues.push(`Mots parasites détectés (${parasiteCount}). Soyez plus affirmatif.`);
    emotionnelleScore -= 15 * parasiteCount;
  }
  
  // Vérifier les preuves sociales
  const socialProof = ['client', 'utilisateur', 'témoignage', 'avis', 'note', 'étoile'];
  if (!socialProof.some(w => normalizedText.includes(w))) {
    emotionnelleIssues.push('Manque de preuve sociale (témoignages, avis clients).');
    emotionnelleScore -= 20;
  }
  
  // Vérifier les garanties
  const guarantees = ['garantie', 'remboursement', 'satisfait', 'risque', 'sécurisé'];
  if (!guarantees.some(w => normalizedText.includes(w))) {
    emotionnelleIssues.push('Manque de garanties (remboursement, sécurité).');
    emotionnelleScore -= 15;
  }
  
  // Score global des frictions
  const overallScore = Math.round((attentionScore + cognitiveScore + emotionnelleScore) / 3);
  
  return {
    attention: { score: Math.max(0, attentionScore), issues: attentionIssues },
    cognitive: { score: Math.max(0, cognitiveScore), issues: cognitiveIssues },
    emotionnelle: { score: Math.max(0, emotionnelleScore), issues: emotionnelleIssues },
    overallScore: Math.max(0, overallScore),
  };
}

// ============================================================================
// ANALYSE DE LISIBILITÉ
// ============================================================================

function analyzeReadability(text: string, stats: ReturnType<typeof calculateStats>) {
  const words = text.split(/\s+/).filter(w => w.length > 0);
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  
  // Flesch-Kincaid (simplifié)
  const avgSentenceLength = stats.wordCount / stats.sentenceCount;
  const avgWordLength = words.reduce((sum, w) => sum + w.length, 0) / stats.wordCount;
  const fleschKincaid = Math.max(0, Math.min(100, 
    206.835 - 1.015 * avgSentenceLength - 84.6 * (avgWordLength / 5)
  ));
  
  // Mots complexes (> 12 lettres)
  const complexWords = words.filter(w => w.length > 12).length;
  
  // Voix passive (approximation)
  const passiveVoice = (text.match(/été|était|sont|est|a été/gi) || []).length;
  
  // Mots parasites
  const parasiteWords = ['peut-être', 'probablement', 'essayer', 'tenter', 'espérer', 'genre', 'en fait', 'du coup'];
  const parasiteCount = parasiteWords.filter(w => text.toLowerCase().includes(w)).length;
  
  return {
    fleschKincaid: Math.round(fleschKincaid),
    averageSentenceLength: Math.round(avgSentenceLength),
    averageWordLength: Math.round(avgWordLength * 10) / 10,
    complexWords,
    passiveVoice,
    parasiteWords: parasiteCount,
  };
}

// ============================================================================
// ANALYSE ÉMOTIONNELLE
// ============================================================================

function analyzeEmotional(text: string) {
  const normalizedText = text.toLowerCase();
  
  // Peur (mots négatifs)
  const fearWords = ['peur', 'risque', 'danger', 'problème', 'erreur', 'échec', 'perdre', 'manquer'];
  const fearScore = Math.min(100, fearWords.filter(w => normalizedText.includes(w)).length * 15);
  
  // Urgence (mots d'action immédiate)
  const urgencyWords = ['maintenant', 'urgent', 'immédiat', 'vite', 'aujourd\'hui', 'limité', 'dernière chance'];
  const urgencyScore = Math.min(100, urgencyWords.filter(w => normalizedText.includes(w)).length * 15);
  
  // Espoir (mots positifs)
  const hopeWords = ['réussir', 'succès', 'gagner', 'améliorer', 'transformer', 'solution', 'opportunité'];
  const hopeScore = Math.min(100, hopeWords.filter(w => normalizedText.includes(w)).length * 15);
  
  // Confiance (mots de crédibilité)
  const trustWords = ['garantie', 'prouvé', 'certifié', 'expert', 'professionnel', 'sécurisé', 'fiable'];
  const trustScore = Math.min(100, trustWords.filter(w => normalizedText.includes(w)).length * 15);
  
  return {
    fear: fearScore,
    urgency: urgencyScore,
    hope: hopeScore,
    trust: trustScore,
  };
}

// ============================================================================
// CALCULS GLOBAUX
// ============================================================================

function calculateClarityScore(
  pfpma: ReturnType<typeof analyzePFPMA>,
  frictions: ReturnType<typeof analyzeFrictions>,
  readability: ReturnType<typeof analyzeReadability>
) {
  // Score de clarté = moyenne pondérée
  const pfpmaWeight = 0.4;
  const frictionsWeight = 0.4;
  const readabilityWeight = 0.2;
  
  const readabilityScore = Math.min(100, readability.fleschKincaid);
  
  return Math.round(
    pfpma.overallScore * pfpmaWeight +
    frictions.overallScore * frictionsWeight +
    readabilityScore * readabilityWeight
  );
}

function calculateAlphaFactor(
  pfpma: ReturnType<typeof analyzePFPMA>,
  frictions: ReturnType<typeof analyzeFrictions>,
  readability: ReturnType<typeof analyzeReadability>,
  emotional: ReturnType<typeof analyzeEmotional>
) {
  // Facteur Alpha (α) = Hi = An × Pn × Tn × En
  // An = Attention (0-1)
  // Pn = Problème (0-1)
  // Tn = Tension émotionnelle (0-1)
  // En = Énergie d'action (0-1)
  
  const An = frictions.attention.score / 100;
  const Pn = pfpma.probleme.score / 100;
  const Tn = (emotional.fear + emotional.urgency) / 200;
  const En = (pfpma.appel.score + emotional.hope) / 200;
  
  const Hi = An * Pn * Tn * En;
  
  // Facteur Alpha théorique = 22.67
  // Facteur Alpha réel = Hi × 22.67
  return Math.round(Hi * 22.67 * 100) / 100;
}

function generateSuggestions(
  pfpma: ReturnType<typeof analyzePFPMA>,
  frictions: ReturnType<typeof analyzeFrictions>,
  readability: ReturnType<typeof analyzeReadability>,
  emotional: ReturnType<typeof analyzeEmotional>
) {
  const suggestions: AnalysisResult['suggestions'] = [];
  
  // Suggestions PFPMA
  if (!pfpma.probleme.detected) {
    suggestions.push({
      category: 'pfpma',
      priority: 'high',
      issue: 'Problème non identifié',
      suggestion: 'Commencez par énoncer clairement le problème de votre audience. Exemple : "Vous perdez 2h par jour à..."',
    });
  }
  
  if (!pfpma.formule.detected) {
    suggestions.push({
      category: 'pfpma',
      priority: 'high',
      issue: 'Formule absente',
      suggestion: 'Présentez votre solution sous forme de formule mémorable. Exemple : "Le Code PFPMA".',
    });
  }
  
  if (!pfpma.preuve.detected) {
    suggestions.push({
      category: 'pfpma',
      priority: 'high',
      issue: 'Preuve manquante',
      suggestion: 'Ajoutez des chiffres, statistiques ou témoignages pour prouver l\'efficacité. Exemple : "+340% de conversion".',
    });
  }
  
  if (!pfpma.methode.detected) {
    suggestions.push({
      category: 'pfpma',
      priority: 'medium',
      issue: 'Méthode non expliquée',
      suggestion: 'Expliquez comment appliquer votre solution en 3 étapes simples.',
    });
  }
  
  if (!pfpma.appel.detected) {
    suggestions.push({
      category: 'pfpma',
      priority: 'high',
      issue: 'Appel à l\'action absent',
      suggestion: 'Terminez par un CTA clair et sans friction. Exemple : "Commencez maintenant (2 min, gratuit)".',
    });
  }
  
  // Suggestions Frictions
  frictions.attention.issues.forEach(issue => {
    suggestions.push({
      category: 'friction',
      priority: 'high',
      issue: `Friction d'Attention : ${issue}`,
      suggestion: 'Captez l\'attention dès les 3 premières secondes avec un titre percutant.',
    });
  });
  
  frictions.cognitive.issues.forEach(issue => {
    suggestions.push({
      category: 'friction',
      priority: 'medium',
      issue: `Friction Cognitive : ${issue}`,
      suggestion: 'Simplifiez vos phrases et utilisez des mots du quotidien.',
    });
  });
  
  frictions.emotionnelle.issues.forEach(issue => {
    suggestions.push({
      category: 'friction',
      priority: 'medium',
      issue: `Friction Émotionnelle : ${issue}`,
      suggestion: 'Renforcez la confiance avec des garanties et des preuves sociales.',
    });
  });
  
  // Suggestions Lisibilité
  if (readability.fleschKincaid < 60) {
    suggestions.push({
      category: 'readability',
      priority: 'medium',
      issue: 'Texte difficile à lire',
      suggestion: 'Simplifiez vos phrases et utilisez des mots plus courts.',
    });
  }
  
  if (readability.complexWords > 10) {
    suggestions.push({
      category: 'readability',
      priority: 'low',
      issue: `Trop de mots complexes (${readability.complexWords})`,
      suggestion: 'Remplacez les mots longs par des synonymes plus simples.',
    });
  }
  
  if (readability.parasiteWords > 3) {
    suggestions.push({
      category: 'readability',
      priority: 'medium',
      issue: `Mots parasites détectés (${readability.parasiteWords})`,
      suggestion: 'Supprimez "peut-être", "probablement", "essayer" pour être plus affirmatif.',
    });
  }
  
  // Suggestions Émotionnelles
  if (emotional.trust < 30) {
    suggestions.push({
      category: 'emotional',
      priority: 'high',
      issue: 'Manque de crédibilité',
      suggestion: 'Ajoutez des garanties, certifications ou témoignages pour renforcer la confiance.',
    });
  }
  
  if (emotional.urgency < 20) {
    suggestions.push({
      category: 'emotional',
      priority: 'low',
      issue: 'Manque d\'urgence',
      suggestion: 'Ajoutez une notion de temps limité ou d\'exclusivité pour inciter à l\'action.',
    });
  }
  
  return suggestions;
}

// ============================================================================
// UTILITAIRES
// ============================================================================

function extractExcerpt(text: string, keywords: string[]): string {
  const normalizedText = text.toLowerCase();
  
  for (const keyword of keywords) {
    const index = normalizedText.indexOf(keyword);
    if (index !== -1) {
      const start = Math.max(0, index - 30);
      const end = Math.min(text.length, index + keyword.length + 30);
      return '...' + text.substring(start, end) + '...';
    }
  }
  
  return text.substring(0, 60) + '...';
}


// ============================================================================
// RÉÉCRITURE AUTOMATIQUE
// ============================================================================

/**
 * Générer une version corrigée du texte selon les recommandations PFPMA
 */
export function rewriteContent(text: string, analysis: AnalysisResult): string {
  const lines: string[] = [];
  
  // 1. PROBLÈME (P)
  if (!analysis.pfpma.probleme.detected) {
    lines.push("**Votre problème central :**");
    lines.push("");
    lines.push("Vous avez une idée brillante, mais personne ne la comprend. Votre message se perd dans la confusion et vos prospects passent à côté de votre valeur.");
    lines.push("");
  } else if (analysis.pfpma.probleme.excerpt) {
    lines.push("**Votre problème central :**");
    lines.push("");
    lines.push(analysis.pfpma.probleme.excerpt.replace(/\.\.\./g, '').trim());
    lines.push("");
  }
  
  // 2. FORMULE (F)
  if (!analysis.pfpma.formule.detected) {
    lines.push("**La solution : Le Code PFPMA**");
    lines.push("");
    lines.push("Une méthode scientifique pour transformer votre communication en performance mesurable.");
    lines.push("");
  } else if (analysis.pfpma.formule.excerpt) {
    lines.push("**La solution :**");
    lines.push("");
    lines.push(analysis.pfpma.formule.excerpt.replace(/\.\.\./g, '').trim());
    lines.push("");
  }
  
  // 3. PREUVE (P)
  if (!analysis.pfpma.preuve.detected) {
    lines.push("**Les résultats prouvés :**");
    lines.push("");
    lines.push("• +340% de conversion moyenne");
    lines.push("• 90% de clarté atteinte en 7 jours");
    lines.push("• Validé par 500+ entrepreneurs");
    lines.push("");
  } else if (analysis.pfpma.preuve.excerpt) {
    lines.push("**Les résultats prouvés :**");
    lines.push("");
    lines.push(analysis.pfpma.preuve.excerpt.replace(/\.\.\./g, '').trim());
    lines.push("");
  }
  
  // 4. MÉTHODE (M)
  if (!analysis.pfpma.methode.detected) {
    lines.push("**Comment ça marche (3 étapes) :**");
    lines.push("");
    lines.push("1. **Diagnostic** : Identifiez les 3 frictions qui bloquent votre message");
    lines.push("2. **Optimisation** : Appliquez le Code PFPMA pour structurer votre contenu");
    lines.push("3. **Validation** : Mesurez l'impact avec le Facteur Alpha (α = 22.67)");
    lines.push("");
  } else if (analysis.pfpma.methode.excerpt) {
    lines.push("**Comment ça marche :**");
    lines.push("");
    lines.push(analysis.pfpma.methode.excerpt.replace(/\.\.\./g, '').trim());
    lines.push("");
  }
  
  // 5. APPEL (A)
  if (!analysis.pfpma.appel.detected) {
    lines.push("**Passez à l'action maintenant :**");
    lines.push("");
    lines.push("Réservez votre Sprint de Clarté (7 jours pour un message clair et percutant).");
    lines.push("");
    lines.push("👉 [Commencer maintenant](#) (2 min, gratuit)");
  } else if (analysis.pfpma.appel.excerpt) {
    lines.push("**Passez à l'action :**");
    lines.push("");
    lines.push(analysis.pfpma.appel.excerpt.replace(/\.\.\./g, '').trim());
  }
  
  return lines.join("\n");
}

/**
 * Générer un rapport détaillé avec suggestions de réécriture
 */
export function generateRewriteSuggestions(text: string, analysis: AnalysisResult): Array<{
  section: string;
  before: string;
  after: string;
  reason: string;
}> {
  const suggestions: Array<{
    section: string;
    before: string;
    after: string;
    reason: string;
  }> = [];
  
  // Suggestion 1 : Problème
  if (!analysis.pfpma.probleme.detected) {
    suggestions.push({
      section: "Problème (P)",
      before: text.substring(0, 100) + "...",
      after: "Vous avez une idée brillante, mais personne ne la comprend. Votre message se perd dans la confusion et vos prospects passent à côté de votre valeur.",
      reason: "Commencez par énoncer clairement le problème de votre audience pour capter l'attention."
    });
  }
  
  // Suggestion 2 : Formule
  if (!analysis.pfpma.formule.detected) {
    suggestions.push({
      section: "Formule (F)",
      before: "Aucune formule mémorable détectée",
      after: "Le Code PFPMA : une méthode scientifique pour transformer votre communication en performance mesurable.",
      reason: "Donnez un nom mémorable à votre solution pour la rendre facile à retenir."
    });
  }
  
  // Suggestion 3 : Preuve
  if (!analysis.pfpma.preuve.detected) {
    suggestions.push({
      section: "Preuve (P)",
      before: "Aucune preuve chiffrée détectée",
      after: "+340% de conversion moyenne • 90% de clarté atteinte en 7 jours • Validé par 500+ entrepreneurs",
      reason: "Ajoutez des chiffres concrets pour prouver l'efficacité de votre solution."
    });
  }
  
  // Suggestion 4 : Phrases trop longues
  if (analysis.readability.averageSentenceLength > 20) {
    const longSentence = text.split(/[.!?]+/).find(s => s.split(' ').length > 20);
    if (longSentence) {
      const words = longSentence.trim().split(' ');
      const half = Math.floor(words.length / 2);
      const simplified = words.slice(0, half).join(' ') + ". " + words.slice(half).join(' ') + ".";
      
      suggestions.push({
        section: "Lisibilité",
        before: longSentence.trim() + ".",
        after: simplified,
        reason: "Divisez les phrases longues en phrases courtes pour améliorer la clarté."
      });
    }
  }
  
  // Suggestion 5 : Appel à l'action
  if (!analysis.pfpma.appel.detected) {
    suggestions.push({
      section: "Appel (A)",
      before: "Aucun CTA clair détecté",
      after: "👉 Commencer maintenant (2 min, gratuit)",
      reason: "Terminez par un appel à l'action clair et sans friction pour inciter à l'action."
    });
  }
  
  return suggestions;
}
