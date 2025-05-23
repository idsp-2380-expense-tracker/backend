import { Request, Response } from "express";
import { BudgetController } from "../Budget/budgetController";
import { TrackingController } from "../Receipt/receiptController";
import { RewardController } from "../Reward/rewardsController";

// Instance of class
import { budgetController } from "../Budget/budgetController";
import { trackingController } from "../Receipt/receiptController";
import { rewardController } from "../Reward/rewardsController";

class UserController {
  constructor(
    private _budgetController: BudgetController,
    private _rewardController: RewardController,
    private _trackingController: TrackingController
  ) {}

  public async getUserData(req: Request, res: Response) {
    await this._rewardController.checkAndUpdateStreak(req);
    await this._rewardController.streakCheck(req);
    await this._rewardController.resetCheck(req);

    const [budget, rewards, tracking] = await Promise.all([
      this._budgetController.getBudgets(req),
      this._rewardController.getRewards(req),
      this._trackingController.getReceipts(req),
    ]);

    res.status(200).json({
      budget,
      rewards,
      tracking,
    });
  }
}

export const userController = new UserController(
  budgetController,
  rewardController,
  trackingController
);
