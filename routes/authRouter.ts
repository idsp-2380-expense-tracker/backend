import { Router } from "express";
import userRouter from "./userRouter";
import { Request, Response } from "express";
import { clerkClient, requireAuth, getAuth } from "@clerk/express";
const router = Router();

router.use("/user", userRouter);

router.get("/checkUser", (req: Request, res: Response) => {
  const userData = req.auth;
  console.log(userData);
  res.json(userData);
});

export default router;
