import database from "../../../database/databaseConnection";
import { DB_Rewards } from "../../shared/databaseInterface";
import { RewardService } from "./rewardsService";
import { Request, Response } from "express";
import { pointsUpdate, pointsUpdateSchema } from "../../shared/dtos";
import { clerkClient } from "@clerk/express";
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
  public async checkAndUpdateStreak(req: Request): Promise<void> {
    try {
      await this._rewardService.updateStreak(req);
    } catch (error) {
      console.log("Failed to update streak:", error);
    }
  }
  public async resetCheck(req: Request) {
    try {
      const userId = req.auth.userId;

      const user = await clerkClient.users.getUser(userId!);
      const lastSignInAt = user.lastSignInAt;
      if (!lastSignInAt) return;

      const today = new Date();
      const lastLogin = new Date(lastSignInAt!);

      // DAILY
      const todayDate = today.toISOString().slice(0, 10);
      const lastLoginDate = lastLogin.toISOString().slice(0, 10);
      if (todayDate !== lastLoginDate) {
        await this._rewardService.resetDaily(userId!);
      }
      // WEEKLY
      const thisWeek = this._rewardService.getWeek(today);
      const lastWeek = this._rewardService.getWeek(lastLogin);
      if (thisWeek !== lastWeek) {
        await this._rewardService.resetWeekly(userId!);
      }
      // MONTHLY
      const thisMonth = today.toISOString().slice(0, 7);
      const lastMonth = lastLogin.toISOString().slice(0, 7);
      if (thisMonth !== lastMonth) {
        await this._rewardService.resetMonthly(userId!);
      }
    } catch (error) {
      console.log("Error in resetCheck:", error);
    }
  }
  public async redeemDailyPoints(req: Request, res: Response): Promise<void> {}
  public async redeemWeeklyPoints(req: Request): Promise<void> {}
  public async redeemMonthlyPoints(req: Request): Promise<void> {}
}

const rewardService = new RewardService(database);
export const rewardController = new RewardController(rewardService);
