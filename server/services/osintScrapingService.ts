import { getDb } from "../db";
import { eq } from "drizzle-orm";
import {
  benefitIndices,
  detectionLogs,
  nftBeneficiaries,
  nftSources,
} from "../../drizzle/schema";

/**
 * Service de Scraping OSINT pour Détecter les Mentions Publiques
 * 
 * Détecte automatiquement les mentions de "Sionohmair" ou des ressources gratuites
 * dans un contexte commercial (lancement produit, témoignage client, case study, etc.)
 * 
 * Sources :
 * - Google Search (via API ou scraping)
 * - LinkedIn (posts, articles)
 * - Twitter/X (tweets)
 * - Sites web publics (blogs, landing pages)
 * - YouTube (descriptions de vidéos)
 */

interface MentionResult {
  url: string;
  title: string;
  snippet: string;
  source: string; // google, linkedin, twitter, website, youtube
  mentionType: string; // testimonial, case_study, product_launch, blog_post, social_media
  commercialContext: boolean; // true si contexte commercial détecté
  confidenceScore: number; // 0.5 à 1.0
  detectedAt: Date;
  rawData?: any;
}

/**
 * Détecter les mentions via Google Search
 */
export async function detectGoogleMentions(
  searchQuery: string
): Promise<MentionResult[]> {
  // En production, utiliser Google Custom Search API
  // const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
  // const cx = process.env.GOOGLE_SEARCH_CX;
  // const url = `https://www.googleapis.com/customsearch/v1?key=${apiKey}&cx=${cx}&q=${encodeURIComponent(searchQuery)}`;
  
  // Pour la démo, simuler des résultats
  const mockResults: MentionResult[] = [
    {
      url: "https://example.com/case-study-sionohmair",
      title: "Comment Sionohmair a transformé notre communication - Case Study",
      snippet: "Grâce à la méthodologie PFPMA de Sionohmair, nous avons augmenté nos conversions de 340%. Le Sprint de Clarté nous a permis d'identifier les frictions...",
      source: "google",
      mentionType: "case_study",
      commercialContext: true,
      confidenceScore: 0.95,
      detectedAt: new Date(),
      rawData: {
        rank: 1,
        displayLink: "example.com",
      },
    },
    {
      url: "https://startup.com/notre-lancement",
      title: "Lancement de notre nouveau produit SaaS",
      snippet: "Après avoir suivi la formation Sionohmair Insight Academy, nous avons lancé notre produit avec une clarté exceptionnelle. Résultat : 500 clients en 3 mois...",
      source: "google",
      mentionType: "product_launch",
      commercialContext: true,
      confidenceScore: 0.90,
      detectedAt: new Date(),
    },
    {
      url: "https://blog.entreprise.fr/temoignage-sionohmair",
      title: "Témoignage : La méthode Sionohmair a changé notre approche",
      snippet: "Le Correcteur Universel de Sionohmair nous a permis de corriger tous nos contenus marketing. Nous avons doublé notre taux de conversion...",
      source: "google",
      mentionType: "testimonial",
      commercialContext: true,
      confidenceScore: 0.85,
      detectedAt: new Date(),
    },
  ];

  return mockResults;
}

/**
 * Détecter les mentions sur LinkedIn
 */
export async function detectLinkedInMentions(
  searchQuery: string
): Promise<MentionResult[]> {
  // En production, utiliser LinkedIn API (nécessite OAuth)
  // Pour la démo, simuler des résultats
  const mockResults: MentionResult[] = [
    {
      url: "https://linkedin.com/posts/john-doe-sionohmair-success",
      title: "John Doe - Succès grâce à Sionohmair",
      snippet: "🚀 Fier d'annoncer que notre startup a levé 2M€ ! La clarté de notre pitch deck, travaillée avec la méthodologie Sionohmair, a fait toute la différence. #startup #fundraising",
      source: "linkedin",
      mentionType: "social_media",
      commercialContext: true,
      confidenceScore: 0.80,
      detectedAt: new Date(),
    },
  ];

  return mockResults;
}

/**
 * Détecter les mentions sur Twitter/X
 */
export async function detectTwitterMentions(
  searchQuery: string
): Promise<MentionResult[]> {
  // En production, utiliser Twitter API v2
  // Pour la démo, simuler des résultats
  const mockResults: MentionResult[] = [
    {
      url: "https://twitter.com/startup/status/123456",
      title: "Tweet de @startup",
      snippet: "Lancement de notre nouveau produit aujourd'hui ! 🎉 Merci @Sionohmair pour la formation qui nous a permis d'atteindre la clarté parfaite. 500 early adopters en 24h ! 🚀",
      source: "twitter",
      mentionType: "product_launch",
      commercialContext: true,
      confidenceScore: 0.75,
      detectedAt: new Date(),
    },
  ];

  return mockResults;
}

/**
 * Analyser le contexte commercial d'une mention
 */
