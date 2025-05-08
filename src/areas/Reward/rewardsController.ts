import database from "../../../database/databaseConnection";
import { DB_Rewards } from "../../shared/databaseInterface";
import { RewardService } from "./rewardsService";
import { Request, Response } from "express";
import { pointsUpdate, pointsUpdateSchema } from "../../shared/dtos";
import { z } from "zod";
export class RewardController {
  private _rewardService: RewardService;

  constructor(rewardService: RewardService) {
    this._rewardService = rewardService;
  }
  public async getRewards(req: Request): Promise<DB_Rewards | null> {
    try {
      const userId = req.auth?.userId;
      // there will always be a userId from Clerk
      return await this._rewardService.getRewardData(userId!);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async updateRewards(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.auth?.userId;
      const { points } = req.body;
      console.log(userId, points);

      const data: pointsUpdate = pointsUpdateSchema.parse({
        id: userId!,
        points: points,
      });

      await this._rewardService.updateRewardData(data);
      res
        .status(200)
        .json({ success: true, message: "points succesfully updated" });
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({ error: "invalid request data" });
      }
      console.log("Failed to update rewards:", error);
      res.status(500).json({ error: "server error" });
    }
  }
  public async checkAndUpdateStreak(
    req: Request,
    res: Response
  ): Promise<void> {
    try {
      await this._rewardService.updateStreak(req);
      res
        .status(200)
        .json({ success: true, message: "successfully updated streak" });
    } catch (error) {
      console.log("Failed to update streak:", error);
      res.status(500).json({ error: "server error" });
    }
  }
}

const rewardService = new RewardService(database);
export const rewardController = new RewardController(rewardService);
