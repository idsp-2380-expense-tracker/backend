import { Router } from "express";
import { requireAuth } from "@clerk/express";
import { Request, Response } from "express";
import { userController } from "./userController";
import { rewardController } from "../Reward/rewardsController";
const router = Router();

router.get(
  "/data",
  requireAuth(),
  async (req: Request, res: Response) =>
    await userController.getUserData(req, res)
);

export default router;
