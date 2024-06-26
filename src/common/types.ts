import { IUserData } from "../schemas/userData.schema.js";
import { SupportedServices } from "./constants/services.js";

export type IServices = keyof typeof SupportedServices;
export type IPromptAction = "next" | "exit";
export type IEditAction = keyof IUserData;

export type StepsToAnything = Partial<Record<IServices, string[]>>;
