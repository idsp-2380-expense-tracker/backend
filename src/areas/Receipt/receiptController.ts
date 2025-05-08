import database from "../../../database/databaseConnection";
import { DB_Tracking } from "../../shared/databaseInterface";
import { TrackingService } from "./receiptService";
import { Request } from "express";

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
  
}
const trackingService = new TrackingService(database);
export const trackingController = new TrackingController(trackingService);
