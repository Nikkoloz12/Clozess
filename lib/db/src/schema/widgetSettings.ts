import { pgTable, serial, text, timestamp, integer } from "drizzle-orm/pg-core";

export const widgetSettingsTable = pgTable("widget_settings", {
  id: serial("id").primaryKey(),
  brandId: integer("brand_id").notNull().unique(),
  buttonText: text("button_text").notNull().default("Find My Fit"),
  buttonColor: text("button_color").notNull().default("#c8a951"),
  buttonTextColor: text("button_text_color").notNull().default("#ffffff"),
  poweredBy: text("powered_by").notNull().default("true"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type WidgetSettings = typeof widgetSettingsTable.$inferSelect;
