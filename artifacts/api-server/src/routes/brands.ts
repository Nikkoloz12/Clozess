import { Router, type IRouter } from "express";
import { db, brandsTable, fitAnalysesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

// Register a new brand and get an API key
router.post("/brands/register", async (req, res) => {
  const { name, email, website } = req.body;
  if (!name || !email || !website) {
    res.status(400).json({ error: "Name, email and website are required." });
    return;
  }
  try {
    const apiKey = `clz_live_${crypto.randomBytes(16).toString("hex")}`;
    const [brand] = await db.insert(brandsTable).values({ name, email, website, apiKey }).returning();
    res.status(201).json({ success: true, apiKey: brand.apiKey, brandId: brand.id });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "This email is already registered." });
      return;
    }
    console.error("Brand register error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Get brand stats for dashboard
router.get("/brands/stats", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) {
    res.status(401).json({ error: "API key required." });
    return;
  }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) {
      res.status(401).json({ error: "Invalid API key." });
      return;
    }
    const analyses = await db.select().from(fitAnalysesTable).where(eq(fitAnalysesTable.brandId, brand.id));
    const totalAnalyses = analyses.length;
    const avgFitScore = totalAnalyses > 0
      ? Math.round(analyses.reduce((sum, a) => sum + a.fitScore, 0) / totalAnalyses)
      : 0;
    const sizeBreakdown = analyses.reduce((acc: Record<string, number>, a) => {
      acc[a.recommendedSize] = (acc[a.recommendedSize] || 0) + 1;
      return acc;
    }, {});
    res.json({ brand: { name: brand.name, email: brand.email }, totalAnalyses, avgFitScore, sizeBreakdown });
  } catch (err) {
    console.error("Brand stats error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

// Fit analysis endpoint — used by the widget
router.post("/fit/analyze", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) {
    res.status(401).json({ error: "API key required." });
    return;
  }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) {
      res.status(401).json({ error: "Invalid API key." });
      return;
    }
    const { garmentType, gender, measurements } = req.body;
    if (!garmentType || !gender || !measurements) {
      res.status(400).json({ error: "garmentType, gender and measurements are required." });
      return;
    }

    // Size chart logic
    const primaryMeasure = measurements.chest ?? measurements.bust ?? measurements.waist ?? measurements.headCircumference ?? 0;
    const sizeCharts: Record<string, number[]> = {
      "Short Sleeve T-Shirt": [37, 40, 43, 46, 49, 52, 56, 60],
      "Long Sleeve T-Shirt": [38, 41, 44, 47, 51, 55, 59, 63],
      "Polo Shirt": [37.5, 40.5, 43.5, 46.5, 49.5, 52.5, 56.5, 60.5],
      "Tank Top": [36, 39, 42, 45, 48, 51, 55, 59],
      "Sweatshirt / Hoodie": [38, 40, 43, 46, 49, 52, 56, 60],
      "Jacket": [38, 41, 44, 47, 50, 53, 57, 61],
      "Sweater": [39, 42, 45, 48, 51, 54, 58, 62],
      "Pants": [26.5, 28.5, 30.5, 32.5, 34.5, 36.5, 38.5, 40.5],
      "Hat": [21.25, 22.0, 22.75, 23.7, 24.4, 25.25],
      "Dress": [32, 33, 34, 35, 36, 37.5, 39, 41],
    };
    const sizes = ["XS", "S", "M", "L", "XL", "2XL", "3XL", "4XL"];
    const hatSizes = ["S", "M", "L", "XL", "XXL", "XXXL"];
    const pantSizes = ["28W", "30W", "32W", "34W", "36W", "38W", "40W", "42W"];

    const chart = sizeCharts[garmentType] ?? sizeCharts["Short Sleeve T-Shirt"];
    let bestIndex = 0;
    let bestDiff = Infinity;
    chart.forEach((v, i) => {
      const diff = Math.abs(v - primaryMeasure);
      if (diff < bestDiff) { bestDiff = diff; bestIndex = i; }
    });

    const sizeList = garmentType === "Hat" ? hatSizes : garmentType === "Pants" ? pantSizes : sizes;
    const recommendedSize = sizeList[bestIndex] ?? "M";
    const fitScore = Math.max(70, 100 - Math.round(bestDiff * 3));

    await db.insert(fitAnalysesTable).values({
      brandId: brand.id,
      garmentType,
      gender,
      measurements,
      recommendedSize,
      fitScore,
    });

    res.json({ recommendedSize, fitScore, confidence: fitScore });
  } catch (err) {
    console.error("Fit analyze error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
