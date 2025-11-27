import { z } from "zod";
import { eq, desc } from "drizzle-orm";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { getDb } from "./db";
import { correctionsHistory, correctionTemplates, nftBeneficiaries } from "../drizzle/schema";
import { TRPCError } from "@trpc/server";
import { invokeLLM } from "./_core/llm";

/**
 * Router tRPC pour le Correcteur Universel de Contenu
 * 
 * Fonctionnalités :
 * - Corriger tout type de contenu (texte, bilan, site web, document)
 * - Analyser selon PFPMA + critères spécifiques
 * - Sauvegarder l'historique des corrections
 * - Intégrer au système NFT de Gratitude
 */

export const correcteurRouter = router({
  
  // ============================================================================
  // CORRECTION DE CONTENU
  // ============================================================================
  
  /**
   * Corriger un texte simple (landing page, email, pitch)
   */
  correctText: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      // Appeler l'IA pour analyser et corriger
      const analysisPrompt = `Tu es un expert en clarté de communication selon la méthodologie PFPMA (Problème, Formule, Preuve, Méthode, Appel).

Analyse ce texte et fournis :

1. **Score PFPMA initial** (0-20 points) :
   - Problème clairement identifié ? (4 pts)
   - Formule/Solution proposée ? (4 pts)
   - Preuve/Crédibilité apportée ? (4 pts)
   - Méthode/Processus expliqué ? (4 pts)
   - Appel à l'action clair ? (4 pts)

2. **Frictions identifiées** (3 types) :
   - Friction d'Attention : Le message capte-t-il l'attention immédiatement ?
   - Friction Cognitive : Le message est-il facile à comprendre ?
   - Friction Émotionnelle : Le message crée-t-il une connexion émotionnelle ?

3. **Recommandations** (5 actions prioritaires)

4. **Version corrigée** du texte (applique automatiquement les recommandations)

5. **Score PFPMA après correction** (0-20 points)

Texte à analyser :
"""
${input.content}
"""

Réponds UNIQUEMENT au format JSON suivant (sans markdown, sans backticks) :
{
  "scoreBefore": 12,
  "scoreAfter": 18,
  "frictions": {
    "attention": "Description de la friction d'attention",
    "cognitive": "Description de la friction cognitive",
    "emotional": "Description de la friction émotionnelle"
  },
  "recommendations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3",
    "Recommandation 4",
    "Recommandation 5"
  ],
  "correctedContent": "Version corrigée du texte..."
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Tu es un expert en clarté de communication selon PFPMA. Tu réponds UNIQUEMENT en JSON valide." },
          { role: "user", content: analysisPrompt }
        ],
      });

      let analysis;
      try {
        const rawContent = response.choices[0].message.content;
        const content = typeof rawContent === 'string' ? rawContent : "{}";
        // Nettoyer le contenu (enlever les backticks markdown si présents)
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(cleanContent);
      } catch (error) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Erreur lors de l'analyse IA" 
        });
      }

      // Créer automatiquement un NFT Bénéficiaire pour cette correction gratuite
      const nftSourceId = 1; // ID du NFT Source "Correcteur Universel" (créé en seed)
      
      const [nftBeneficiary] = await db.insert(nftBeneficiaries).values({
        userId: ctx.user.id,
        nftSourceId: nftSourceId,
        gratitudeLevel: "none",
      });

      // Sauvegarder dans l'historique
      const [correction] = await db.insert(correctionsHistory).values({
        userId: ctx.user.id,
        contentType: "text",
        title: input.title,
        originalContent: input.content,
        correctedContent: analysis.correctedContent,
        scoreBefore: analysis.scoreBefore,
        scoreAfter: analysis.scoreAfter,
        frictions: JSON.stringify(analysis.frictions),
        recommendations: JSON.stringify(analysis.recommendations),
        nftBeneficiaryId: nftBeneficiary.insertId,
        status: "completed",
      });

      return {
        correctionId: correction.insertId,
        ...analysis,
      };
    }),

  /**
   * Corriger un bilan prévisionnel (analyse financière)
   */
  correctFinancial: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      content: z.string().min(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const analysisPrompt = `Tu es un expert en analyse financière et clarté de communication.

Analyse ce bilan prévisionnel et fournis :

1. **Score de Clarté Financière** (0-20 points) :
   - Hypothèses clairement énoncées ? (4 pts)
   - Projections réalistes et justifiées ? (4 pts)
   - Risques identifiés et quantifiés ? (4 pts)
   - Plan de trésorerie détaillé ? (4 pts)
   - Scénarios alternatifs (pessimiste/optimiste) ? (4 pts)

2. **Erreurs identifiées** :
   - Erreurs de cohérence (revenus vs coûts)
   - Hypothèses irréalistes
   - Manque de justification
   - Risques non pris en compte

3. **Recommandations** (5 actions prioritaires)

4. **Version corrigée** du bilan (applique les corrections)

5. **Score après correction** (0-20 points)

Bilan à analyser :
"""
${input.content}
"""

Réponds UNIQUEMENT au format JSON suivant :
{
  "scoreBefore": 10,
  "scoreAfter": 17,
  "errors": {
    "coherence": ["Erreur 1", "Erreur 2"],
    "realism": ["Hypothèse irréaliste 1"],
    "justification": ["Manque de justification 1"],
    "risks": ["Risque non pris en compte 1"]
  },
  "recommendations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3",
    "Recommandation 4",
    "Recommandation 5"
  ],
  "correctedContent": "Version corrigée du bilan..."
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Tu es un expert en analyse financière. Tu réponds UNIQUEMENT en JSON valide." },
          { role: "user", content: analysisPrompt }
        ],
      });

      let analysis;
      try {
        const rawContent = response.choices[0].message.content;
        const content = typeof rawContent === 'string' ? rawContent : "{}";
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(cleanContent);
      } catch (error) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Erreur lors de l'analyse IA" 
        });
      }

      // Sauvegarder dans l'historique
      const [correction] = await db.insert(correctionsHistory).values({
        userId: ctx.user.id,
        contentType: "financial",
        title: input.title,
        originalContent: input.content,
        correctedContent: analysis.correctedContent,
        scoreBefore: analysis.scoreBefore,
        scoreAfter: analysis.scoreAfter,
        frictions: JSON.stringify(analysis.errors),
        recommendations: JSON.stringify(analysis.recommendations),
        specificAnalysis: JSON.stringify({ type: "financial", errors: analysis.errors }),
        status: "completed",
      });

      return {
        correctionId: correction.insertId,
        ...analysis,
      };
    }),

  /**
   * Corriger un site web complet (SEO, UX, structure)
   */
  correctWebsite: protectedProcedure
    .input(z.object({
      title: z.string().min(1),
      url: z.string().url().optional(),
      content: z.string().min(50),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const analysisPrompt = `Tu es un expert en UX, SEO et clarté de communication web.

Analyse ce contenu de site web et fournis :

1. **Score Global** (0-20 points) :
   - Clarté du message principal (PFPMA) ? (4 pts)
   - SEO (mots-clés, structure, meta) ? (4 pts)
   - UX (navigation, hiérarchie, CTA) ? (4 pts)
   - Performance (vitesse perçue, optimisation) ? (4 pts)
   - Conversion (tunnel clair, friction minimale) ? (4 pts)

2. **Problèmes identifiés** :
   - SEO : Mots-clés manquants, meta descriptions, structure H1-H6
   - UX : Navigation confuse, CTA peu visibles, hiérarchie floue
   - Clarté : Message principal dilué, frictions PFPMA
   - Conversion : Tunnel de conversion non optimisé

3. **Recommandations** (10 actions prioritaires)

4. **Version corrigée** (applique les corrections)

5. **Score après correction** (0-20 points)

${input.url ? `URL : ${input.url}` : ""}

Contenu à analyser :
"""
${input.content}
"""

Réponds UNIQUEMENT au format JSON suivant :
{
  "scoreBefore": 11,
  "scoreAfter": 18,
  "issues": {
    "seo": ["Problème SEO 1", "Problème SEO 2"],
    "ux": ["Problème UX 1"],
    "clarity": ["Problème clarté 1"],
    "conversion": ["Problème conversion 1"]
  },
  "recommendations": [
    "Recommandation 1",
    "Recommandation 2",
    "Recommandation 3",
    "Recommandation 4",
    "Recommandation 5",
    "Recommandation 6",
    "Recommandation 7",
    "Recommandation 8",
    "Recommandation 9",
    "Recommandation 10"
  ],
  "correctedContent": "Version corrigée du site..."
}`;

      const response = await invokeLLM({
        messages: [
          { role: "system", content: "Tu es un expert en UX, SEO et clarté web. Tu réponds UNIQUEMENT en JSON valide." },
          { role: "user", content: analysisPrompt }
        ],
      });

      let analysis;
      try {
        const rawContent = response.choices[0].message.content;
        const content = typeof rawContent === 'string' ? rawContent : "{}";
        const cleanContent = content.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
        analysis = JSON.parse(cleanContent);
      } catch (error) {
        throw new TRPCError({ 
          code: "INTERNAL_SERVER_ERROR", 
          message: "Erreur lors de l'analyse IA" 
        });
      }

      // Sauvegarder dans l'historique
      const [correction] = await db.insert(correctionsHistory).values({
        userId: ctx.user.id,
        contentType: "website",
        title: input.title,
        originalContent: input.content,
        correctedContent: analysis.correctedContent,
        scoreBefore: analysis.scoreBefore,
        scoreAfter: analysis.scoreAfter,
        frictions: JSON.stringify(analysis.issues),
        recommendations: JSON.stringify(analysis.recommendations),
        specificAnalysis: JSON.stringify({ type: "website", url: input.url, issues: analysis.issues }),
        status: "completed",
      });

      return {
        correctionId: correction.insertId,
        ...analysis,
      };
    }),

  // ============================================================================
  // HISTORIQUE DES CORRECTIONS
  // ============================================================================

  /**
   * Récupérer mes corrections
   */
  getMyCorrections: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return [];

      const corrections = await db.select()
        .from(correctionsHistory)
        .where(eq(correctionsHistory.userId, ctx.user.id))
        .orderBy(desc(correctionsHistory.createdAt));

      return corrections.map(c => ({
        ...c,
        frictions: JSON.parse(c.frictions),
        recommendations: JSON.parse(c.recommendations),
        specificAnalysis: c.specificAnalysis ? JSON.parse(c.specificAnalysis) : null,
      }));
    }),

  /**
   * Récupérer une correction par ID
   */
  getCorrectionById: protectedProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) return null;

      const [correction] = await db.select()
        .from(correctionsHistory)
        .where(eq(correctionsHistory.id, input.id));

      if (!correction) return null;

      // Vérifier que l'utilisateur est bien le propriétaire
      if (correction.userId !== ctx.user.id && ctx.user.role !== "admin") {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      return {
        ...correction,
        frictions: JSON.parse(correction.frictions),
        recommendations: JSON.parse(correction.recommendations),
        specificAnalysis: correction.specificAnalysis ? JSON.parse(correction.specificAnalysis) : null,
      };
    }),

  /**
   * Marquer une correction comme utilisée
   */
  markAsUsed: protectedProcedure
    .input(z.object({
      correctionId: z.number(),
      declaredBenefit: z.string().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [correction] = await db.select()
        .from(correctionsHistory)
        .where(eq(correctionsHistory.id, input.correctionId));

      if (!correction || correction.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.update(correctionsHistory)
        .set({
          wasUsed: true,
          declaredBenefit: input.declaredBenefit,
        })
        .where(eq(correctionsHistory.id, input.correctionId));

      return { success: true };
    }),

  /**
   * Supprimer une correction
   */
  deleteCorrection: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ ctx, input }) => {
      const db = await getDb();
      if (!db) throw new TRPCError({ code: "INTERNAL_SERVER_ERROR" });

      const [correction] = await db.select()
        .from(correctionsHistory)
        .where(eq(correctionsHistory.id, input.id));

      if (!correction || correction.userId !== ctx.user.id) {
        throw new TRPCError({ code: "FORBIDDEN" });
      }

      await db.delete(correctionsHistory)
        .where(eq(correctionsHistory.id, input.id));

      return { success: true };
    }),

  // ============================================================================
  // STATISTIQUES
  // ============================================================================

  /**
   * Récupérer les statistiques de mes corrections
   */
  getMyStats: protectedProcedure
    .query(async ({ ctx }) => {
      const db = await getDb();
      if (!db) return null;

      const corrections = await db.select()
        .from(correctionsHistory)
        .where(eq(correctionsHistory.userId, ctx.user.id));

      const totalCorrections = corrections.length;
      const avgScoreBefore = corrections.reduce((sum, c) => sum + c.scoreBefore, 0) / totalCorrections || 0;
      const avgScoreAfter = corrections.reduce((sum, c) => sum + c.scoreAfter, 0) / totalCorrections || 0;
      const avgImprovement = avgScoreAfter - avgScoreBefore;
      const usedCorrections = corrections.filter(c => c.wasUsed).length;

      const byType = corrections.reduce((acc, c) => {
        acc[c.contentType] = (acc[c.contentType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalCorrections,
        avgScoreBefore: Math.round(avgScoreBefore * 10) / 10,
        avgScoreAfter: Math.round(avgScoreAfter * 10) / 10,
        avgImprovement: Math.round(avgImprovement * 10) / 10,
        usedCorrections,
        byType,
      };
    }),
});
