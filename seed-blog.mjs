import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { blogPosts } from './drizzle/schema.ts';

const connection = await mysql.createConnection(process.env.DATABASE_URL);
const db = drizzle(connection);

const samplePosts = [
  {
    slug: 'transformation-startup-saas-250-conversion',
    title: 'Comment une startup SaaS a multiplié par 2,5 ses conversions en 7 jours',
    excerpt: 'Étude de cas complète : de 12/20 à 18/20 au Score de Clarté. Découvrez comment nous avons éliminé les 3 frictions qui bloquaient les conversions.',
    content: `# De la confusion à la clarté : L'histoire de TechFlow

## Le contexte

TechFlow, une startup SaaS B2B proposant une solution de gestion de projet, générait 5000 visites mensuelles sur sa landing page mais seulement 50 conversions (1% de taux de conversion).

## Le diagnostic (Score de Clarté : 12/20)

Lors du Sprint de Clarté, nous avons identifié **3 frictions majeures** :

### 1. Friction d'Attention (An = 2/4)
- Titre générique : "La meilleure solution de gestion de projet"
- Aucune différenciation claire
- Promesse floue et non mémorable

### 2. Friction Cognitive (Pn = 2/4)
- 7 fonctionnalités listées sans hiérarchie
- Jargon technique non expliqué
- Processus d'onboarding complexe (5 étapes)

### 3. Friction Émotionnelle (En = 3/4)
- Aucun témoignage client visible
- Pas de preuve sociale
- CTA anxiogène : "Commencer l'essai gratuit" (engagement perçu comme élevé)

## La transformation

Nous avons appliqué le **Code PFPMA** :

**P - Problème** : "Votre équipe perd 2h/jour dans des réunions de suivi inutiles"

**F - Formule** : "TechFlow : Le tableau de bord qui rend les réunions obsolètes"

**P - Preuve** : "+2h de productivité/jour pour 500+ équipes"

**M - Méthode** : "1) Connectez vos outils (2 min), 2) Visualisez tout en temps réel, 3) Éliminez 80% des réunions"

**A - Appel** : "Voir la démo en 90 secondes (sans inscription)"

## Les résultats (Score de Clarté : 18/20)

**Après 30 jours** :
- Taux de conversion : 1% → 2,5% (+150%)
- Temps moyen sur la page : 45s → 2min 30s (+233%)
- Taux de rebond : 75% → 45% (-40%)
- Coût d'acquisition client : 450€ → 180€ (-60%)

**ROI mesuré** : +250% de conversions = +100 clients/mois supplémentaires = +300 000€ de MRR annuel

## Les leçons clés

1. **La clarté est un multiplicateur de ROI** : Chaque point gagné au Score de Clarté = +15% de conversion en moyenne
2. **La simplicité bat la sophistication** : Passer de 7 fonctionnalités à 1 bénéfice principal a doublé l'engagement
3. **La preuve sociale élimine 80% des objections** : Ajouter des témoignages vidéo a réduit le cycle de vente de 14 à 7 jours

## Vous voulez des résultats similaires ?

Le Sprint de Clarté analyse votre message en 7 jours et vous livre un plan d'action complet avec projections ROI.

[Réserver un Sprint de Clarté →](/sprint-clarte)`,
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=1200&h=600&fit=crop',
    category: 'case-study',
    published: 'published',
    publishedAt: new Date('2025-01-15'),
    clientName: 'TechFlow SaaS',
    clientIndustry: 'SaaS B2B',
    scoreBefore: 12,
    scoreAfter: 18,
    roi: '+250%',
    testimonial: 'En 7 jours, Sionohmair a transformé notre landing page. Nous avons multiplié nos conversions par 2,5 sans changer notre produit. La méthodologie PFPMA est redoutablement efficace.',
    videoUrl: null,
  },
  {
    slug: 'formation-en-ligne-friction-emotionnelle',
    title: 'Comment éliminer la Friction Émotionnelle pour doubler vos inscriptions',
    excerpt: 'Cas pratique : Une formation en ligne passe de 8/20 à 17/20 au Score de Clarté en éliminant la peur de l\'engagement.',
    content: `# Éliminer la peur : Le cas LearnFast

## Le problème initial

LearnFast, une plateforme de formation en ligne, avait un taux d'inscription de 3% malgré un trafic qualifié de 10 000 visiteurs/mois.

## Le diagnostic (Score de Clarté : 8/20)

**Friction Émotionnelle dominante (En = 1/4)** :
- Prix affiché immédiatement (997€) sans contexte de valeur
- Engagement perçu comme élevé (12 mois de formation)
- Aucune garantie de résultats
- Témoignages génériques et non crédibles

## La solution Sionohmair

Nous avons restructuré l'offre selon le **Théorème de la Genèse de l'Insight** :

**Hi = An × Pn × Tn × En**

Pour maximiser Hi (Insight), nous avons optimisé chaque variable :

### An (Attention) : De 2/4 à 4/4
- Nouveau titre : "Maîtrisez Python en 30 jours ou remboursé"
- Promesse spécifique et mesurable
- Deadline claire (30 jours)

### Pn (Compréhension) : De 2/4 à 4/4
- Parcours d'apprentissage visualisé (infographie)
- 3 étapes simples : Fondamentaux → Projets → Certification
- Temps d'investissement clair : 1h/jour pendant 30 jours

### Tn (Confiance) : De 2/4 à 4/4
- 15 témoignages vidéo de diplômés
- Preuve de résultats : 87% de taux de réussite
- Certification reconnue par 50+ entreprises

### En (Émotion) : De 1/4 à 4/4
- **Garantie "Satisfait ou remboursé 60 jours"**
- **Accès gratuit aux 3 premiers modules** (sans carte bancaire)
- **Paiement en 3 fois sans frais**
- **Support 7j/7 inclus**

## Les résultats (Score de Clarté : 17/20)

**Après 45 jours** :
- Taux d'inscription : 3% → 6,5% (+117%)
- Taux d'abandon panier : 65% → 25% (-62%)
- Valeur vie client : 997€ → 1 850€ (+85% grâce aux upsells)
- NPS (satisfaction) : 45 → 78 (+73%)

**ROI mesuré** : +117% d'inscriptions = +350 clients/mois = +4,2M€ de CA annuel

## La leçon clé

**La Friction Émotionnelle est souvent la plus coûteuse** : 80% des visiteurs abandonnent par peur de l'engagement, pas par manque d'intérêt.

**3 leviers pour éliminer la Friction Émotionnelle** :
1. Garantie sans risque (remboursement)
2. Essai gratuit sans engagement
3. Preuve sociale crédible (vidéos, chiffres, autorité)

## Calculez votre Score de Clarté

Utilisez notre calculateur gratuit pour identifier vos frictions et obtenir des recommandations personnalisées.

[Accéder au Calculateur →](/calculateur)`,
    coverImage: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=1200&h=600&fit=crop',
    category: 'case-study',
    published: 'published',
    publishedAt: new Date('2025-01-10'),
    clientName: 'LearnFast Academy',
    clientIndustry: 'Formation en ligne',
    scoreBefore: 8,
    scoreAfter: 17,
    roi: '+117%',
    testimonial: 'Nous pensions que notre problème était le prix. Sionohmair nous a montré que c\'était la peur de l\'engagement. En ajoutant une garantie et un essai gratuit, nous avons doublé nos inscriptions.',
    videoUrl: null,
  },
  {
    slug: 'methode-pfpma-guide-complet',
    title: 'Le Code PFPMA : Guide complet de la Grammaire de la Clarté',
    excerpt: 'Découvrez la méthodologie complète derrière le Sprint de Clarté. 5 étapes pour transformer n\'importe quel message en machine à conversion.',
    content: `# Le Code PFPMA : La science derrière la clarté

## Introduction

Le Code PFPMA est le résultat de 5 ans de recherche et 310 pages de méthodologie documentée. C'est la grammaire universelle de tout message qui convertit.

## Les 5 composantes du Code PFPMA

### P - Problème (4 points)

**Objectif** : Créer une résonance émotionnelle immédiate

**Critères d'évaluation** :
- Spécificité : Le problème est-il précis et mesurable ?
- Urgence : Le problème est-il perçu comme urgent ?
- Universalité : Le problème concerne-t-il 80%+ de l'audience ?
- Intensité : Le problème génère-t-il une émotion forte ?

**Exemple faible (1/4)** : "Vous avez des difficultés en marketing"

**Exemple fort (4/4)** : "Votre landing page génère 1000 visites mais seulement 10 conversions. Vous perdez 990 clients potentiels chaque mois."

### F - Formule (4 points)

**Objectif** : Nommer la solution de manière mémorable

**Critères d'évaluation** :
- Unicité : La formule est-elle différenciée ?
- Mémorabilité : Peut-on la répéter facilement ?
- Désirabilité : La formule crée-t-elle du désir ?
- Clarté : La promesse est-elle explicite ?

**Exemple faible (1/4)** : "Notre solution marketing"

**Exemple fort (4/4)** : "Le Sprint de Clarté : 3 frictions éliminées en 7 jours"

### P - Preuve (4 points)

**Objectif** : Éliminer le scepticisme

**Critères d'évaluation** :
- Crédibilité : La preuve est-elle vérifiable ?
- Pertinence : La preuve répond-elle aux objections ?
- Autorité : La source est-elle reconnue ?
- Quantification : La preuve est-elle chiffrée ?

**Exemple faible (1/4)** : "Nos clients sont satisfaits"

**Exemple fort (4/4)** : "+250% de conversion en moyenne sur 50 clients (étude sur 12 mois, 2024)"

### M - Méthode (4 points)

**Objectif** : Rendre le chemin clair et actionnable

**Critères d'évaluation** :
- Simplicité : Maximum 3 étapes
- Séquence : L'ordre est-il logique ?
- Actionnabilité : Chaque étape est-elle concrète ?
- Temps : La durée est-elle précisée ?

**Exemple faible (1/4)** : "Nous vous accompagnons dans votre transformation"

**Exemple fort (4/4)** : "1) Diagnostic en 48h, 2) Élimination des frictions en 5 jours, 3) Plan d'action sur 30 jours"

### A - Appel (4 points)

**Objectif** : Rendre le refus irrationnel

**Critères d'évaluation** :
- Spécificité : L'action est-elle précise ?
- Friction : L'action est-elle à friction zéro ?
- Urgence : Y a-t-il une raison d'agir maintenant ?
- Valeur : Le bénéfice immédiat est-il clair ?

**Exemple faible (1/4)** : "Contactez-nous"

**Exemple fort (4/4)** : "Téléchargez le diagnostic gratuit en 1 clic (sans inscription, PDF de 10 pages)"

## Comment utiliser le Code PFPMA

### Étape 1 : Audit de votre message actuel

Évaluez chaque composante sur 4 points. Score total sur 20.

### Étape 2 : Identification des frictions

- Score < 12/20 : Friction majeure, refonte complète nécessaire
- Score 12-16/20 : Optimisations ciblées
- Score > 16/20 : Ajustements mineurs

### Étape 3 : Reconstruction selon PFPMA

Réécrivez votre message en suivant l'ordre P-F-P-M-A.

### Étape 4 : Test et itération

Mesurez l'impact sur vos KPI (CTR, conversion, engagement).

## Conclusion

Le Code PFPMA n'est pas une formule magique, c'est une **science de la performance**. Chaque point gagné au Score de Clarté = +15% de conversion en moyenne.

## Ressources

- [Calculateur de Score de Clarté](/calculateur) : Analysez votre message gratuitement
- [Sprint de Clarté](/sprint-clarte) : Diagnostic complet en 7 jours
- [Manuel PFPMA](/ressources) : Guide PDF de 50 pages (gratuit)`,
    coverImage: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=1200&h=600&fit=crop',
    category: 'methodology',
    published: 'published',
    publishedAt: new Date('2025-01-05'),
    clientName: null,
    clientIndustry: null,
    scoreBefore: null,
    scoreAfter: null,
    roi: null,
    testimonial: null,
    videoUrl: null,
  },
];

console.log('🌱 Insertion des articles de blog...');

for (const post of samplePosts) {
  try {
    await db.insert(blogPosts).values(post);
    console.log(`✅ Article créé : ${post.title}`);
  } catch (error) {
    console.error(`❌ Erreur pour ${post.title}:`, error.message);
  }
}

console.log('✅ Seed terminé !');
process.exit(0);
