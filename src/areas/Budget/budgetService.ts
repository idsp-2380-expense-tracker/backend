import { Pool } from "mysql2/promise";

import { DB_Budget } from "../../shared/databaseInterface";
import { BudgetDTO } from "../../shared/dtos";
export class BudgetService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getBudgetData(userId: string): Promise<DB_Budget[] | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
        SELECT *
        FROM budget
        WHERE userId = ?;
    `;
    try {
      const [rows] = await this._database.query<DB_Budget[]>(sqlQuery, [
        userId,
      ]);
      rows.forEach((row) => BudgetDTO.parse(row));
      return rows;
    } catch (err) {
      console.log("Error selecting from budget table");
      console.log(err);
      return null;
    }
  }
}
