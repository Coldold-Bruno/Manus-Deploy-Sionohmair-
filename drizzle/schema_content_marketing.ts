import { mysqlTable, varchar, text, int, datetime, json, decimal, boolean } from 'drizzle-orm/mysql-core';

/**
 * Schéma de base de données pour l'analyseur de contenu marketing
 * Sionohmair Insight Academy - Content Marketing & Copywriting Platform
 */

// Analyses de contenu marketing
export const contentAnalyses = mysqlTable('content_analyses', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Contenu analysé
  title: varchar('title', { length: 500 }),
  content: text('content').notNull(),
  contentType: varchar('content_type', { length: 50 }).notNull(), // 'landing_page', 'email', 'ad', 'blog_post', 'social_post'
  url: varchar('url', { length: 1000 }),
  
  // Scores globaux (0-100)
  seoScore: int('seo_score'),
  conversionScore: int('conversion_score'),
  engagementScore: int('engagement_score'),
  readabilityScore: int('readability_score'),
  psychologyScore: int('psychology_score'),
  overallScore: int('overall_score'),
  
  // Analyse SEO
  seoAnalysis: json('seo_analysis').$type<{
    keywords: { keyword: string; density: number; position: string }[];
    metaTitle: { present: boolean; length: number; optimized: boolean };
    metaDescription: { present: boolean; length: number; optimized: boolean };
    headings: { h1: number; h2: number; h3: number; structure: string };
    internalLinks: number;
    externalLinks: number;
    imageAltTags: { total: number; missing: number };
    recommendations: string[];
  }>(),
  
  // Analyse de conversion
  conversionAnalysis: json('conversion_analysis').$type<{
    cta: { present: boolean; count: number; strength: string; suggestions: string[] };
    valueProposition: { present: boolean; clarity: string; uniqueness: string };
    urgency: { present: boolean; type: string; effectiveness: string };
    socialProof: { present: boolean; types: string[]; credibility: string };
    riskReversal: { present: boolean; guarantees: string[] };
    frictionPoints: string[];
    recommendations: string[];
  }>(),
  
  // Analyse d'engagement
  engagementAnalysis: json('engagement_analysis').$type<{
    hook: { present: boolean; strength: string; emotionalImpact: string };
    storytelling: { present: boolean; structure: string; coherence: string };
    emotionalTriggers: string[];
    personalisation: { level: string; pronouns: { you: number; we: number; i: number } };
    questions: { count: number; engagement: string };
    visualElements: { images: number; videos: number; infographics: number };
    recommendations: string[];
  }>(),
  
  // Analyse de lisibilité
  readabilityAnalysis: json('readability_analysis').$type<{
    fleschScore: number;
    fleschLevel: string;
    avgSentenceLength: number;
    avgWordLength: number;
    complexWords: number;
    passiveVoice: number;
    adverbs: number;
    paragraphCount: number;
    avgParagraphLength: number;
    recommendations: string[];
  }>(),
  
  // Analyse psychologique
  psychologyAnalysis: json('psychology_analysis').$type<{
    persuasionPrinciples: { principle: string; present: boolean; strength: string }[];
    emotionalTone: { primary: string; secondary: string; intensity: number };
    cognitiveLoad: { level: string; complexity: number };
    biases: { bias: string; usage: string }[];
    painPoints: string[];
    desires: string[];
    objections: string[];
    recommendations: string[];
  }>(),
  
  // Suggestions d'amélioration
  suggestions: json('suggestions').$type<{
    critical: string[];
    important: string[];
    minor: string[];
  }>(),
  
  // Métadonnées
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at'),
});

