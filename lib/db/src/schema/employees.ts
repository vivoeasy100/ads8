import { pgTable, serial, integer, text, real, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const employeesTable = pgTable("employees", {
  id: serial("id").primaryKey(),
  companyId: integer("company_id").notNull(),
  name: text("name").notNull(),
  role: text("role").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  salary: real("salary").notNull(),
  formalContract: boolean("formal_contract").notNull().default(true),
  hiredAt: timestamp("hired_at").notNull(),
  dismissedAt: timestamp("dismissed_at"),
});

export const insertEmployeeSchema = createInsertSchema(employeesTable).omit({ id: true });
export type InsertEmployee = z.infer<typeof insertEmployeeSchema>;
export type Employee = typeof employeesTable.$inferSelect;
