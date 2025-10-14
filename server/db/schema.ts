import { pgTable, text, timestamp, jsonb, uuid, varchar, index } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";

// Replit Auth: Users table for OAuth authentication
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  oauthSub: varchar("oauth_sub").unique(), // OAuth subject claim from provider
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Replit Auth: Session storage table (managed by connect-pg-simple)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User assessment data (formerly in sessions table)
export const userAssessments = pgTable("user_assessments", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: varchar("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Assessment data fields
  intake: jsonb("intake"),
  beliefMap: jsonb("belief_map"),
  triangleShift: jsonb("triangle_shift"),
  sixFears: jsonb("six_fears"),
  feelingsDial: jsonb("feelings_dial"),
  hillOverlay: jsonb("hill_overlay"),
  daily10: jsonb("daily_10"),
  aiInteractions: jsonb("ai_interactions"),
});

export type User = typeof users.$inferSelect;
export type UpsertUser = typeof users.$inferInsert;
export type UserAssessment = typeof userAssessments.$inferSelect;
export type InsertUserAssessment = typeof userAssessments.$inferInsert;
