import { Pool } from "mysql2/promise";
import { DB_Rewards } from "../../shared/databaseInterface";

import { pointsUpdate } from "../../shared/dtos";
export class RewardService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getRewardData(userId: string): Promise<DB_Rewards[] | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
		SELECT points,userId
		FROM rewards
        WHERE userId = ?;
	`;

    const [rows] = await this._database.query<DB_Rewards[]>(sqlQuery, [userId]);
    return rows;
  }
  public async updateRewardData(data: pointsUpdate): Promise<void> {
    let sqlQuery = `
    UPDATE rewards 
    SET points = ?
    WHERE userId = ?;
    `;
    await this._database.query(sqlQuery, [data.points, data.id]);
    console.log("succesfully updated data");
  }
}
