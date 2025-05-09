import database from "../../../database/databaseConnection";
import { DB_Budget } from "../../shared/databaseInterface";
import { BudgetService } from "./budgetService";
import { Request } from "express";

export class BudgetController {
  private _budgetService: BudgetService;

  constructor(budgetService: BudgetService) {
    this._budgetService = budgetService;
  }
  public async getBudgets(req: Request): Promise<DB_Budget | null> {
    try {
      const userId = req.auth?.userId;
      // there will always be a userId from Clerk
      return await this._budgetService.getBudgetData(userId!);
    } catch (err) {
      console.log(err);
      return null;
    }
  }
  public async updateBudget(req: Request, res: Response): Promise<void> {
    try {
      await this._budgetService.updateBudgetData(req);
    } catch {}
  }
}

const budgetService = new BudgetService(database);
export const budgetController = new BudgetController(budgetService);
