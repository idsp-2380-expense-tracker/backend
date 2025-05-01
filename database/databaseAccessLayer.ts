import database from "./databaseConnection";
import { ClerkUser, MySQLUser } from "../types/User";

export async function getUserData(userId: number) {
  let sqlQuery = `
		SELECT user_id, first_name, last_name, email
		FROM user
        WHERE user_id = ?;
	`;
  try {
    const results = await database.query(sqlQuery, [userId]);
    return results[0] ?? null;
  } catch (err) {
    console.log("Error selecting from user table");
    console.log(err);
    return null;
  }
}
export async function checkUserInDb(userId: string) {
  let sqlQuery = `
    SELECT * FROM user
    WHERE user_id = ?
    `;
  try {
    const user = await database.query(sqlQuery, [userId]);
    return user[0] ?? null;
  } catch (error) {
    console.error("Error querying user:", error);
    return null;
  }
}
export async function insertUserToDb(userData: ClerkUser) {
  let sqlQuery = `
    INSERT INTO user (user_id, first_name, last_name, email)
    VALUES(?,?,?,?)`;

  let params = [
    userData.userId,
    userData.firstName,
    userData.lastName,
    userData.email,
  ];
  try {
    await database.query(sqlQuery, params);
    console.log("User inserted successfully");
  } catch (error) {
    console.error("Insert failed:", error);
  }
}
