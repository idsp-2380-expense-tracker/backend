import { RowDataPacket } from "mysql2";
import {
  IBudget,
  IPartialBudget,
  IPartialRewards,
  IPartialTracking,
  IUser,
} from "./dtos";

export interface DB_Tracking extends IPartialTracking, RowDataPacket {}

export interface DB_Budget extends IPartialBudget, RowDataPacket {}
export interface Full_DB_Budget extends IBudget, RowDataPacket {}

export interface DB_Rewards extends IPartialRewards, RowDataPacket {}

export interface DB_User extends IUser, RowDataPacket {}

export interface hi {}
