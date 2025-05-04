import { Router } from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";

const router = Router();

router.get("/data", requireAuth(), async (req, res) => {});

export default router;
