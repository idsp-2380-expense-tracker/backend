import database from "../../../database/databaseConnection";
import { DB_Rewards } from "../../shared/databaseInterface";
import { RewardService } from "./rewardsService";
import { Request } from "express";

export class RewardController {
  private _rewardService: RewardService;

  constructor(rewardService: RewardService) {
    this._rewardService = rewardService;
  }
  public async getRewards(req: Request): Promise<DB_Rewards[] | null> {
    try {
      const userId = req.auth?.userId;
      // there will always be a userId from Clerk
      return await this._rewardService.getRewardData(userId!);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
}

const rewardService = new RewardService(database);
export const rewardController = new RewardController(rewardService);
