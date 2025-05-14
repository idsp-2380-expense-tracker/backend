import { Pool } from "mysql2/promise";
import { DB_Tracking } from "../../shared/databaseInterface";
import { ITrackingAdd, ITrackingEdit } from "../../shared/dtos";
import { ResultSetHeader } from "mysql2/promise";
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
        SELECT id,category, paymentMethod, amount, dateOfPayment, \`repeat\`, title, note, userId
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
  public async editTransaction(data: ITrackingEdit) {
    const sqlQuery = `
    INSERT INTO tracking (id, userId, category, paymentMethod, amount, dateOfPayment, \`repeat\`)
    VALUES (?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      category = VALUES(category),
      paymentMethod = VALUES(paymentMethod),
      amount = VALUES(amount),
      dateOfPayment = VALUES(dateOfPayment),
      \`repeat\` = VALUES(\`repeat\`)
  `;

    const values = [
      data.id,
      data.userId,
      data.category,
      data.paymentMethod,
      data.amount,
      data.dateOfPayment,
      data.repeat,
    ];
    try {
      await this._database.query(sqlQuery, values);
    } catch (error) {
      console.log(error);
    }
  }
  public async addTransaction(
    data: ITrackingAdd,
    userId: string
  ): Promise<number> {
    let sqlQuery = `
    INSERT INTO tracking (category, paymentMethod, amount, dateOfPayment, \`repeat\`, userId)
    VALUES (?, ?, ?, ?, ?, ?)
    `;
    const values = [
      data.category,
      data.paymentMethod,
      data.amount,
      data.dateOfPayment,
      data.repeat,
      userId,
    ];
    try {
      const [result] = await this._database.query<ResultSetHeader>(
        sqlQuery,
        values
      );
      return result.insertId;
    } catch (error) {
      console.error("Failed to insert transaction:", error);
      throw error;
    }
  }
}
