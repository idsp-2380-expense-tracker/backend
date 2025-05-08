import { requireAuth } from "@clerk/express";
import { Router } from "express";
const router = Router();

router.post("/", requireAuth(), (req, res) => {
  const { payload } = req.body;
  console.log(payload);
});
export default router;
