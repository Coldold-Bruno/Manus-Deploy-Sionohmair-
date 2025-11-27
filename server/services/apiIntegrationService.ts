import { getDb } from "../db";
import { eq, and, gte, desc } from "drizzle-orm";
import {
  apiIntegrations,
  benefitIndices,
  detectionLogs,
  nftBeneficiaries,
  nftSources,
} from "../../drizzle/schema";

/**
 * Service d'Intégrations API pour la Détection Automatique de Bénéfices
 * 
 * Supporte :
 * - Stripe (transactions, paiements)
 * - PayPal (transactions)
 * - Google Analytics (trafic, conversions)
 */

interface StripeTransaction {
  id: string;
  amount: number;
  currency: string;
  created: number;
  description?: string;
  customer?: string;
}

interface PayPalTransaction {
  id: string;
  amount: {
    value: string;
    currency: string;
  };
  create_time: string;
  payer?: {
    email_address?: string;
  };
}

interface GoogleAnalyticsData {
  sessions: number;
  users: number;
  pageviews: number;
  conversions: number;
  revenue: number;
  period: {
    start: string;
    end: string;
  };
}

/**
 * Détection automatique via Stripe
 */
export async function detectStripeTransactions(
  userId: number,
  beneficiaryId: number,
  sourceId: number,
  integrationId: number
): Promise<{ indicesCreated: number; totalBenefit: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer l'intégration
  const [integration] = await db.select()
    .from(apiIntegrations)
    .where(eq(apiIntegrations.id, integrationId));

  if (!integration || integration.status !== "active") {
    throw new Error("Integration not found or inactive");
  }

  const apiKey = integration.apiKey;
  if (!apiKey) {
    throw new Error("API key not configured");
  }

  try {
    // Appeler l'API Stripe pour récupérer les transactions récentes (30 derniers jours)
    const thirtyDaysAgo = Math.floor(Date.now() / 1000) - (30 * 24 * 60 * 60);
    
    // Note: En production, utiliser la vraie API Stripe
    // const stripe = new Stripe(apiKey);
    // const charges = await stripe.charges.list({
    //   created: { gte: thirtyDaysAgo },
    //   limit: 100,
    // });

    // Pour la démo, simuler des transactions
    const mockTransactions: StripeTransaction[] = [
      {
        id: "ch_1234567890",
        amount: 49900, // 499 €
        currency: "eur",
        created: Date.now() / 1000,
        description: "Vente produit X",
      },
      {
        id: "ch_0987654321",
        amount: 29900, // 299 €
        currency: "eur",
        created: Date.now() / 1000 - 86400,
        description: "Vente produit Y",
      },
    ];

    let indicesCreated = 0;
    let totalBenefit = 0;

    for (const transaction of mockTransactions) {
      const amount = transaction.amount / 100; // Convertir centimes en euros
      totalBenefit += amount;

      // Créer un indice de bénéfice
      await db.insert(benefitIndices).values({
        beneficiaryId,
        sourceId,
        userId,
        indiceType: "direct",
        indiceCategory: "transaction",
        indiceName: `Transaction Stripe ${transaction.id}`,
        indiceDescription: transaction.description || "Transaction Stripe",
        indiceSource: "stripe_api",
        indiceData: JSON.stringify(transaction),
        confidenceScore: "1.00", // 100% de confiance pour les transactions directes
        presumedBenefit: amount.toFixed(2),
        status: "detected",
        detectedAt: new Date(),
      });

      indicesCreated++;
    }

    // Créer un log de détection
    await db.insert(detectionLogs).values({
      userId,
      integrationId,
      detectionMethod: "api_stripe",
      detectionSource: "Stripe API",
      indicesFound: indicesCreated,
      benefitsDetected: totalBenefit.toFixed(2),
      rawData: JSON.stringify(mockTransactions),
      detectedAt: new Date(),
    });

    // Mettre à jour la date de dernière synchronisation
    await db.update(apiIntegrations)
      .set({ lastSyncAt: new Date() })
      .where(eq(apiIntegrations.id, integrationId));

    return { indicesCreated, totalBenefit };
  } catch (error: any) {
    console.error("Stripe detection error:", error);
    throw new Error(`Stripe detection failed: ${error.message}`);
  }
}

/**
 * Détection automatique via PayPal
 */
export async function detectPayPalTransactions(
  userId: number,
  beneficiaryId: number,
  sourceId: number,
  integrationId: number
): Promise<{ indicesCreated: number; totalBenefit: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [integration] = await db.select()
    .from(apiIntegrations)
    .where(eq(apiIntegrations.id, integrationId));

  if (!integration || integration.status !== "active") {
    throw new Error("Integration not found or inactive");
  }

  // Pour la démo, simuler des transactions PayPal
  const mockTransactions: PayPalTransaction[] = [
    {
      id: "PAYID-123456",
      amount: { value: "199.00", currency: "EUR" },
      create_time: new Date().toISOString(),
      payer: { email_address: "client@example.com" },
    },
  ];

  let indicesCreated = 0;
  let totalBenefit = 0;

  for (const transaction of mockTransactions) {
    const amount = parseFloat(transaction.amount.value);
    totalBenefit += amount;

    await db.insert(benefitIndices).values({
      beneficiaryId,
      sourceId,
      userId,
      indiceType: "direct",
      indiceCategory: "transaction",
      indiceName: `Transaction PayPal ${transaction.id}`,
      indiceDescription: `Paiement PayPal de ${amount} €`,
      indiceSource: "paypal_api",
      indiceData: JSON.stringify(transaction),
      confidenceScore: "1.00",
      presumedBenefit: amount.toFixed(2),
      status: "detected",
      detectedAt: new Date(),
    });

    indicesCreated++;
  }

  await db.insert(detectionLogs).values({
    userId,
    integrationId,
    detectionMethod: "api_paypal",
    detectionSource: "PayPal API",
    indicesFound: indicesCreated,
    benefitsDetected: totalBenefit.toFixed(2),
    rawData: JSON.stringify(mockTransactions),
    detectedAt: new Date(),
  });

  await db.update(apiIntegrations)
    .set({ lastSyncAt: new Date() })
    .where(eq(apiIntegrations.id, integrationId));

  return { indicesCreated, totalBenefit };
}

