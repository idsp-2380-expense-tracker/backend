import { Router } from "express";
import authRouter from "./authRouter";
import budgetRouter from "./budgetRouter";
import calenderRouter from "./calenderRouter";
import receiptsRouter from "./receiptsRouter";
import rewardsRouter from "./rewardsRouter";

const router = Router();

router.use("/auth", authRouter);
router.use("/budget", budgetRouter);
router.use("/calender", calenderRouter);
router.use("/receipts", receiptsRouter);
router.use("/arewards", rewardsRouter);

export default router;
