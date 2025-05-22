import express from "express";
import { Request, Response } from "express";
import cors from "cors";
import apiRouter from "./src/areas/apiRouter";
import database from "./database/databaseConnection";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import "dotenv/config";

const port = 3000;

const app = express();
// CORS
app.use(
  cors({
    origin: ["http://localhost:5173", "https://frontend-zyfs.onrender.com"],
    optionsSuccessStatus: 200,
    credentials: true,
  })
);

// CLERK AUTHENTICATION
app.use(clerkMiddleware());
app.use(express.json());

app.use("/api", apiRouter);

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

app.get("/", (req, res) => {
  res.send("NOOOoo");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
