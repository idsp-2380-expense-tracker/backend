import { Router } from "express";
import { rewardController } from "./rewardsController";
import { requireAuth } from "@clerk/express";
const router = Router();

export default router;

router.post("/", requireAuth(), async (req, res) => {
  await rewardController.redeemDailyPoints(req, res);
});
