import { Router } from "express";
import { trackingController } from "./receiptController";
import { Request, Response } from "express";
import { requireAuth } from "@clerk/express";

const router = Router();

export default router;

router.post("/", requireAuth(), async (req: Request, res: Response) => {
  const userId = req.auth.userId;
  const { id } = req.body as { id: number };
  const data = req.body;
  try {
    if (id === 0) {
      const receiptId = await trackingController.addReceipt(data, userId!);
      res.status(201).json({ success: true, action: "added", id: receiptId });
    } else if (id === -1) {
      const { idForDelete } = req.body as { idForDelete: number };
      await trackingController.deleteReceipt(idForDelete, userId!);
      res.status(200).json({ success: true, action: "deleted" });
    } else {
      await trackingController.editReceipt(data, userId!);
      res.status(200).json({ success: true, action: "edited" });
    }
  } catch (error) {}
});
