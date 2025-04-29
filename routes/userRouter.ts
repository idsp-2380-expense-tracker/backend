import { Router } from "express";

const router = Router();

router.get("/login", (req, res) => {
  res.send("test");
});
export default router;
