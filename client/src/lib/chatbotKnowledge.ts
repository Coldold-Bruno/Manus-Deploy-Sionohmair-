/**
 * Base de connaissances du chatbot Sionohmair Insight Academy
 * Contient toutes les informations sur les services, outils, frameworks, et méthodologie
 */

export const CHATBOT_KNOWLEDGE = {
  platformName: "Sionohmair Insight Academy",
  tagline: "L'Ingénierie du Génie - Content Marketing & Copywriting",
  
  // Méthodologie Sionohmair
  methodology: {
    name: "Méthodologie Sionohmair",
    description: "Approche scientifique du copywriting basée sur l'élimination des 3 frictions et l'amplification par la clarté",
    
    frictions: [
      {
        name: "Friction d'Attention",
        description: "Difficulté à capter et maintenir l'attention du lecteur",
        solution: "Hooks puissants, statistiques choquantes, questions directes"
      },
      {
        name: "Friction Cognitive",
        description: "Complexité excessive qui fatigue le cerveau du lecteur",
        solution: "Clarté maximale, structure simple, exemples concrets"
      },
      {
        name: "Friction Émotionnelle",
        description: "Manque de connexion émotionnelle avec le message",
        solution: "Empathie, storytelling, transformation désirable"
      }
    ],
    
    theorem: {
      name: "Théorème de la Genèse de l'Insight",
      formula: "Hi = An × Pn × Tn × En",
      description: "L'insight (Hi) est le produit de l'Attention (An), du Problème (Pn), de la Transformation (Tn), et de l'Évidence (En)",
      alphaFactor: {
        value: 22.67,
        description: "Facteur d'amplification obtenu par l'élimination des 3 frictions"
      }
    }
  },
  
  // Frameworks de Copywriting
  frameworks: [
    {
      name: "PFPMA",
      category: "sionohmair",
      fullName: "Problème - Formule - Preuve - Méthode - Appel",
      description: "Framework Sionohmair pour landing pages et pages de vente longues",
      alphaFactor: 22.67,
      structure: [
        "Problème : Identifier et quantifier le problème précisément",
        "Formule : Nommer la solution de manière mémorable",
        "Preuve : Apporter des chiffres et témoignages crédibles",
        "Méthode : Expliquer le processus en 3 étapes simples",
        "Appel : CTA avec urgence et réduction de friction"
      ],
      bestFor: ["Landing pages", "Pages de vente", "Webinaires", "VSL"],
      conversionIncrease: "+340% en moyenne"
    },
    {
      name: "APTEA",
      category: "sionohmair",
      fullName: "Attention - Problème - Transformation - Évidence - Action",
      description: "Framework Sionohmair pour articles et contenus longs avec progression spirale ×81",
      structure: [
        "Attention : Hook statistique ou question choquante",
        "Problème : Développer le problème avec empathie",
        "Transformation : Montrer la transformation possible",
        "Évidence : Prouver avec témoignages et chiffres",
        "Action : CTA clair avec bénéfice immédiat"
      ],
      bestFor: ["Articles de blog", "Formations", "Ebooks", "Guides"],
      conversionIncrease: "+700% en moyenne"
    },
    {
      name: "AIDA",
      category: "classique",
      fullName: "Attention - Intérêt - Désir - Action",
      description: "Framework classique pour publicités courtes",
      structure: [
        "Attention : Capter l'attention immédiatement",
        "Intérêt : Susciter l'intérêt avec un bénéfice",
        "Désir : Créer le désir d'acheter",
        "Action : Appel à l'action clair"
      ],
      bestFor: ["Publicités", "Emails courts", "Posts sociaux"]
    },
    {
      name: "PAS",
      category: "classique",
      fullName: "Problème - Agitation - Solution",
      description: "Framework pour emails de prospection et cold outreach",
      structure: [
        "Problème : Identifier le problème du prospect",
        "Agitation : Aggraver le problème avec les conséquences",
        "Solution : Présenter la solution"
      ],
      bestFor: ["Cold emails", "Prospection B2B", "Emails de vente"]
    },
    {
      name: "PASTOR",
      category: "classique",
      fullName: "Problème - Amplification - Solution - Transformation - Offre - Réponse",
      description: "Framework complet pour VSL et pages de vente longues",
      structure: [
        "Problème : Identifier le problème",
        "Amplification : Aggraver le problème",
        "Solution : Présenter la solution",
        "Transformation : Montrer la transformation",
        "Offre : Présenter l'offre commerciale",
        "Réponse : Répondre aux objections"
      ],
      bestFor: ["VSL", "Webinaires", "Pages de vente longues"]
    },
    {
      name: "BAB",
      category: "classique",
      fullName: "Before - After - Bridge",
      description: "Framework pour témoignages et études de cas",
      structure: [
        "Before : Situation avant",
        "After : Situation après",
        "Bridge : Comment passer de l'un à l'autre"
      ],
      bestFor: ["Témoignages", "Études de cas", "Success stories"]
    },
    {
      name: "4P",
      category: "classique",
      fullName: "Picture - Promise - Prove - Push",
      description: "Framework visuel pour publicités et landing pages",
      bestFor: ["Publicités visuelles", "Landing pages courtes"]
    },
    {
      name: "QUEST",
      category: "classique",
      fullName: "Qualify - Understand - Educate - Stimulate - Transition",
      description: "Framework pour contenus éducatifs et nurturing",
      bestFor: ["Contenus éducatifs", "Nurturing", "Formations"]
    }
  ],
  
  // Outils de la plateforme
  tools: [
    {
      name: "Analyseur de Contenu",
      url: "/content-analyzer",
      description: "Analyse complète de votre contenu marketing en 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie",
      features: [
        "Score global /100",
        "Analyse SEO (mots-clés, meta, structure)",
        "Analyse de conversion (CTA, urgence, preuve sociale)",
        "Analyse d'engagement (hooks, storytelling, émotions)",
        "Analyse de lisibilité (Flesch, longueur phrases, mots complexes)",
        "Analyse psychologique (déclencheurs, objections, désir)",
        "Recommandations actionnables",
        "Sélection d'avatar client pour personnalisation"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Générateur de Copy",
      url: "/copy-generator",
      description: "Génération automatique de copy optimisé avec 6 frameworks de copywriting",
      features: [
        "6 frameworks disponibles (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB)",
        "Sélection du type de contenu (landing page, email, ad, blog, social)",
        "Personnalisation par avatar client",
        "3 tons disponibles (professionnel, décontracté, urgent)",
        "3 longueurs (court, moyen, long)",
        "Génération IA en temps réel",
        "Copie en un clic"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Persona Builder",
      url: "/avatar-builder",
      description: "Création d'avatars clients détaillés pour personnaliser vos analyses et générations",
      features: [
        "Informations démographiques (nom, âge, occupation, revenu)",
        "Informations psychographiques (valeurs, motivations)",
        "Points de douleur et objectifs",
        "Comportement d'achat",
        "Canaux de communication préférés",
        "Sauvegarde et réutilisation dans tous les outils"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Analyseur de Scripts",
      url: "/script-analyzer",
      description: "Identification automatique des frameworks utilisés dans vos scripts avec scoring et recommandations",
      features: [
        "Détection de 8 frameworks (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST)",
        "Score de qualité /100 par framework",
        "Étapes manquantes identifiées",
        "Recommandations d'amélioration",
        "Comparaison avec les meilleures pratiques"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Bibliothèque de Frameworks",
      url: "/frameworks",
      description: "Documentation complète des 8 frameworks de copywriting avec théorie, structure, et exemples",
      features: [
        "8 frameworks documentés",
        "Théorie et origine",
        "Structure détaillée étape par étape",
        "Exemples concrets",
        "Métriques de performance",
        "Meilleurs cas d'usage"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Chat IA Copywriting",
      url: "/chat-ia",
      description: "Conversation en temps réel avec l'IA Sionohmair pour optimiser vos scripts et répondre à vos questions",
      features: [
        "Conversation personnalisée par avatar client",
        "Réponses basées sur la méthodologie Sionohmair",
        "Historique des messages",
        "Suggestions de questions rapides",
        "Optimisation de scripts en direct"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Templates de Scripts",
      url: "/templates",
      description: "7 templates prêts à l'emploi pour chaque framework, à copier et personnaliser",
      features: [
        "7 templates (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB)",
        "Variables à personnaliser identifiées",
        "Copie en un clic",
        "Téléchargement .md",
        "Preview de chaque template"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Dashboard Utilisateur",
      url: "/dashboard-user",
      description: "Historique complet de vos analyses, copies générées, et avatars créés avec statistiques",
      features: [
        "Statistiques globales (analyses, copies, avatars)",
        "Score moyen des analyses",
        "Historique complet avec dates",
        "Actions rapides (copier, modifier, supprimer)",
        "Progression suivie"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Galerie AVANT/APRÈS",
      url: "/exemples",
      description: "3 exemples réels de scripts optimisés avec métriques de conversion",
      features: [
        "3 exemples documentés (PFPMA, APTEA, PAS)",
        "Comparaison visuelle AVANT/APRÈS",
        "Métriques de conversion (+641% à +1300%)",
        "Revenus générés (+45k€ à +127k€/mois)",
        "Liste des problèmes et améliorations"
      ],
      pricing: "Gratuit"
    },
    {
      name: "Automatisation IA",
      url: "/automatisation-ia",
      description: "Génération de contenu avec sélection d'avatar client pour personnalisation maximale",
      features: [
        "Génération IA personnalisée",
        "Sélection d'avatar client",
        "Brief de contenu flexible",
        "Copie en un clic"
      ],
      pricing: "Gratuit"
    }
  ],
  
  // Services
  services: [
    {
      name: "Sprint de Clarté",
      description: "Diagnostic qui révèle pourquoi votre communication n'accroche pas",
      price: "490€",
      duration: "2 heures",
      deliverables: [
        "Analyse complète de votre communication actuelle",
        "Identification des 3 frictions bloquantes",
        "Plan d'action personnalisé",
        "Recommandations priorisées"
      ]
    }
  ],
  
  // FAQ
  faq: [
    {
      question: "Qu'est-ce que le Facteur Alpha (α = 22.67) ?",
      answer: "Le Facteur Alpha est le coefficient d'amplification obtenu lorsque les 3 frictions (Attention, Cognitive, Émotionnelle) sont éliminées. Nos clients obtiennent en moyenne +340% de conversion grâce à ce facteur."
    },
    {
      question: "Quelle est la différence entre PFPMA et APTEA ?",
      answer: "PFPMA est optimisé pour les landing pages et pages de vente (structure commerciale directe), tandis qu'APTEA est conçu pour les contenus longs et éducatifs (articles, formations) avec une progression spirale ×81."
    },
    {
      question: "Comment utiliser un avatar client ?",
      answer: "Créez d'abord un avatar dans le Persona Builder, puis sélectionnez-le dans l'Analyseur de Contenu, le Générateur de Copy, ou le Chat IA pour personnaliser les analyses et générations selon votre audience cible."
    },
    {
      question: "Les outils sont-ils gratuits ?",
      answer: "Oui, tous les outils de la plateforme (Analyseur, Générateur, Persona Builder, Scripts, Frameworks, Chat IA, Templates, Dashboard, Exemples) sont gratuits."
    },
    {
      question: "Puis-je exporter mes analyses et copies ?",
      answer: "Oui, vous pouvez copier vos copies générées en un clic, et l'export PDF est disponible pour les analyses et copies depuis le Dashboard."
    },
    {
      question: "Comment fonctionne l'Analyseur de Scripts ?",
      answer: "Collez votre script, et l'IA identifie automatiquement les 8 frameworks utilisés (PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST), attribue un score /100 par framework, détecte les étapes manquantes, et génère des recommandations d'amélioration."
    }
  ],
  
  // Contact
  contact: {
    email: "contact@sionohmair.com",
    linkedin: "https://www.linkedin.com/in/sionohmair-insight-academy"
  }
};

/**
 * Fonction pour rechercher dans la base de connaissances
 */
export function searchKnowledge(query: string): string {
  const lowerQuery = query.toLowerCase();
  
  // Recherche de frameworks
  if (lowerQuery.includes('pfpma') || lowerQuery.includes('framework') || lowerQuery.includes('copywriting')) {
    const framework = CHATBOT_KNOWLEDGE.frameworks.find(f => 
      lowerQuery.includes(f.name.toLowerCase())
    );
    if (framework) {
      return `**${framework.name}** (${framework.fullName}) : ${framework.description}\n\nStructure :\n${framework.structure?.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n\nMeilleur pour : ${framework.bestFor?.join(', ')}`;
    }
  }
  
  // Recherche d'outils
  if (lowerQuery.includes('outil') || lowerQuery.includes('analyseur') || lowerQuery.includes('générateur')) {
    const tool = CHATBOT_KNOWLEDGE.tools.find(t => 
      lowerQuery.includes(t.name.toLowerCase()) || lowerQuery.includes(t.url.substring(1))
    );
    if (tool) {
      return `**${tool.name}** : ${tool.description}\n\nFonctionnalités :\n${tool.features.map(f => `• ${f}`).join('\n')}\n\nAccès : ${tool.url}\nPrix : ${tool.pricing}`;
    }
  }
  
  // Recherche de méthodologie
  if (lowerQuery.includes('méthodologie') || lowerQuery.includes('friction') || lowerQuery.includes('alpha')) {
    return `**Méthodologie Sionohmair** : ${CHATBOT_KNOWLEDGE.methodology.description}\n\n**Les 3 Frictions** :\n${CHATBOT_KNOWLEDGE.methodology.frictions.map(f => `• ${f.name} : ${f.solution}`).join('\n')}\n\n**Facteur Alpha** : ${CHATBOT_KNOWLEDGE.methodology.theorem.alphaFactor.value} - ${CHATBOT_KNOWLEDGE.methodology.theorem.alphaFactor.description}`;
  }
  
  // Recherche FAQ
  const faqMatch = CHATBOT_KNOWLEDGE.faq.find(f => 
    lowerQuery.includes(f.question.toLowerCase().substring(0, 20))
  );
  if (faqMatch) {
    return `**${faqMatch.question}**\n\n${faqMatch.answer}`;
  }
  
  // Réponse générique
  return `Je peux vous aider avec :\n\n**Frameworks** : PFPMA, APTEA, AIDA, PAS, PASTOR, BAB, 4P, QUEST\n**Outils** : Analyseur de Contenu, Générateur de Copy, Persona Builder, Analyseur de Scripts, Chat IA, Templates, Dashboard, Exemples\n**Méthodologie** : Les 3 frictions, Facteur Alpha, Théorème de l'Insight\n\nPosez-moi une question spécifique !`;
}
