import { Router } from "express";
import { db } from "@workspace/db";
import { brands, fitAnalyses } from "@workspace/db/schema";
import { desc, eq, count } from "drizzle-orm";

const router = Router();

const ADMIN_SECRET = process.env.ADMIN_SECRET || "clozes-admin-2024";

function requireAdmin(req: any, res: any, next: any) {
  const secret = req.headers["x-admin-secret"];
  if (secret !== ADMIN_SECRET) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  next();
}

// GET /api/admin/brands — list all brands with stats
router.get("/api/admin/brands", requireAdmin, async (req, res) => {
  try {
    const allBrands = await db.select().from(brands).orderBy(desc(brands.createdAt));
    const result = await Promise.all(allBrands.map(async (brand) => {
      const [{ total }] = await db.select({ total: count() }).from(fitAnalyses).where(eq(fitAnalyses.brandId, brand.id));
      return { ...brand, totalAnalyses: total };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// POST /api/admin/brands — create new brand
router.post("/api/admin/brands", requireAdmin, async (req, res) => {
  try {
    const { name, email, website } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });
    const apiKey = `clz_live_${crypto.randomUUID().replace(/-/g, "")}`;
    const [brand] = await db.insert(brands).values({ name, email, website: website || "", apiKey, active: true }).returning();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to create brand" });
  }
});

// PATCH /api/admin/brands/:id — toggle active status
router.patch("/api/admin/brands/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { active } = req.body;
    const [brand] = await db.update(brands).set({ active }).where(eq(brands.id, id)).returning();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update brand" });
  }
});

// DELETE /api/admin/brands/:id — delete brand
router.delete("/api/admin/brands/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(brands).where(eq(brands.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

export default router;
