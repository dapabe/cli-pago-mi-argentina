import { IUserData } from "../schemas/userData.schema.js";
import { Enterprises } from "./constants.js";

export type IEnterprises = keyof typeof Enterprises;
export type IUserAction = "next" | "exit";
export type IEditAction = keyof IUserData;
