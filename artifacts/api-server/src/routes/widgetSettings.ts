import { Router, type IRouter } from "express";
import { db, brandsTable, widgetSettingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";

const router: IRouter = Router();

router.get("/widget-settings", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const [settings] = await db.select().from(widgetSettingsTable).where(eq(widgetSettingsTable.brandId, brand.id));
    res.json({ settings: settings || { buttonText: "Find My Fit", buttonColor: "#c8a951", buttonTextColor: "#ffffff", poweredBy: "true" } });
  } catch (err) {
    console.error("Get widget settings error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/widget-settings", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const { buttonText, buttonColor, buttonTextColor, poweredBy } = req.body;
    const [existing] = await db.select().from(widgetSettingsTable).where(eq(widgetSettingsTable.brandId, brand.id));
    if (existing) {
      await db.update(widgetSettingsTable).set({ buttonText, buttonColor, buttonTextColor, poweredBy, updatedAt: new Date() }).where(eq(widgetSettingsTable.id, existing.id));
    } else {
      await db.insert(widgetSettingsTable).values({ brandId: brand.id, buttonText, buttonColor, buttonTextColor, poweredBy });
    }
    res.json({ success: true });
  } catch (err) {
    console.error("Save widget settings error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
