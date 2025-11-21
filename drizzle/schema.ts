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

/**
 * Newsletter subscribers table
 */
export const subscribers = mysqlTable("subscribers", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Email address */
  email: varchar("email", { length: 320 }).notNull().unique(),
  
  /** Subscriber name (optional) */
  name: varchar("name", { length: 255 }),
  
  /** Interests: diagnostic (Sprint), formation (N2), transformation (N3), general */
  interests: mysqlEnum("interests", ["diagnostic", "formation", "transformation", "general"]).default("general").notNull(),
  
  /** Subscription status */
  status: mysqlEnum("status", ["active", "unsubscribed"]).default("active").notNull(),
  
  /** Subscription source */
  source: varchar("source", { length: 100 }).default("website"),
  
  /** Welcome email sent */
  welcomeEmailSent: mysqlEnum("welcomeEmailSent", ["yes", "no"]).default("no").notNull(),
  
  /** Last email sent in the sequence (day number: 0, 1, 3, 5, 7, 10, 14) */
  lastEmailSent: int("lastEmailSent").default(0),
  
  /** Engagement score (0-100) based on opens, clicks, conversions */
  engagementScore: int("engagementScore").default(0),
  
  /** Total lead score combining newsletter + site behavior (0-200+) */
  leadScore: int("leadScore").default(0),
  
  /** Lead temperature: cold (0-40), warm (41-79), hot (80+) */
  leadTemperature: mysqlEnum("leadTemperature", ["cold", "warm", "hot"]).default("cold"),
  
  /** Last time a hot lead notification was sent to admin (to avoid duplicates) */
  lastHotNotificationSent: timestamp("lastHotNotificationSent"),
  
  subscribedAt: timestamp("subscribedAt").defaultNow().notNull(),
  unsubscribedAt: timestamp("unsubscribedAt"),
});

export type Subscriber = typeof subscribers.$inferSelect;
export type InsertSubscriber = typeof subscribers.$inferInsert;

/**
 * Lead activities table - tracks user behavior on the site for lead scoring
 */
export const leadActivities = mysqlTable("lead_activities", {
  id: int("id").autoincrement().primaryKey(),
  
  /** User ID (if authenticated) */
  userId: int("userId"),
  
  /** Email address (for tracking anonymous users) */
  email: varchar("email", { length: 320 }).notNull(),
  
  /** Activity type: page_view, calculator_use, download, form_submit, email_open, email_click, payment_intent */
  activityType: varchar("activityType", { length: 50 }).notNull(),
  
  /** JSON data about the activity (e.g., {"page": "/sprint", "duration": 120}) */
  activityData: text("activityData"),
  
  /** Points awarded for this activity */
  score: int("score").default(0),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type LeadActivity = typeof leadActivities.$inferSelect;
export type InsertLeadActivity = typeof leadActivities.$inferInsert;

/**
 * Lead notes table - stores admin notes/comments about leads
 */
export const leadNotes = mysqlTable("lead_notes", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Lead email address */
  leadEmail: varchar("leadEmail", { length: 320 }).notNull(),
  
  /** Admin user who created the note */
  userId: int("userId").notNull(),
  
  /** Type of note: call, email, meeting, objection, other */
  noteType: mysqlEnum("noteType", ["call", "email", "meeting", "objection", "other"]).default("other").notNull(),
  
  /** Note content */
  content: text("content").notNull(),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeadNote = typeof leadNotes.$inferSelect;
export type InsertLeadNote = typeof leadNotes.$inferInsert;

/**
 * Lead tasks table - stores tasks/reminders for leads
 */
export const leadTasks = mysqlTable("lead_tasks", {
  id: int("id").autoincrement().primaryKey(),
  
  /** Lead email address */
  leadEmail: varchar("leadEmail", { length: 320 }).notNull(),
  
  /** Admin user who created the task */
  userId: int("userId").notNull(),
  
  /** Type of task: call, email, meeting, follow_up, other */
  taskType: mysqlEnum("taskType", ["call", "email", "meeting", "follow_up", "other"]).default("other").notNull(),
  
  /** Task title */
  title: varchar("title", { length: 255 }).notNull(),
  
  /** Task description (optional) */
  description: text("description"),
  
  /** Due date for the task */
  dueDate: timestamp("dueDate").notNull(),
  
  /** Task status: pending, completed, cancelled */
  status: mysqlEnum("status", ["pending", "completed", "cancelled"]).default("pending").notNull(),
  
  /** Completion date */
  completedAt: timestamp("completedAt"),
  
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type LeadTask = typeof leadTasks.$inferSelect;
export type InsertLeadTask = typeof leadTasks.$inferInsert;
