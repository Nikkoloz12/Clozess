import { Router } from "express";
import crypto from "crypto";

import { db, brandsTable, fitAnalysesTable } from "@workspace/db";
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

// GET /admin/brands — list all brands with stats
router.get("/admin/brands", requireAdmin, async (req, res) => {
  try {
    const allBrands = await db.select().from(brandsTable).orderBy(desc(brandsTable.createdAt));
    const result = await Promise.all(allBrands.map(async (brand) => {
      const [{ total }] = await db.select({ total: count() }).from(fitAnalysesTable).where(eq(fitAnalysesTable.brandId, brand.id));
      return { ...brand, totalAnalyses: total };
    }));
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch brands" });
  }
});

// POST /admin/brands — create new brand
router.post("/admin/brands", requireAdmin, async (req, res) => {
  try {
    const { name, email, website } = req.body;
    if (!name || !email) return res.status(400).json({ error: "Name and email required" });
    const apiKey = `clz_live_${crypto.randomUUID().replace(/-/g, "")}`;
    const [brand] = await db.insert(brandsTable).values({ name, email, website: website || "", apiKey, active: true }).returning();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to create brand" });
  }
});

// PATCH /admin/brands/:id — toggle active status
router.patch("/admin/brands/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { active } = req.body;
    const [brand] = await db.update(brandsTable).set({ active }).where(eq(brandsTable.id, id)).returning();
    res.json(brand);
  } catch (err) {
    res.status(500).json({ error: "Failed to update brand" });
  }
});

// DELETE /admin/brands/:id — delete brand
router.delete("/admin/brands/:id", requireAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    await db.delete(brandsTable).where(eq(brandsTable.id, id));
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete brand" });
  }
});

export default router;