function analyzeCommercialContext(mention: MentionResult): {
  isCommercial: boolean;
  indicators: string[];
  estimatedBenefit: number;
} {
  const commercialKeywords = [
    "lancement", "produit", "service", "clients", "ventes", "conversions",
    "chiffre d'affaires", "CA", "revenus", "levée de fonds", "fundraising",
    "startup", "entreprise", "business", "ROI", "performance", "résultats",
    "croissance", "augmentation", "doublé", "triplé", "×2", "×3", "+50%",
    "case study", "témoignage client", "success story",
  ];

  const text = `${mention.title} ${mention.snippet}`.toLowerCase();
  const indicators: string[] = [];
  let estimatedBenefit = 0;

  // Détecter les mots-clés commerciaux
  for (const keyword of commercialKeywords) {
    if (text.includes(keyword.toLowerCase())) {
      indicators.push(keyword);
    }
  }

  // Détecter les chiffres (potentiels revenus)
  const numberMatches = text.match(/(\d+[\s,]?\d*)\s*(€|euros?|k€|m€|clients?|conversions?|%)/gi);
  if (numberMatches) {
    indicators.push(`Chiffres détectés: ${numberMatches.join(", ")}`);
    
    // Estimer le bénéfice basé sur les chiffres trouvés
    for (const match of numberMatches) {
      const num = parseFloat(match.replace(/[^\d.]/g, ""));
      if (match.includes("k€")) estimatedBenefit += num * 1000;
      else if (match.includes("m€")) estimatedBenefit += num * 1000000;
      else if (match.includes("€")) estimatedBenefit += num;
      else if (match.includes("clients")) estimatedBenefit += num * 100; // Estimation : 100€ par client
      else if (match.includes("conversions")) estimatedBenefit += num * 150; // Estimation : 150€ par conversion
    }
  }

  // Si pas de chiffres, estimer selon le type de mention
  if (estimatedBenefit === 0) {
    switch (mention.mentionType) {
      case "product_launch":
        estimatedBenefit = 10000; // Estimation par défaut pour un lancement
        break;
      case "case_study":
        estimatedBenefit = 25000; // Estimation pour un case study
        break;
      case "testimonial":
        estimatedBenefit = 5000; // Estimation pour un témoignage
        break;
      case "fundraising":
        estimatedBenefit = 50000; // Estimation pour une levée de fonds
        break;
      default:
        estimatedBenefit = 2000; // Estimation minimale
    }
  }

  return {
    isCommercial: indicators.length >= 2,
    indicators,
    estimatedBenefit,
  };
}

/**
 * Exécuter le scraping OSINT complet
 */
export async function runOSINTScraping(
  userId: number,
  beneficiaryId: number,
  sourceId: number,
  searchQuery: string = "Sionohmair"
): Promise<{
  mentionsFound: number;
  indicesCreated: number;
  totalEstimatedBenefit: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  try {
    // Collecter les mentions de toutes les sources
    const googleMentions = await detectGoogleMentions(searchQuery);
    const linkedinMentions = await detectLinkedInMentions(searchQuery);
    const twitterMentions = await detectTwitterMentions(searchQuery);

    const allMentions = [...googleMentions, ...linkedinMentions, ...twitterMentions];

    let indicesCreated = 0;
    let totalEstimatedBenefit = 0;

    for (const mention of allMentions) {
      // Analyser le contexte commercial
      const analysis = analyzeCommercialContext(mention);

      if (!analysis.isCommercial) {
        continue; // Ignorer les mentions non commerciales
      }

      // Créer un indice de bénéfice
      await db.insert(benefitIndices).values({
        beneficiaryId,
        sourceId,
        userId,
        indiceType: "contextual",
        indiceCategory: "mention",
        indiceName: `Mention publique : ${mention.title}`,
        indiceDescription: mention.snippet,
        indiceSource: mention.url,
        indiceData: JSON.stringify({
          ...mention,
          analysis,
        }),
        confidenceScore: mention.confidenceScore.toFixed(2),
        presumedBenefit: analysis.estimatedBenefit.toFixed(2),
        status: "detected",
        detectedAt: new Date(),
      });

      indicesCreated++;
      totalEstimatedBenefit += analysis.estimatedBenefit;
    }

    // Créer un log de détection
    await db.insert(detectionLogs).values({
      userId,
      integrationId: null, // Pas d'intégration API, c'est du scraping
      detectionMethod: "scraping",
      detectionSource: "OSINT (Google, LinkedIn, Twitter)",
      indicesFound: indicesCreated,
      benefitsDetected: totalEstimatedBenefit.toFixed(2),
      rawData: JSON.stringify(allMentions),
      detectedAt: new Date(),
    });

    return {
      mentionsFound: allMentions.length,
      indicesCreated,
      totalEstimatedBenefit,
    };
  } catch (error: any) {
    console.error("OSINT scraping error:", error);
    throw new Error(`OSINT scraping failed: ${error.message}`);
  }
}

/**
 * Exécuter le scraping OSINT pour tous les bénéficiaires actifs
 */
export async function runOSINTForAllBeneficiaries(): Promise<{
  beneficiariesScanned: number;
  totalMentions: number;
  totalIndices: number;
  totalBenefit: number;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer tous les bénéficiaires actifs
  const beneficiaries = await db.select()
    .from(nftBeneficiaries)
    .where(eq(nftBeneficiaries.contributionStatus, "active"));

  let totalMentions = 0;
  let totalIndices = 0;
  let totalBenefit = 0;

  for (const beneficiary of beneficiaries) {
    try {
      // Récupérer la première source (simplification)
      const [source] = await db.select()
        .from(nftSources)
        .limit(1);

      if (!source) continue;

      const result = await runOSINTScraping(
        beneficiary.userId,
        beneficiary.id,
        source.id,
        "Sionohmair" // Rechercher les mentions de Sionohmair
      );

      totalMentions += result.mentionsFound;
      totalIndices += result.indicesCreated;
      totalBenefit += result.totalEstimatedBenefit;
    } catch (error: any) {
      console.error(`OSINT scraping failed for beneficiary ${beneficiary.id}:`, error);
    }
  }

  return {
    beneficiariesScanned: beneficiaries.length,
    totalMentions,
    totalIndices,
    totalBenefit,
  };
}
