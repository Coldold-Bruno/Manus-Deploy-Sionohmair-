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