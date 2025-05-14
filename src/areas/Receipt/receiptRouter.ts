import { Router } from "express";
import { trackingController } from "./receiptController";
import { Request, Response } from "express";
import { requireAuth } from "@clerk/express";
import { ITrackingAdd } from "../../shared/dtos";

const router = Router();

export default router;

router.post("/", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth.userId!;
  const body = req.body as { id: number; idForDelete: number } & ITrackingAdd;
  const { id, idForDelete, ...data } = body;

  console.log("Request data:", data, "id:", id, "userId:", userId);

  try {
    switch (id) {
      case 0: {
        const receiptId = await trackingController.addReceipt(data, userId);
        res.status(201).json({ success: true, action: "added", id: receiptId });
      }
      case -1: {
        await trackingController.deleteReceipt(idForDelete, userId);
        res.status(200).json({ success: true, action: "deleted" });
      }
      default: {
        await trackingController.editReceipt({ id, ...data }, userId);
        res.status(200).json({ success: true, action: "edited" });
      }
    }
  } catch (error) {
    console.error("Tracking operation failed:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});
