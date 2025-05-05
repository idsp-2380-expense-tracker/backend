import { RowDataPacket } from "mysql2";
import { IBudget, ITracking, IRewards, IUser } from "./dtos";

export interface DB_Tracking extends ITracking, RowDataPacket {}

export interface DB_Budget extends IBudget, RowDataPacket {}

export interface DB_Rewards extends IRewards, RowDataPacket {}

export interface DB_User extends IUser, RowDataPacket {}

export interface hi {}
