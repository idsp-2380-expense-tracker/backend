import database from "./databaseConnection";

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
