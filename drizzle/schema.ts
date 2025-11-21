import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  
  /** Stripe Customer ID for payment processing */
  stripeCustomerId: varchar("stripeCustomerId", { length: 255 }),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Orders table - stores essential Stripe identifiers only
 * Following the principle: "If Stripe stores it, don't duplicate it locally"
 */
export const orders = mysqlTable("orders", {
  id: int("id").autoincrement().primaryKey(),
  
  /** User who placed the order */
  userId: int("userId").notNull(),
  
  /** Stripe Payment Intent ID - use this to fetch payment details from Stripe API */
  stripePaymentIntentId: varchar("stripePaymentIntentId", { length: 255 }).notNull(),
  
  /** Stripe Checkout Session ID - for reference */
  stripeSessionId: varchar("stripeSessionId", { length: 255 }),
  
  /** Product ID from products.ts */
  productId: varchar("productId", { length: 100 }).notNull(),
  
  /** Order status - local fulfillment tracking */
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  
  /** Fulfillment notes - internal use only */
  notes: text("notes"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;

/**
 * Artefacts table - stores files/deliverables for orders
 * Files are stored in S3, this table contains metadata and URLs
 */
export const artefacts = mysqlTable("artefacts", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Order this artefact belongs to */
  orderId: int("orderId").notNull(),
  
  /** Human-readable name of the artefact */
  name: varchar("name", { length: 255 }).notNull(),
  
  /** Description of the artefact */
  description: text("description"),
  
  /** S3 key (path) for the file */
  s3Key: varchar("s3Key", { length: 500 }).notNull(),
  
  /** Public S3 URL for download */
  s3Url: varchar("s3Url", { length: 1000 }).notNull(),
  
  /** File type (e.g., "application/pdf", "image/png") */
  fileType: varchar("fileType", { length: 100 }),
  
  /** File size in bytes */
  fileSize: int("fileSize"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type Artefact = typeof artefacts.$inferSelect;
export type InsertArtefact = typeof artefacts.$inferInsert;

/**
 * Blog posts table - stores articles, case studies, and testimonials
 */
export const blogPosts = mysqlTable("blog_posts", {
  id: int("id").autoincrement().primaryKey(),
  
  /** URL-friendly slug */
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  
  /** Article title */
  title: varchar("title", { length: 500 }).notNull(),
  
  /** Short excerpt for listing pages */
  excerpt: text("excerpt").notNull(),
  
  /** Full article content (Markdown supported) */
  content: text("content").notNull(),
  
  /** Cover image URL */
  coverImage: varchar("coverImage", { length: 500 }),
  
  /** Category: case-study, methodology, insights */
  category: varchar("category", { length: 100 }).notNull(),
  
  /** Author (references users table) */
  authorId: int("authorId"),
  
  /** Publication status */
  published: mysqlEnum("published", ["draft", "published"]).default("draft").notNull(),
  
  /** Publication date */
  publishedAt: timestamp("publishedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  
  /** Case study metadata */
  clientName: varchar("clientName", { length: 255 }),
  clientIndustry: varchar("clientIndustry", { length: 100 }),
  scoreBefore: int("scoreBefore"),
  scoreAfter: int("scoreAfter"),
  roi: varchar("roi", { length: 100 }),
  testimonial: text("testimonial"),
  videoUrl: varchar("videoUrl", { length: 500 }),
});

export type BlogPost = typeof blogPosts.$inferSelect;
export type InsertBlogPost = typeof blogPosts.$inferInsert;