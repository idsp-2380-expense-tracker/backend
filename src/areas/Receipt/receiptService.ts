import { Pool } from "mysql2/promise";
import { DB_Tracking } from "../../shared/databaseInterface";

export class TrackingService {
  private _database: Pool;

  constructor(dbConnection: Pool) {
    this._database = dbConnection;
  }
  public async getTransactionData(
    userId: string
  ): Promise<DB_Tracking[] | null> {
    // throw new Error("Test");
    // put in database logic
    let sqlQuery = `
        SELECT category, paymentMethod, amount, dateOfPayment, \`repeat\`, title, note, userId
        FROM tracking
        WHERE userId = ?;
    `;
    try {
      const [rows] = await this._database.query<DB_Tracking[]>(sqlQuery, [
        userId,
      ]);
      return rows;
    } catch (err) {
      console.log("Error selecting from tracking table");
      console.log(err);
      return null;
    }
  }
  public async deleteTransaction(id: number, userId: string): Promise<void> {
    let sqlQuery = `
    DELETE FROM tracking WHERE id = ? AND userId =?
    `;
    try {
      await this._database.query(sqlQuery, [id, userId]);
      console.log(`Successfully deleted tracking id = ${id}`);
    } catch (error) {
      console.log(error);
    }
  }
  public async editTransaction(data: any, userId: string) {}
  public async addTransaction(data: any, userId: string): Promise<number> {
    return 1;
  }
}
