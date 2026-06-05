import { pgTable, serial, text, integer, timestamp, boolean } from "drizzle-orm/pg-core";

export const jobsTable = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull().default("clt"),
  area: text("area").notNull(),
  salaryMin: integer("salary_min"),
  salaryMax: integer("salary_max"),
  description: text("description").notNull().default(""),
  requirements: text("requirements").notNull().default("[]"),
  skills: text("skills").notNull().default("[]"),
  benefits: text("benefits").notNull().default("[]"),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type Job = typeof jobsTable.$inferSelect;
