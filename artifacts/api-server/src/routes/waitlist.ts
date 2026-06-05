import { Router, type IRouter } from "express";
import { db, waitlistTable, insertWaitlistSchema } from "@workspace/db";

const router: IRouter = Router();

router.post("/waitlist", async (req, res) => {
  const result = insertWaitlistSchema.safeParse(req.body);

  if (!result.success) {
    res.status(400).json({ error: "Invalid data", details: result.error.issues });
    return;
  }

  try {
    const [entry] = await db
      .insert(waitlistTable)
      .values(result.data)
      .returning({ id: waitlistTable.id, email: waitlistTable.email });

    res.status(201).json({ success: true, entry });
  } catch (err: any) {
    if (err.code === "23505") {
      res.status(409).json({ error: "This email is already on the waitlist." });
      return;
    }
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
});

export default router;