// Avatars clients (personas)
export const clientAvatars = mysqlTable('client_avatars', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Informations démographiques
  name: varchar('name', { length: 255 }).notNull(),
  age: int('age'),
  gender: varchar('gender', { length: 50 }),
  location: varchar('location', { length: 255 }),
  occupation: varchar('occupation', { length: 255 }),
  income: varchar('income', { length: 100 }),
  education: varchar('education', { length: 255 }),
  
  // Informations psychographiques
  goals: json('goals').$type<string[]>(),
  challenges: json('challenges').$type<string[]>(),
  painPoints: json('pain_points').$type<string[]>(),
  desires: json('desires').$type<string[]>(),
  fears: json('fears').$type<string[]>(),
  values: json('values').$type<string[]>(),
  
  // Comportement
  buyingBehavior: json('buying_behavior').$type<{
    decisionMakers: string[];
    buyingCycle: string;
    budget: string;
    objections: string[];
  }>(),
  
  mediaConsumption: json('media_consumption').$type<{
    platforms: string[];
    contentTypes: string[];
    influencers: string[];
  }>(),
  
  // Messaging
  preferredTone: varchar('preferred_tone', { length: 100 }),
  keyMessages: json('key_messages').$type<string[]>(),
  avoidTopics: json('avoid_topics').$type<string[]>(),
  
  // Métadonnées
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at'),
});

// Frameworks de copywriting
export const copywritingFrameworks = mysqlTable('copywriting_frameworks', {
  id: int('id').primaryKey().autoincrement(),
  
  // Informations du framework
  name: varchar('name', { length: 255 }).notNull(),
  acronym: varchar('acronym', { length: 50 }).notNull(),
  category: varchar('category', { length: 100 }).notNull(), // 'persuasion', 'storytelling', 'sales', 'content'
  description: text('description').notNull(),
  
  // Structure
  structure: json('structure').$type<{
    step: string;
    description: string;
    example: string;
    tips: string[];
  }[]>(),
  
  // Utilisation
  bestFor: json('best_for').$type<string[]>(),
  notFor: json('not_for').$type<string[]>(),
  examples: json('examples').$type<{
    title: string;
    content: string;
    industry: string;
  }[]>(),
  
  // Métadonnées
  usageCount: int('usage_count').default(0),
  createdAt: datetime('created_at').notNull(),
});

// Copies générées
export const generatedCopies = mysqlTable('generated_copies', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Paramètres de génération
  frameworkId: int('framework_id'),
  avatarId: int('avatar_id'),
  contentType: varchar('content_type', { length: 50 }).notNull(),
  
  // Input
  brief: text('brief').notNull(),
  keywords: json('keywords').$type<string[]>(),
  tone: varchar('tone', { length: 100 }),
  length: varchar('length', { length: 50 }),
  
  // Output
  generatedContent: text('generated_content').notNull(),
  variants: json('variants').$type<string[]>(),
  
  // Scores
  qualityScore: int('quality_score'),
  persuasionScore: int('persuasion_score'),
  
  // Utilisation
  used: boolean('used').default(false),
  usedAt: datetime('used_at'),
  
  // Métadonnées
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at'),
});

// Funnels marketing
export const marketingFunnels = mysqlTable('marketing_funnels', {
  id: int('id').primaryKey().autoincrement(),
  userId: int('user_id').notNull(),
  
  // Informations du funnel
  name: varchar('name', { length: 255 }).notNull(),
  description: text('description'),
  
  // Étapes du funnel
  stages: json('stages').$type<{
    name: string;
    type: string; // 'awareness', 'consideration', 'decision', 'retention'
    contentId: number;
    conversionRate: number;
    dropoffRate: number;
    avgTimeSpent: number;
  }[]>(),
  
  // Métriques globales
  totalVisitors: int('total_visitors').default(0),
  totalConversions: int('total_conversions').default(0),
  conversionRate: decimal('conversion_rate', { precision: 5, scale: 2 }),
  avgRevenue: decimal('avg_revenue', { precision: 10, scale: 2 }),
  
  // Analyse
  bottlenecks: json('bottlenecks').$type<{
    stage: string;
    issue: string;
    impact: string;
    recommendation: string;
  }[]>(),
  
  optimizations: json('optimizations').$type<{
    stage: string;
    suggestion: string;
    expectedImpact: string;
    priority: string;
  }[]>(),
  
  // Métadonnées
  createdAt: datetime('created_at').notNull(),
  updatedAt: datetime('updated_at'),
});
