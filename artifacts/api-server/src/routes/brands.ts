import { Router, type IRouter } from "express";
import { db, brandsTable, fitAnalysesTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import crypto from "crypto";

const router: IRouter = Router();

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

router.get("/brands/stats", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const analyses = await db.select().from(fitAnalysesTable).where(eq(fitAnalysesTable.brandId, brand.id));
    const totalAnalyses = analyses.length;
    const avgFitScore = totalAnalyses > 0 ? Math.round(analyses.reduce((sum, a) => sum + a.fitScore, 0) / totalAnalyses) : 0;
    const sizeBreakdown = analyses.reduce((acc: Record<string, number>, a) => { acc[a.recommendedSize] = (acc[a.recommendedSize] || 0) + 1; return acc; }, {});
    res.json({ brand: { name: brand.name, email: brand.email }, totalAnalyses, avgFitScore, sizeBreakdown });
  } catch (err) {
    console.error("Brand stats error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

router.post("/fit/analyze", async (req, res) => {
  const apiKey = req.headers["x-api-key"] as string;
  if (!apiKey) { res.status(401).json({ error: "API key required." }); return; }
  try {
    const [brand] = await db.select().from(brandsTable).where(eq(brandsTable.apiKey, apiKey));
    if (!brand) { res.status(401).json({ error: "Invalid API key." }); return; }
    const { garmentType, gender, measurements } = req.body;
    if (!garmentType || !gender || !measurements) {
      res.status(400).json({ error: "garmentType, gender and measurements are required." });
      return;
    }

    const menCharts: Record<string, { values: number[]; sizes: string[] }> = {
      "Short Sleeve T-Shirt": { values: [94,101.6,109.2,116.8,124.5,132,142.2,152.4], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Long Sleeve T-Shirt": { values: [96.5,104.1,111.8,119.4,129.5,139.7,149.9,160], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Polo Shirt": { values: [95.3,102.9,110.5,118.1,125.7,133.4,143.5,153.7,163.8,174], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"] },
      "Tank Top": { values: [91.4,99.1,106.7,114.3,121.9,129.5,139.7,149.9], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Sweatshirt / Hoodie": { values: [96.5,101.6,109.2,116.8,124.5,132,142.2,152.4], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Jacket": { values: [96.5,104.1,111.8,119.4,127,134.6,144.8,155], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Sweater": { values: [99.1,106.7,114.3,121.9,129.5,137.2,147.3,157.5], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Pants": { values: [67.3,72.4,77.5,82.6,87.6,92.7,97.8,102.9,108,113,118.1,123.2], sizes: ["28W","30W","32W","34W","36W","38W","40W","42W","44W","46W","48W","50W"] },
      "Hat": { values: [54,55.9,57.8,60.1,62,64.5], sizes: ["S","M","L","XL","XXL","XXXL"] },
    };

    const womenCharts: Record<string, { values: number[]; sizes: string[] }> = {
      "Short Sleeve T-Shirt": { values: [81.3,88.9,96.5,104.1,114.3,124.5,134.6,144.8], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Long Sleeve T-Shirt": { values: [81.3,88.9,96.5,104.1,114.3,124.5,134.6,144.8], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Polo Shirt": { values: [83.8,91.4,99.1,106.7,116.8,127,137.2,147.3,157.5,167.6], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL","5XL","6XL"] },
      "Tank Top": { values: [78.7,86.4,94,101.6,111.8,121.9,132,142.2], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Sweatshirt / Hoodie": { values: [86.4,94,101.6,109.2,119.4,129.5,139.7,149.9], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Jacket": { values: [86.4,94,101.6,109.2,119.4,129.5,139.7,149.9], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Sweater": { values: [88.9,96.5,104.1,111.8,121.9,132,142.2,152.4], sizes: ["XS","S","M","L","XL","2XL","3XL","4XL"] },
      "Pants": { values: [61,63.5,66,68.6,71.1,74.9,78.7,83.8,88.9,94,99.1,104.1,109.2], sizes: ["0","2","4","6","8","10","12","14","16","18W","20W","22W","24W"] },
      "Dress": { values: [81.3,83.8,86.4,88.9,91.4,95.3,99.1,104.1,109.2,114.3], sizes: ["0","2","4","6","8","10","12","14","16","18"] },
      "Hat": { values: [54,55.9,57.8,60.1], sizes: ["S","M","L","XL"] },
    };

    const charts = gender === "women" ? womenCharts : menCharts;
    const chart = charts[garmentType] ?? charts["Short Sleeve T-Shirt"];
    const primaryMeasure = measurements.chest ?? measurements.bust ?? measurements.waist ?? measurements.headCircumference ?? 0;

    let bestIndex = 0, bestDiff = Infinity;
    chart.values.forEach((v: number, i: number) => {
      const diff = Math.abs(v - primaryMeasure);
      if (diff < bestDiff) { bestDiff = diff; bestIndex = i; }
    });

    const recommendedSize = chart.sizes[bestIndex] ?? "M";
    const fitScore = Math.max(70, 100 - Math.round(bestDiff * 1.5));

    await db.insert(fitAnalysesTable).values({ brandId: brand.id, garmentType, gender, measurements, recommendedSize, fitScore });
    res.json({ recommendedSize, fitScore, confidence: fitScore });
  } catch (err) {
    console.error("Fit analyze error:", err);
    res.status(500).json({ error: "Something went wrong." });
  }
});

export default router;
