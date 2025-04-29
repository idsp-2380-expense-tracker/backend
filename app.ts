import express from "express";
import cors from "cors";
import authRouter from "./routes/authRouter";
import budgetRouter from "./routes/budgetRouter";
import calenderRouter from "./routes/calenderRouter";
import receiptsRouter from "./routes/receiptsRouter";
import rewardsRouter from "./routes/rewardsRouter";

const port = 3000;

const app = express();

app.use(
  cors({
    origin: "localhost:5173",
    optionsSuccessStatus: 200,
  })
);

app.use("/api/auth", authRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/calender", calenderRouter);
app.use("/api/receipts", receiptsRouter);
app.use("/api/rewards", rewardsRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
