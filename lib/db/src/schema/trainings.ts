import { pgTable, serial, integer, text, real, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const trainingsTable = pgTable("trainings", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  hoursTotal: real("hours_total").notNull(),
  participantsCount: integer("participants_count").notNull(),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertTrainingSchema = createInsertSchema(trainingsTable).omit({ id: true, createdAt: true });
export type InsertTraining = z.infer<typeof insertTrainingSchema>;
export type Training = typeof trainingsTable.$inferSelect;
