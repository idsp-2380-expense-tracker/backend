import { Router } from "express";
import userRouter from "./userRouter";
import { Request, Response } from "express";
const router = Router();

router.use("/user", userRouter);

router.get("test", (req: Request, res: Response) => {
  res.send("hello");
});
export default router;
