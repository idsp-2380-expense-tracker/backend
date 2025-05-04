import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import apiRouter from "./routes/apiRouter";
import database from "./database/databaseConnection";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import "dotenv/config";

import { userController } from "./src/areas/User/userController";
const port = 3000;

const app = express();
// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
    credentials: true,
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
    const results = await database.query(sqlQuery);
    console.log("Successfully connected to MySQL");
    console.log(results[0]);
    return true;
  } catch (err) {
    console.log("Error getting version from MySQL");
    return false;
  }
}
printMySQLVersion();

app.get(
  "/data",
  requireAuth(),
  async (req: Request, res: Response) =>
    await userController.getUserData(req, res)
);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