/**
 * Détection automatique via Google Analytics
 */
export async function detectGoogleAnalyticsActivity(
  userId: number,
  beneficiaryId: number,
  sourceId: number,
  integrationId: number
): Promise<{ indicesCreated: number; totalBenefit: number }> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const [integration] = await db.select()
    .from(apiIntegrations)
    .where(eq(apiIntegrations.id, integrationId));

  if (!integration || integration.status !== "active") {
    throw new Error("Integration not found or inactive");
  }

  // Pour la démo, simuler des données Google Analytics
  const mockData: GoogleAnalyticsData = {
    sessions: 15000,
    users: 12000,
    pageviews: 45000,
    conversions: 150,
    revenue: 22500, // 150 conversions × 150 € moyen
    period: {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      end: new Date().toISOString(),
    },
  };

  let indicesCreated = 0;
  let totalBenefit = 0;

  // Indice 1 : Augmentation de trafic (si >50% sur 30j)
  const trafficIncrease = 65; // % d'augmentation simulé
  if (trafficIncrease > 50) {
    await db.insert(benefitIndices).values({
      beneficiaryId,
      sourceId,
      userId,
      indiceType: "indirect",
      indiceCategory: "traffic",
      indiceName: `Augmentation trafic +${trafficIncrease}%`,
      indiceDescription: `Augmentation significative du trafic web détectée sur 30 jours`,
      indiceSource: "google_analytics",
      indiceData: JSON.stringify({ trafficIncrease, sessions: mockData.sessions }),
      confidenceScore: "0.70", // 70% de confiance pour les indices indirects
      presumedBenefit: "5000.00", // Estimation basée sur l'augmentation
      status: "detected",
      detectedAt: new Date(),
    });
    indicesCreated++;
    totalBenefit += 5000;
  }

  // Indice 2 : Conversions détectées
  if (mockData.conversions > 0 && mockData.revenue > 0) {
    await db.insert(benefitIndices).values({
      beneficiaryId,
      sourceId,
      userId,
      indiceType: "direct",
      indiceCategory: "conversion",
      indiceName: `${mockData.conversions} conversions trackées`,
      indiceDescription: `Conversions e-commerce détectées via Google Analytics`,
      indiceSource: "google_analytics",
      indiceData: JSON.stringify({ conversions: mockData.conversions, revenue: mockData.revenue }),
      confidenceScore: "0.85", // 85% de confiance
      presumedBenefit: mockData.revenue.toFixed(2),
      status: "detected",
      detectedAt: new Date(),
    });
    indicesCreated++;
    totalBenefit += mockData.revenue;
  }

  await db.insert(detectionLogs).values({
    userId,
    integrationId,
    detectionMethod: "api_google_analytics",
    detectionSource: "Google Analytics API",
    indicesFound: indicesCreated,
    benefitsDetected: totalBenefit.toFixed(2),
    rawData: JSON.stringify(mockData),
    detectedAt: new Date(),
  });

  await db.update(apiIntegrations)
    .set({ lastSyncAt: new Date() })
    .where(eq(apiIntegrations.id, integrationId));

  return { indicesCreated, totalBenefit };
}

/**
 * Exécuter toutes les intégrations actives pour un utilisateur
 */
export async function runAllIntegrations(userId: number): Promise<{
  totalIndices: number;
  totalBenefit: number;
  integrations: Array<{ name: string; indicesCreated: number; benefit: number }>;
}> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Récupérer toutes les intégrations actives de l'utilisateur
  const integrations = await db.select()
    .from(apiIntegrations)
    .where(and(
      eq(apiIntegrations.userId, userId),
      eq(apiIntegrations.status, "active")
    ));

  if (integrations.length === 0) {
    return { totalIndices: 0, totalBenefit: 0, integrations: [] };
  }

  let totalIndices = 0;
  let totalBenefit = 0;
  const results: Array<{ name: string; indicesCreated: number; benefit: number }> = [];

  for (const integration of integrations) {
    try {
      let result: { indicesCreated: number; totalBenefit: number };

      // Récupérer le premier bénéficiaire de l'utilisateur (simplification)
      const [beneficiary] = await db.select()
        .from(nftBeneficiaries)
        .where(eq(nftBeneficiaries.userId, userId))
        .limit(1);

      if (!beneficiary) continue;

      // Récupérer la première source (simplification)
      const [source] = await db.select()
        .from(nftSources)
        .limit(1);

      if (!source) continue;

      switch (integration.platform) {
        case "stripe":
          result = await detectStripeTransactions(userId, beneficiary.id, source.id, integration.id);
          break;
        case "paypal":
          result = await detectPayPalTransactions(userId, beneficiary.id, source.id, integration.id);
          break;
        case "google_analytics":
          result = await detectGoogleAnalyticsActivity(userId, beneficiary.id, source.id, integration.id);
          break;
        default:
          continue;
      }

      totalIndices += result.indicesCreated;
      totalBenefit += result.totalBenefit;
      results.push({
        name: integration.integrationName,
        indicesCreated: result.indicesCreated,
        benefit: result.totalBenefit,
      });
    } catch (error: any) {
      console.error(`Integration ${integration.integrationName} failed:`, error);
    }
  }

  return { totalIndices, totalBenefit, integrations: results };
}
