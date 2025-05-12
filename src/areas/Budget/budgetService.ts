import { Pool } from "mysql2/promise";
import { DB_Budget, Full_DB_Budget } from "../../shared/databaseInterface";
import { Request } from "express";
import { BudgetDTO } from "../../shared/dtos";
export class BudgetService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getBudgetData(userId: string): Promise<DB_Budget | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
        SELECT income, periodRange, needs, wants,save,userId
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
  public async updateBudgetData(req: Request) {
    const userId = req.auth.userId;

    const parsed = BudgetDTO.safeParse(req.body);

    if (!parsed.success) {
      throw new Error("Invalid input");
    }

    const { income, needs, periodRange, save, wants } = parsed.data;

    if (needs + save + wants !== income) {
      throw new Error(`needs save wants doesn't add up to 100`);
    }
    let sqlQuery = `
    INSERT INTO budget (income, periodRange, needs, wants, save, createdAt, userId)
    VALUES (?, ?, ?, ?, ?, NOW(),?)
    ON DUPLICATE KEY UPDATE 
    income = VALUES(income),
    periodRange = VALUES(periodRange),
    needs = VALUES(needs),
    wants = VALUES(wants),
    save = VALUES(save);
    `;

    await this._database.query(sqlQuery, [
      income,
      periodRange,
      needs,
      wants,
      save,
      userId,
    ]);
  }
}
