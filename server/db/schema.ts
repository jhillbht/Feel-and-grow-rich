import { pgTable, text, timestamp, jsonb, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  name: text("name"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const sessions = pgTable("sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  
  // Session data fields
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
export type InsertUser = typeof users.$inferInsert;
export type DbSession = typeof sessions.$inferSelect;
export type InsertDbSession = typeof sessions.$inferInsert;
