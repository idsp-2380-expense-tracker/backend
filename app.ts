import express from "express";
import cors from "cors";
import apiRouter from "./routes/apiRouter";
import db from "./database/databaseConnection";
const port = 3000;

const app = express();

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

app.use(
  cors({
    origin: "http://localhost:5173",
    optionsSuccessStatus: 200,
  })
);

app.use("/api", apiRouter);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
