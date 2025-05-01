import express from "express";
import cors from "cors";
import apiRouter from "./routes/apiRouter";
import db from "./database/databaseConnection";
import { getUserData } from "./database/databaseAccessLayer";
import { clerkMiddleware } from "@clerk/express";

import "dotenv/config";

const port = 3000;

const app = express();
// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);
// CLERK AUTHENTICATION
app.use(clerkMiddleware());
app.use(express.json());

async function printMySQLVersion() {
  let sqlQuery = `
          SHOW VARIABLES LIKE 'version';
      `;

  try {
    const results = await db.query(sqlQuery);
    console.log("Successfully connected to MySQL");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error getting version from MySQL");
    return false;
  }
}
printMySQLVersion();

app.use("/api", apiRouter);

app.get("/", async (req, res) => {
  const userData = await getUserData(1);
  res.json(userData);
});
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
