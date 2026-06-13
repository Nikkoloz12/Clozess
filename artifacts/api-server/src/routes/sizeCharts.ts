import { Router, type IRouter } from "express";
import { db, brandsTable, sizeChartsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// Get all custom size charts for a brand
router.get("/size-charts", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const charts = await db.select().from(sizeChartsTable).where(eq(sizeChartsTable.brandId, brand.id));
    res.json({ charts });
  } catch (err) {
    console.error("Get size charts error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Save or update a size chart
router.post("/size-charts", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const { garmentType, gender, sizes } = req.body;
    if (!garmentType || !gender || !sizes) {
      res.status(400).json({ error: "garmentType, gender and sizes are required." });
      return;
    }
    // Check if chart already exists for this garment+gender
    const [existing] = await db.select().from(sizeChartsTable).where(
      and(
        eq(sizeChartsTable.brandId, brand.id),
        eq(sizeChartsTable.garmentType, garmentType),
        eq(sizeChartsTable.gender, gender)
      )
    );
    if (existing) {
      // Update
      await db.update(sizeChartsTable)
        .set({ sizes, updatedAt: new Date() })
        .where(eq(sizeChartsTable.id, existing.id));
      res.json({ success: true, action: "updated" });
    } else {
      // Insert
      await db.insert(sizeChartsTable).values({ brandId: brand.id, garmentType, gender, sizes });
      res.json({ success: true, action: "created" });
    }
  } catch (err) {
    console.error("Save size chart error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Delete a size chart
router.delete("/size-charts/:id", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    await db.delete(sizeChartsTable).where(
      and(eq(sizeChartsTable.id, parseInt(req.params.id)), eq(sizeChartsTable.brandId, brand.id))
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Delete size chart error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
