import { Router } from "express";
import { trackingController } from "./receiptController";
import { Request, Response } from "express";
const router = Router();

export default router;

router.post("/", async (req: Request, res: Response) => {
  await trackingController.postTracking(req, res);
});
