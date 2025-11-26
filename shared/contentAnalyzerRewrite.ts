/**
 * RÉÉCRITURE ADAPTATIVE SELON LA PRÉVALENCE PFPMA
 * 
 * Au lieu de forcer une structure rigide P-F-P-M-A,
 * on réorganise le texte selon les forces détectées.
 */

import type { AnalysisResult } from './contentAnalyzer';

/**
 * Détecter la prévalence PFPMA (quelle partie est la plus forte)
 */
function detectPrevalence(analysis: AnalysisResult): Array<{ key: keyof typeof analysis.pfpma; score: number; label: string }> {
  const scores = [
    { key: 'probleme' as const, score: analysis.pfpma.probleme.score, label: 'Problème' },
    { key: 'formule' as const, score: analysis.pfpma.formule.score, label: 'Formule' },
    { key: 'preuve' as const, score: analysis.pfpma.preuve.score, label: 'Preuve' },
    { key: 'methode' as const, score: analysis.pfpma.methode.score, label: 'Méthode' },
    { key: 'appel' as const, score: analysis.pfpma.appel.score, label: 'Appel' },
  ];
  
  // Trier par score décroissant
  return scores.sort((a, b) => b.score - a.score);
}

/**
 * Générer le contenu pour chaque section PFPMA
 */
function generateSection(key: string, analysis: AnalysisResult): string[] {
  const lines: string[] = [];
  
  switch (key) {
    case 'probleme':
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
      break;
      
    case 'formule':
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
      break;
      
    case 'preuve':
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
      break;
      
    case 'methode':
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
      break;
      
    case 'appel':
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
      break;
  }
  
  return lines;
}

/**
 * Générer une version corrigée du texte selon les recommandations PFPMA
 * ADAPTATIF : Réorganise selon la prévalence détectée
 */
export function rewriteContentAdaptive(text: string, analysis: AnalysisResult): string {
  const lines: string[] = [];
  const prevalence = detectPrevalence(analysis);
  
  // Ajouter un en-tête explicatif
  lines.push("# Version Corrigée (Adaptative)");
  lines.push("");
  lines.push(`> **Prévalence détectée** : ${prevalence.map(p => `${p.label} (${p.score}/100)`).join(' → ')}`);
  lines.push("");
  lines.push("---");
  lines.push("");
  
  // Générer les sections dans l'ordre de prévalence
  prevalence.forEach(({ key }) => {
    const sectionLines = generateSection(key, analysis);
    lines.push(...sectionLines);
  });
  
  return lines.join("\n");
}

/**
 * Générer un rapport détaillé avec suggestions de réécriture
 */
export function generateRewriteSuggestionsAdaptive(text: string, analysis: AnalysisResult): Array<{
  section: string;
  before: string;
  after: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
}> {
  const suggestions: Array<{
    section: string;
    before: string;
    after: string;
    reason: string;
    priority: 'high' | 'medium' | 'low';
  }> = [];
  
  const prevalence = detectPrevalence(analysis);
  
  // Suggestion 1 : Réorganiser selon la prévalence
  if (prevalence[0].score > 0) {
    suggestions.push({
      section: "Structure globale",
      before: "Structure actuelle : P-F-P-M-A (rigide)",
      after: `Structure optimisée : ${prevalence.map(p => p.label[0]).join('-')} (selon vos forces)`,
      reason: `Votre point fort est "${prevalence[0].label}" (${prevalence[0].score}/100). Commencez par là pour capter l'attention.`,
      priority: 'high'
    });
  }
  
  // Suggestion 2 : Renforcer les points faibles
  const weakest = prevalence[prevalence.length - 1];
  if (weakest.score < 50) {
    suggestions.push({
      section: weakest.label,
      before: `${weakest.label} actuel : ${weakest.score}/100`,
      after: `Ajouter une section ${weakest.label} claire et concise`,
      reason: `Votre point faible est "${weakest.label}". Ajoutez-le pour compléter le message.`,
      priority: 'high'
    });
  }
  
  // Suggestion 3 : Simplifier les phrases longues
  if (analysis.readability.averageSentenceLength > 20) {
    const longSentence = text.split(/[.!?]+/).find(s => s.split(' ').length > 20);
    if (longSentence) {
      const words = longSentence.trim().split(' ');
      const half = Math.floor(words.length / 2);
      const simplified = words.slice(0, half).join(' ') + ". " + words.slice(half).join(' ') + ".";
      
      suggestions.push({
        section: "Lisibilité",
        before: longSentence.trim().substring(0, 100) + "...",
        after: simplified.substring(0, 100) + "...",
        reason: "Divisez les phrases longues en phrases courtes pour améliorer la clarté.",
        priority: 'medium'
      });
    }
  }
  
  // Suggestion 4 : Ajouter des preuves chiffrées
  if (analysis.pfpma.preuve.score < 50) {
    suggestions.push({
      section: "Preuve",
      before: "Aucune preuve chiffrée détectée",
      after: "+340% de conversion moyenne • 90% de clarté atteinte en 7 jours • Validé par 500+ entrepreneurs",
      reason: "Ajoutez des chiffres concrets pour prouver l'efficacité de votre solution.",
      priority: 'high'
    });
  }
  
  // Suggestion 5 : Ajouter un CTA clair
  if (analysis.pfpma.appel.score < 50) {
    suggestions.push({
      section: "Appel à l'action",
      before: "Aucun CTA clair détecté",
      after: "👉 Commencer maintenant (2 min, gratuit)",
      reason: "Terminez par un appel à l'action clair et sans friction pour inciter à l'action.",
      priority: 'high'
    });
  }
  
  return suggestions;
}

/**
 * Comparer AVANT/APRÈS et générer un diff
 */
export function generateDiff(before: string, after: string): Array<{
  type: 'added' | 'removed' | 'unchanged';
  content: string;
}> {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  
  const diff: Array<{ type: 'added' | 'removed' | 'unchanged'; content: string }> = [];
  
  // Algorithme de diff simple (ligne par ligne)
  let i = 0, j = 0;
  
  while (i < beforeLines.length || j < afterLines.length) {
    if (i >= beforeLines.length) {
      diff.push({ type: 'added', content: afterLines[j] });
      j++;
    } else if (j >= afterLines.length) {
      diff.push({ type: 'removed', content: beforeLines[i] });
      i++;
    } else if (beforeLines[i] === afterLines[j]) {
      diff.push({ type: 'unchanged', content: beforeLines[i] });
      i++;
      j++;
    } else {
      // Ligne modifiée
      diff.push({ type: 'removed', content: beforeLines[i] });
      diff.push({ type: 'added', content: afterLines[j] });
      i++;
      j++;
    }
  }
  
  return diff;
}
