import { Router } from "express";
import { rewardController } from "./rewardsController";
import { requireAuth } from "@clerk/express";
const router = Router();

export default router;

router.post("/", requireAuth(), async (req, res) => {
  const { type } = req.body;
  switch (type) {
    case "daily":
      await rewardController.redeemDailyPoints(req, res);
    case "weekly":
      await rewardController.redeemWeeklyPoints(req, res);
    case "monthly":
      await rewardController.redeemMonthlyPoints(req, res);
    default:
      res.status(400).json({
        success: false,
        message: "Invalid reward type.",
      });
  }
});
