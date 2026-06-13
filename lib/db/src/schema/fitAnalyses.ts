import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const fitAnalysesTable = pgTable("fit_analyses", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  garmentType: text("garment_type").notNull(),
  gender: text("gender").notNull(),
  measurements: jsonb("measurements").notNull(),
  recommendedSize: text("recommended_size").notNull(),
  fitScore: integer("fit_score").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type FitAnalysis = typeof fitAnalysesTable.$inferSelect;
