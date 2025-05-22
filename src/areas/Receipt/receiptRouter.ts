import { Router } from "express";
import { trackingController } from "./receiptController";
import { Request, Response } from "express";
import { requireAuth } from "@clerk/express";
import { ITrackingAdd, ITrackingEdit } from "../../shared/dtos";

const router = Router();

export default router;

router.post("/", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth.userId!;
  const body = req.body as { id: number; idForDelete?: number } & ITrackingAdd;
  const { id, idForDelete, ...data } = body;
  console.log("Request data:", data, "id:", id, "userId:", userId);
  try {
    if (id === 0) {
      const receiptId = await trackingController.addReceipt(data, userId!);
      console.log(`this is the receipt id:${receiptId}`);
      res.status(201).json({ success: true, action: "added", id: receiptId });
    } else if (id === -1) {
      await trackingController.deleteReceipt(idForDelete!, userId!);
      res.status(200).json({ success: true, action: "deleted" });
    } else {
      const updateData: ITrackingEdit = { ...data, id, userId };
      await trackingController.editReceipt(updateData);
      res.status(200).json({ success: true, action: "edited" });
    }
  } catch (error) {
    console.log(error);
  }
});
