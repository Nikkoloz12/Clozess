import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { integrationRequestsTable } from "@workspace/db";

const router: IRouter = Router();

router.post("/integration-request", async (req, res) => {
  const { name, email, company, message } = req.body;
  if (!name || !email || !company) {
    res.status(400).json({ error: "Name, email and company are required." });
    return;
  }
  try {
    await db.insert(integrationRequestsTable).values({ name, email, company, message: message || "" });
    res.status(201).json({ success: true });
  } catch (err: any) {
    console.error("Integration request error:", err);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
