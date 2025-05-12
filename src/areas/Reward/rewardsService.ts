import { Pool } from "mysql2/promise";
import { DB_Rewards } from "../../shared/databaseInterface";
import { pointsUpdate } from "../../shared/dtos";
import { Request } from "express";
import { clerkClient } from "@clerk/express";
export class RewardService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getRewardData(userId: string): Promise<DB_Rewards | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
		SELECT points,userId
		FROM rewards
        WHERE userId = ?;
	`;

    const [rows] = await this._database.query<DB_Rewards[]>(sqlQuery, [userId]);
    return rows[0];
  }

  public async updateRewardData(data: pointsUpdate): Promise<void> {
    let sqlQuery = `
    INSERT INTO rewards (userId, points)
    VALUES (?, ?)
    ON DUPLICATE KEY UPDATE points = VALUES(points);
    `;
    await this._database.query(sqlQuery, [data.id, data.points]);
    console.log("succesfully updated data");
  }

  public async updateStreak(req: Request): Promise<void> {
    const today = new Date().toISOString().slice(0, 10);
    const userId = req.auth?.userId!;
    const user = await clerkClient.users.getUser(userId);
    const lastSignIn = new Date(user.lastSignInAt!).toISOString().slice(0, 10);

    // compares how many days is apart from today vs lastSignIn
    const daysSinceLastLogin = Math.floor(
      (new Date(today).getTime() - new Date(lastSignIn).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    console.log(today, lastSignIn);
    const publicMetadata = user.publicMetadata as any;
    const previousStreak = publicMetadata.loginStreak ?? null;
    console.log(previousStreak);

    if (previousStreak !== null && today === lastSignIn) return;

    const newStreak = daysSinceLastLogin === 1 ? previousStreak + 1 : 1;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { loginStreak: newStreak },
    });
    console.log(`Updated login streak to ${newStreak} for user ${userId}`);
  }
  public async dailyPoints(req: Request) {}
}
