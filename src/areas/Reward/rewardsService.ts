import { FieldPacket, Pool } from "mysql2/promise";
import { DB_LastLogin, DB_Rewards } from "../../shared/databaseInterface";
import { pointsUpdate } from "../../shared/dtos";
import { Request } from "express";
import { clerkClient } from "@clerk/express";
import { ResultSetHeader } from "mysql2/promise";
export class RewardService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getRewardData(userId: string): Promise<DB_Rewards | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
		SELECT userId, points, dailyCollected, weeklyCollected, monthlyCollected, dailyLoginCount, weeklyLoginCount, monthlyLoginCount
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

    const publicMetadata = user.publicMetadata as {
      loginStreak?: number;
      lastStreakDate?: string;
    };

    if (today === publicMetadata.lastStreakDate) {
      console.log("Already signed in today — no streak update.");
      return;
    }

    const previousStreak = publicMetadata.loginStreak ?? 0;

    const lastDate = publicMetadata.lastStreakDate ?? today;
    // compares how many days is apart from today vs lastSignIn
    const daysSince = Math.floor(
      (new Date(today).getTime() - new Date(lastDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );

    const newStreak = daysSince === 1 ? previousStreak + 1 : 1;

    await clerkClient.users.updateUserMetadata(userId, {
      publicMetadata: { loginStreak: newStreak, lastStreakDate: today },
    });
    console.log(`Updated login streak to ${newStreak} for user ${userId}`);
  }
  public async resetDaily(userId: string) {
    const today = new Date().toLocaleDateString("en-CA");

    let sqlQuery = `
    UPDATE rewards
    SET dailyCollected = 0,
        dailyLoginCount = 1,
        lastLoginDate = ?

    WHERE userId = ?;
    `;
    await this._database.query(sqlQuery, [today, userId]);
  }
  public async resetWeekly(userId: string) {
    const today = new Date().toLocaleDateString("en-CA");

    let sqlQuery = `
    UPDATE rewards
    SET weeklyCollected = 0,
        weeklyLoginCount = 1,
        lastLoginDate = ?
    WHERE userId = ?;
  `;
    await this._database.query(sqlQuery, [today, userId]);
  }
  public async resetMonthly(userId: string) {
    const today = new Date().toLocaleDateString("en-CA");

    let sqlQuery = `
    UPDATE rewards
    SET monthlyCollected = 0
        monthlyLoginCount = 1,
        lastLoginDate = ?
    WHERE userId = ?;
  `;
    await this._database.query(sqlQuery, [today, userId]);
  }
  public async collectDailyPoints(userId: string): Promise<boolean> {
    let sqlQuery = `
    UPDATE rewards
    SET points = points + 10,
        dailyCollected = 1,
        dailyLoginCount = 0
    WHERE userId = ? AND dailyCollected = 0
    `;
    const [result] = (await this._database.query(sqlQuery, [userId])) as [
      ResultSetHeader,
      FieldPacket[]
    ];
    return result.affectedRows > 0;
  }
  public async collectWeeklyPoints(userId: string): Promise<boolean> {
    let sqlQuery = `
    UPDATE rewards
    SET points = points + 300,
        weeklyCollected = 1,
        weeklyLoginCount = 0
    WHERE userId = ? AND weeklyCollected = 0
  `;
    const [result] = (await this._database.query(sqlQuery, [userId])) as [
      ResultSetHeader,
      FieldPacket[]
    ];
    return result.affectedRows > 0;
  }
  public async collectMonthlyPoints(userId: string): Promise<boolean> {
    let sqlQuery = `
    UPDATE rewards
    SET points = points + 500,
        monthlyCollected = 1,
        monthlyLoginCount = 0
    WHERE userId = ? AND monthlyCollected = 0
  `;
    const [result] = (await this._database.query(sqlQuery, [userId])) as [
      ResultSetHeader,
      FieldPacket[]
    ];
    return result.affectedRows > 0;
  }
  public async addCountWeeklyStreak(userId: string): Promise<void> {
    let sqlQuery = `
    UPDATE rewards
    SET WeeklyLoginCount = WeeklyLoginCount + 1
    WHERE userId = ?
    `;
    await this._database.query(sqlQuery, [userId]);
  }
  public async addCountMonthlyStreak(userId: string): Promise<void> {
    let sqlQuery = `
    UPDATE rewards
    SET  MonthlyLoginCount = MonthlyLoginCount + 1
    WHERE userId = ?
    `;
    await this._database.query(sqlQuery, [userId]);
  }
  public async resetWeeklyStreak(userId: string): Promise<void> {
    let sqlQuery = `
    UPDATE rewards
    SET  WeeklyLoginCount = 0
    WHERE userId = ?
    `;
    await this._database.query(sqlQuery, [userId]);
  }
  public async resetMonthlyStreak(userId: string): Promise<void> {
    let sqlQuery = `
    UPDATE rewards
    SET  MonthlyLoginCount = 0
    WHERE userId = ?
    `;
    await this._database.query(sqlQuery, [userId]);
  }
  public getWeek(date: Date): string {
    const local = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startOfYear = new Date(local.getFullYear(), 0, 1);
    const dayDiff = Math.floor((+local - +startOfYear) / 86400000);
    const week = Math.ceil((dayDiff + startOfYear.getDay() + 1) / 7);

    return `${local.getFullYear()}-W${String(week).padStart(2, "0")}`;
  }
  public async getLastLogin(userId: string): Promise<Date> {
    let sqlQuery = `
		SELECT lastLoginDate
		FROM rewards
        WHERE userId = ?;
	`;

    const [rows] = await this._database.query<DB_LastLogin[]>(sqlQuery, [
      userId,
    ]);
    return rows[0].lastLoginDate;
  }
  public async hasResetToday(userId: string): Promise<boolean> {
    const today = new Date().toLocaleDateString("en-CA");

    let sqlQuery = `
    SELECT lastResetCheck 
    FROM rewards
    WHERE userId= ?`;
    const [rows] = await this._database.query<DB_LastLogin[]>(sqlQuery, [
      userId,
    ]);

    return rows[0]?.lastResetCheck === today;
  }
  public async dailyReset(userId: string): Promise<void> {
    const today = new Date().toLocaleDateString("en-CA");
    await this._database.query(
      `UPDATE rewards SET lastResetCheck = ? WHERE userId = ?`,
      [today, userId]
    );
  }
}
