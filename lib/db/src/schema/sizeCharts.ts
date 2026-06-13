import { pgTable, serial, text, timestamp, integer, jsonb } from "drizzle-orm/pg-core";

export const sizeChartsTable = pgTable("size_charts", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull(),
  garmentType: text("garment_type").notNull(),
  gender: text("gender").notNull(),
  sizes: jsonb("sizes").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type SizeChart = typeof sizeChartsTable.$inferSelect;
