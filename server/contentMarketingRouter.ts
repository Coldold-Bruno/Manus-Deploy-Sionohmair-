import { z } from 'zod';
import { router, protectedProcedure } from './_core/trpc';
import { getDb } from './db';
import { contentAnalyses, clientAvatars, copywritingFrameworks, generatedCopies, marketingFunnels } from '../drizzle/schema';
import { eq, desc } from 'drizzle-orm';
import { invokeLLM } from './_core/llm';

/**
 * Router tRPC pour Content Marketing & Copywriting
 * Sionohmair Insight Academy
 */

export const contentMarketingRouter = router({
  
  // ============================================================================
  // ANALYSEUR DE CONTENU MARKETING
  // ============================================================================
  
  /**
   * Analyser un contenu marketing complet (SEO, conversion, engagement, lisibilité, psychologie)
   */
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
      
      // Appeler l'IA pour analyser le contenu avec un prompt simplifié
      const analysisPrompt = `Analyse ce contenu marketing en JSON :

Type: ${input.contentType}
Titre: ${input.title || 'Non fourni'}
Contenu: ${input.content}

Réponds en JSON avec cette structure exacte:
{
  "seoScore": number (0-100),
  "conversionScore": number (0-100),
  "engagementScore": number (0-100),
  "readabilityScore": number (0-100),
  "psychologyScore": number (0-100),
  "seoAnalysis": {
    "keywords": ["mot1", "mot2"],
    "recommendations": ["suggestion1", "suggestion2"]
  },
  "conversionAnalysis": {
    "cta": {"present": boolean, "count": number},
    "recommendations": ["suggestion1"]
  },
  "engagementAnalysis": {
    "hook": {"present": boolean, "strength": "low/medium/high"},
    "recommendations": ["suggestion1"]
  },
  "readabilityAnalysis": {
    "fleschScore": number,
    "recommendations": ["suggestion1"]
  },
  "psychologyAnalysis": {
    "emotionalTone": "positive/negative/neutral",
    "recommendations": ["suggestion1"]
  },
  "suggestions": {
    "critical": ["suggestion1"],
    "important": ["suggestion2"],
    "minor": ["suggestion3"]
  }
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'Tu es un expert en Content Marketing et Copywriting. Tu analyses les contenus selon 5 dimensions : SEO, Conversion, Engagement, Lisibilité, Psychologie. Tu réponds UNIQUEMENT en JSON valide.' },
          { role: 'user', content: analysisPrompt }
        ],
        responseFormat: { type: 'json_object' },
      });

      const content = typeof response.choices[0].message.content === 'string' 
        ? response.choices[0].message.content 
        : JSON.stringify(response.choices[0].message.content);
      const analysisData = JSON.parse(content);
      
      // Calculer le score global
      const overallScore = Math.round((
        analysisData.seoScore +
        analysisData.conversionScore +
        analysisData.engagementScore +
        analysisData.readabilityScore +
        analysisData.psychologyScore
      ) / 5);
      
      // Enregistrer l'analyse en base de données
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [analysis] = await db.insert(contentAnalyses).values({
        userId,
        title: input.title,
        content: input.content,
        contentType: input.contentType,
        url: input.url,
        seoScore: analysisData.seoScore,
        conversionScore: analysisData.conversionScore,
        engagementScore: analysisData.engagementScore,
        readabilityScore: analysisData.readabilityScore,
        psychologyScore: analysisData.psychologyScore,
        overallScore,
        seoAnalysis: analysisData.seoAnalysis,
        conversionAnalysis: analysisData.conversionAnalysis,
        engagementAnalysis: analysisData.engagementAnalysis,
        readabilityAnalysis: analysisData.readabilityAnalysis,
        psychologyAnalysis: analysisData.psychologyAnalysis,
        suggestions: analysisData.suggestions,
        createdAt: new Date(),
      });
      
      return {
        id: analysis.insertId,
        ...analysisData,
        overallScore,
      };
    }),
  
  /**
   * Récupérer l'historique des analyses
   */
  getMyAnalyses: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) return [];
      
      const analyses = await db
        .select()
        .from(contentAnalyses)
        .where(eq(contentAnalyses.userId, userId))
        .orderBy(desc(contentAnalyses.createdAt))
        .limit(50);
      
      return analyses;
    }),
  
  /**
   * Récupérer une analyse spécifique
   */
  getAnalysis: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [analysis] = await db
        .select()
        .from(contentAnalyses)
        .where(eq(contentAnalyses.id, input.id))
        .limit(1);
      
      if (!analysis || analysis.userId !== userId) {
        throw new Error('Analyse non trouvée');
      }
      
      return analysis;
    }),
  
  // ============================================================================
  // GÉNÉRATEUR DE COPY OPTIMISÉ
  // ============================================================================
  
  /**
   * Générer du copy optimisé selon un framework
   */
  generateCopy: protectedProcedure
    .input(z.object({
      frameworkId: z.number().optional(),
      avatarId: z.number().optional(),
      contentType: z.enum(['landing_page', 'email', 'ad', 'blog_post', 'social_post', 'sales_page', 'video_script']),
      brief: z.string(),
      keywords: z.array(z.string()).optional(),
      tone: z.string().optional(),
      length: z.enum(['short', 'medium', 'long']).optional(),
      variantsCount: z.number().min(1).max(5).default(3),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      // Récupérer le framework si spécifié
      let framework = null;
      if (input.frameworkId) {
        [framework] = await db
          .select()
          .from(copywritingFrameworks)
          .where(eq(copywritingFrameworks.id, input.frameworkId))
          .limit(1);
      }
      
      // Récupérer l'avatar si spécifié
      let avatar = null;
      if (input.avatarId) {
        [avatar] = await db
          .select()
          .from(clientAvatars)
          .where(eq(clientAvatars.id, input.avatarId))
          .limit(1);
        
        if (!avatar || avatar.userId !== userId) {
          throw new Error('Avatar non trouvé');
        }
      }
      
      // Construire le prompt
      let prompt = `Tu es un Copywriter expert spécialisé dans la méthodologie Sionohmair Insight Academy (PFPMA : Problème, Formule, Preuve, Méthode, Appel).

**Brief** : ${input.brief}

**Type de contenu** : ${input.contentType}
**Ton** : ${input.tone || 'Professionnel et persuasif'}
**Longueur** : ${input.length || 'medium'}
${input.keywords ? `**Mots-clés** : ${input.keywords.join(', ')}` : ''}

${framework ? `**Framework à utiliser** : ${framework.name} (${framework.acronym})
${framework.description}

${framework.structure ? `Structure :
${framework.structure.map((s: any) => `- ${s.step}: ${s.description}`).join('\n')}` : ''}` : ''}

${avatar ? `**Avatar client** :
- Nom : ${avatar.name}
- Âge : ${avatar.age} ans
- Occupation : ${avatar.occupation}
- Goals : ${avatar.goals?.join(', ')}
- Pain Points : ${avatar.painPoints?.join(', ')}
- Desires : ${avatar.desires?.join(', ')}
- Tone préféré : ${avatar.preferredTone}` : ''}

Génère ${input.variantsCount} variantes de copy optimisé pour maximiser la conversion.

Réponds en JSON avec :
{
  "mainCopy": "version principale",
  "variants": ["variante 1", "variante 2", ...],
  "qualityScore": score 0-100,
  "persuasionScore": score 0-100,
  "recommendations": ["conseil 1", "conseil 2", ...]
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'Tu es un Copywriter expert spécialisé dans la méthodologie Sionohmair Insight Academy. Tu génères du copy persuasif et optimisé pour la conversion.' },
          { role: 'user', content: prompt }
        ],
        responseFormat: { type: 'json_object' },
      });

      const content = typeof response.choices[0].message.content === 'string' 
        ? response.choices[0].message.content 
        : JSON.stringify(response.choices[0].message.content);
      const copyData = JSON.parse(content);
      
      // Enregistrer en base de données
      const [generatedCopy] = await db.insert(generatedCopies).values({
        userId,
        frameworkId: input.frameworkId,
        avatarId: input.avatarId,
        contentType: input.contentType,
        brief: input.brief,
        keywords: input.keywords,
        tone: input.tone,
        length: input.length,
        generatedContent: copyData.mainCopy,
        variants: copyData.variants,
        qualityScore: copyData.qualityScore,
        persuasionScore: copyData.persuasionScore,
        createdAt: new Date(),
      });
      
      // Incrémenter le compteur d'utilisation du framework
      if (input.frameworkId) {
        await db
          .update(copywritingFrameworks)
          .set({ usageCount: (framework?.usageCount || 0) + 1 })
          .where(eq(copywritingFrameworks.id, input.frameworkId));
      }
      
      return {
        id: generatedCopy.insertId,
        ...copyData,
      };
    }),
  
  /**
   * Récupérer l'historique des copies générées
   */
  getMyCopies: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) return [];
      
      const copies = await db
        .select()
        .from(generatedCopies)
        .where(eq(generatedCopies.userId, userId))
        .orderBy(desc(generatedCopies.createdAt))
        .limit(50);
      
      return copies;
    }),
  
  // ============================================================================
  // AVATARS CLIENTS
  // ============================================================================
  
  /**
   * Créer un avatar client
   */
  createAvatar: protectedProcedure
    .input(z.object({
      name: z.string(),
      age: z.number().optional(),
      gender: z.string().optional(),
      location: z.string().optional(),
      occupation: z.string().optional(),
      income: z.string().optional(),
      education: z.string().optional(),
      goals: z.array(z.string()).optional(),
      challenges: z.array(z.string()).optional(),
      painPoints: z.array(z.string()).optional(),
      desires: z.array(z.string()).optional(),
      fears: z.array(z.string()).optional(),
      values: z.array(z.string()).optional(),
      buyingBehavior: z.object({
        decisionMakers: z.array(z.string()),
        buyingCycle: z.string(),
        budget: z.string(),
        objections: z.array(z.string()),
      }).optional(),
      mediaConsumption: z.object({
        platforms: z.array(z.string()),
        contentTypes: z.array(z.string()),
        influencers: z.array(z.string()),
      }).optional(),
      preferredTone: z.string().optional(),
      keyMessages: z.array(z.string()).optional(),
      avoidTopics: z.array(z.string()).optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [avatar] = await db.insert(clientAvatars).values({
        userId,
        ...input,
        createdAt: new Date(),
      });
      
      return { id: avatar.insertId };
    }),
  
  /**
   * Récupérer mes avatars
   */
  getMyAvatars: protectedProcedure
    .query(async ({ ctx }) => {
      const userId = ctx.user.id;
      
      const db = await getDb();
      if (!db) return [];
      
      const avatars = await db
        .select()
        .from(clientAvatars)
        .where(eq(clientAvatars.userId, userId))
        .orderBy(desc(clientAvatars.createdAt));
      
      return avatars;
    }),
  
  /**
   * Générer un avatar automatiquement à partir d'une description
   */
  generateAvatar: protectedProcedure
    .input(z.object({
      description: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      const prompt = `Tu es un expert en persona building et psychographie client. À partir de la description suivante, génère un avatar client complet et détaillé :

${input.description}

Réponds en JSON avec :
{
  "name": "Nom du persona",
  "age": nombre,
  "gender": "homme/femme/autre",
  "location": "ville/région",
  "occupation": "profession",
  "income": "tranche de revenus",
  "education": "niveau d'études",
  "goals": ["objectif 1", "objectif 2", ...],
  "challenges": ["défi 1", "défi 2", ...],
  "painPoints": ["douleur 1", "douleur 2", ...],
  "desires": ["désir 1", "désir 2", ...],
  "fears": ["peur 1", "peur 2", ...],
  "values": ["valeur 1", "valeur 2", ...],
  "buyingBehavior": {
    "decisionMakers": ["qui décide"],
    "buyingCycle": "durée du cycle d'achat",
    "budget": "budget disponible",
    "objections": ["objection 1", "objection 2"]
  },
  "mediaConsumption": {
    "platforms": ["plateforme 1", "plateforme 2"],
    "contentTypes": ["type 1", "type 2"],
    "influencers": ["influenceur 1", "influenceur 2"]
  },
  "preferredTone": "ton de communication préféré",
  "keyMessages": ["message clé 1", "message clé 2"],
  "avoidTopics": ["sujet à éviter 1", "sujet à éviter 2"]
}`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'Tu es un expert en persona building et psychographie client. Tu génères des avatars clients détaillés et réalistes.' },
          { role: 'user', content: prompt }
        ],
        responseFormat: { type: 'json_object' },
      });

      const content = typeof response.choices[0].message.content === 'string' 
        ? response.choices[0].message.content 
        : JSON.stringify(response.choices[0].message.content);
      const avatarData = JSON.parse(content);
      
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [avatar] = await db.insert(clientAvatars).values({
        userId,
        ...avatarData,
        createdAt: new Date(),
      });
      
      return {
        id: avatar.insertId,
        ...avatarData,
      };
    }),
  
  // ============================================================================
  // ANALYSEUR DE SCRIPTS
  // ============================================================================
  
  /**
   * Analyser un script pour identifier les méthodes structurelles utilisées
   */
  analyzeScript: protectedProcedure
    .input(z.object({
      title: z.string().optional(),
      content: z.string(),
    }))
    .mutation(async ({ ctx, input }) => {
      const userId = ctx.user.id;
      
      // Appeler l'IA pour analyser le script
      const analysisPrompt = `Tu es un expert en Copywriting et en analyse de scripts de vente. Analyse le script suivant pour identifier les frameworks de copywriting utilisés.

**Titre** : ${input.title || 'Non fourni'}
**Script** :
${input.content}

Frameworks à détecter :
1. **PFPMA** (Problème - Formule - Preuve - Méthode - Appel) - Sionohmair
2. **APTEA** (Attention - Problème - Transformation - Évidence - Action) - Sionohmair
3. **AIDA** (Attention - Intérêt - Désir - Action)
4. **PAS** (Problème - Agitation - Solution)
5. **PASTOR** (Problème - Amplifier - Solution - Transformation - Offre - Réponse)
6. **BAB** (Before - After - Bridge)
7. **4P** (Picture - Promise - Prove - Push)
8. **QUEST** (Qualify - Understand - Educate - Stimulate - Transition)

Pour chaque framework détecté, fournis :
- **confidence** : score de confiance 0-100 (100 = toutes les étapes présentes et bien appliquées)
- **stepsFound** : liste des étapes avec {name, present: boolean, quality: 0-100}
- **strengths** : liste des points forts
- **improvements** : liste des points à améliorer
- **recommendations** : liste de recommandations spécifiques

Fournis aussi :
- **overallScore** : score global 0-100 (qualité globale du script)
- **detectedFrameworks** : liste des frameworks détectés triés par confidence (du plus élevé au plus faible)
- **globalRecommendations** : liste de recommandations globales pour améliorer le script

Réponds UNIQUEMENT avec un objet JSON valide, sans markdown ni texte supplémentaire.`;

      const response = await invokeLLM({
        messages: [
          { role: 'system', content: 'Tu es un expert en Copywriting et en analyse de scripts de vente. Tu identifies les frameworks utilisés et évalues leur qualité d\'application. Tu réponds UNIQUEMENT en JSON valide.' },
          { role: 'user', content: analysisPrompt }
        ],
        responseFormat: { type: 'json_object' },
      });

      const content = typeof response.choices[0].message.content === 'string' 
        ? response.choices[0].message.content 
        : JSON.stringify(response.choices[0].message.content);
      const scriptAnalysis = JSON.parse(content);
      
      return scriptAnalysis;
    }),
  
  // ============================================================================
  // FRAMEWORKS DE COPYWRITING
  // ============================================================================
  
  /**
   * Récupérer tous les frameworks
   */
  getFrameworks: protectedProcedure
    .query(async () => {
      const db = await getDb();
      if (!db) return [];
      
      const frameworks = await db
        .select()
        .from(copywritingFrameworks)
        .orderBy(desc(copywritingFrameworks.usageCount));
      
      return frameworks;
    }),
  
  /**
   * Récupérer un framework spécifique
   */
  getFramework: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const db = await getDb();
      if (!db) throw new Error('Database not available');
      
      const [framework] = await db
        .select()
        .from(copywritingFrameworks)
        .where(eq(copywritingFrameworks.id, input.id))
        .limit(1);
      
      if (!framework) {
        throw new Error('Framework non trouvé');
      }
      
      return framework;
    }),
});
