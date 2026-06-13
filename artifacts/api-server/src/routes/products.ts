import { Router, type IRouter } from "express";
import { db, brandsTable, productsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router: IRouter = Router();

// Get all products for a brand
router.get("/products", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const products = await db.select().from(productsTable).where(eq(productsTable.brandId, brand.id));
    res.json({ products });
  } catch (err) {
    console.error("Get products error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Add a product
router.post("/products", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const { name, garmentType, description } = req.body;
    if (!name || !garmentType) { res.status(400).json({ error: "Name and garment type are required." }); return; }
    const [product] = await db.insert(productsTable).values({
      brandId: brand.id,
      name,
      garmentType,
      description: description || "",
    }).returning();
    res.status(201).json({ product });
  } catch (err) {
    console.error("Add product error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Delete a product
router.delete("/products/:id", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    await db.delete(productsTable).where(
      and(eq(productsTable.id, parseInt(req.params.id)), eq(productsTable.brandId, brand.id))
    );
    res.json({ success: true });
  } catch (err) {
    console.error("Delete product error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
