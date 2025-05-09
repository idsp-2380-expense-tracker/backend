import { Pool } from "mysql2/promise";
import { DB_Budget, Full_DB_Budget } from "../../shared/databaseInterface";
import { Request } from "express";
export class BudgetService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getBudgetData(userId: string): Promise<DB_Budget | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
        SELECT age, goalAmount, income, periodRange, needs, wants,save,userId
        FROM budget
        WHERE userId = ?;
    `;
    try {
      const [rows] = await this._database.query<DB_Budget[]>(sqlQuery, [
        userId,
      ]);
      return rows[0];
    } catch (err) {
      console.log("Error selecting from budget table");
      console.log(err);
      return null;
    }
  }
  public async updateBudgetData(req: Request) {}
}
