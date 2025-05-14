import { takeCoverage } from "v8";
import database from "../../../database/databaseConnection";
import { DB_Tracking } from "../../shared/databaseInterface";
import { TrackingService } from "./receiptService";
import { Request, Response } from "express";
import {
  ITrackingAdd,
  ITrackingEdit,
  ITrackingResponse,
} from "../../shared/dtos";

export class TrackingController {
  private _trackingService: TrackingService;

  constructor(receiptService: TrackingService) {
    this._trackingService = receiptService;
  }
  public async getReceipts(req: Request): Promise<DB_Tracking[] | null> {
    try {
      const userId = req.auth?.userId;
      // there will always be a userId from Clerk
      return await this._trackingService.getTransactionData(userId!);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async deleteReceipt(deleteId: number, userId: string): Promise<void> {
    try {
      await this._trackingService.deleteTransaction(deleteId, userId);
      console.log(`Sucessfully deleted receipt ${deleteId}`);
    } catch (error) {
      console.log(error);
    }
  }
  // fix type for data
  public async editReceipt(data: ITrackingEdit): Promise<void> {
    try {
      await this._trackingService.editTransaction(data);
      console.log(`Sucessfully modified receipt ${data.id}`);
    } catch (error) {}
  }
  public async addReceipt(
    data: ITrackingAdd,
    userId: string
  ): Promise<number | undefined> {
    try {
      const id = await this._trackingService.addTransaction(data, userId);
      console.log(`Sucessfully added receipt ${id}`);
      return id;
    } catch (error) {
      console.log(error);
    }
  }
}
const trackingService = new TrackingService(database);
export const trackingController = new TrackingController(trackingService);
