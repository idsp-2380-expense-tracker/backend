import { RowDataPacket } from "mysql2";

export interface DB_Tracking extends RowDataPacket {
  id: number;
  userId: number;
  category: string;
  paymentMethod: string;
  amount: number;
  dateOfPayment: string;
  repeat: boolean;
  title?: string;
  note?: string;
  createdAt: string;
  userid: string;
}

export interface DB_Budget extends RowDataPacket {
  id: number;
  userId: number;
  age: number;
  goalAmount: number;
  income: number;
  periodRange: string;
  needs: number;
  wants: number;
  save: number;
  createdAt: string;
  userid: string;
}

export interface DB_Rewards extends RowDataPacket {
  id: number;
  userId: number;
  points: number;
  createdAt: string;
  userid: string;
}

export interface DB_User extends RowDataPacket {
  tracking: DB_Tracking[];
  budget: DB_Budget[];
  rewards: DB_Rewards[];
}
