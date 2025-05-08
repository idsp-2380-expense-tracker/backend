import { requireAuth } from "@clerk/express";
import { Router } from "express";
const router = Router();

router.post("/", requireAuth(), (req, res) => {
  console.log(req.body);
});
export default router;
