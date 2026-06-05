import { pgTable, serial, text, integer, timestamp } from "drizzle-orm/pg-core";

export const coursesTable = pgTable("courses", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  provider: text("provider").notNull(),
  area: text("area").notNull(),
  level: text("level").notNull().default("iniciante"),
  durationHours: integer("duration_hours"),
  description: text("description").notNull().default(""),
  skills: text("skills").notNull().default("[]"),
  url: text("url"),
  isFree: text("is_free").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Course = typeof coursesTable.$inferSelect;
