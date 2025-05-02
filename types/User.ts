import { RowDataPacket } from "mysql2";
export interface ClerkUser {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface MySQLUser extends RowDataPacket {
  user_id: string;
  first_name: string;
  last_name: string;
  email: string;
}
