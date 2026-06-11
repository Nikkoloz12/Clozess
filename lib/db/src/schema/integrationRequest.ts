import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const integrationRequestsTable = pgTable("integration_requests", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  company: text("company").notNull(),
  message: text("message").notNull().default(""),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
