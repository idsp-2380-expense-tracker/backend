import { requireAuth } from "@clerk/express";
import { Router } from "express";
import { budgetController } from "./budgetController";
const router = Router();

router.post("/", requireAuth(), async (req, res) => {
  await budgetController.updateBudget(req, res);
});
export default router;
