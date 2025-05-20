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
      const alreadyReset = await this._rewardService.hasResetToday(userId!);

      if (alreadyReset) return;

      const today = new Date();
      const lastLogin = await this._rewardService.getLastLogin(userId!);

      // DAILY
      const todayDate = today.toLocaleDateString("en-CA").slice(0, 10);
      const lastLoginDate = lastLogin.toLocaleDateString("en-CA").slice(0, 10);
      console.log(todayDate, lastLoginDate);

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
      const thisMonth = today.toLocaleDateString("en-CA").slice(0, 7);
      const lastMonth = lastLogin.toLocaleDateString("en-CA").slice(0, 7);
      if (thisMonth !== lastMonth) {
        await this._rewardService.resetMonthly(userId!);
      }

      await this._rewardService.dailyReset(userId!);
    } catch (error) {
      console.log("Error in resetCheck:", error);
    }
  }
  public async redeemDailyPoints(req: Request, res: Response): Promise<void> {
    const userId = req.auth.userId;
    try {
      const success = await this._rewardService.collectDailyPoints(userId!);

      if (success) {
        res.status(200).json({ success: true, message: "10 points awarded!" });
      } else {
        res.status(400).json({
          success: false,
          message: "You’ve already collected your daily reward.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  }
  public async redeemWeeklyPoints(req: Request, res: Response): Promise<void> {
    const userId = req.auth.userId;
    try {
      const success = await this._rewardService.collectWeeklyPoints(userId!);

      if (success) {
        res.status(200).json({ success: true, message: "300 points awarded!" });
      } else {
        res.status(400).json({
          success: false,
          message: "You’ve already collected your weekly reward.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  }
  public async redeemMonthlyPoints(req: Request, res: Response): Promise<void> {
    const userId = req.auth.userId;
    try {
      const success = await this._rewardService.collectMonthlyPoints(userId!);

      if (success) {
        res.status(200).json({ success: true, message: "500 points awarded!" });
      } else {
        res.status(400).json({
          success: false,
          message: "You’ve already collected your monthly reward.",
        });
      }
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "server error",
      });
    }
  }
  public async streakCheck(req: Request) {
    const userId = req.auth.userId;
    try {
      const lastLogin = await this._rewardService.getLastLogin(userId!);
      const today = new Date();

      const todayStripped = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const lastLoginStripped = new Date(
        lastLogin.getFullYear(),
        lastLogin.getMonth(),
        lastLogin.getDate()
      );
      const daysSince = Math.floor(
        (todayStripped.getTime() - lastLoginStripped.getTime()) /
          (1000 * 60 * 60 * 24)
      );
      if (daysSince === 1) {
        await this._rewardService.addCountWeeklyStreak(userId!);
        await this._rewardService.addCountMonthlyStreak(userId!);
      } else if (daysSince > 1) {
        await this._rewardService.resetWeeklyStreak(userId!);
        await this._rewardService.resetMonthlyStreak(userId!);
      }

      console.log(todayStripped, lastLoginStripped, daysSince);
    } catch (error) {}
  }
}

const rewardService = new RewardService(database);
export const rewardController = new RewardController(rewardService);
