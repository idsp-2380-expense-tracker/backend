import { Router } from "express";
// import authRouter from "./authRouter";

import budgetRouter from "./Budget/budgetRouter";
import receiptsRouter from "./Receipt/receiptRouter";
import rewardsRouter from "./Reward/rewardsRouter";
import userRouter from "./User/userRouter";

const router = Router();

// router.use("/auth", authRouter);
// router.use("/calender", calenderRouter);
router.use("/budget", budgetRouter);
router.use("/receipts", receiptsRouter);
router.use("/rewards", rewardsRouter);
router.use("/user", userRouter);

export default router;
