import { IUserData } from "../schemas/userData.schema.js";
import { Enterprises } from "./constants/enterprises.js";

export type IEnterprises = keyof typeof Enterprises;
export type IPromptAction = "next" | "exit";
export type IEditAction = keyof IUserData;

export type StepsToAnything = Partial<Record<IEnterprises, string[]>>;
