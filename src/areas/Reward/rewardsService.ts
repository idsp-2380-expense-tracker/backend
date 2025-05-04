import { Pool } from "mysql2/promise";
import { DB_Rewards } from "../../shared/databaseInterface";

export class RewardService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getRewardData(userId: string): Promise<DB_Rewards[] | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
		SELECT *
		FROM rewards
        WHERE user_id = ?;
	`;
    try {
      const [rows] = await this._database.query<DB_Rewards[]>(sqlQuery, [
        userId,
      ]);
      return rows;
    } catch (err) {
      console.log("Error selecting from user table");
      console.log(err);
      return null;
    }
  }
}
