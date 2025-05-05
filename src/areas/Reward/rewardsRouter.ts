import { Router } from "express";
import { rewardController } from "./rewardsController";
import { requireAuth } from "@clerk/express";
const router = Router();

export default router;

router.post("/", requireAuth(), (req, res) => {
  rewardController.updateRewards(req, res);
});
