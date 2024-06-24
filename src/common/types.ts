import { Page } from "@playwright/test";
import { Enterprises } from "./constants.js";

export type IEnterprises = keyof typeof Enterprises;
export type IUserAction = "next" | "exit";
export type IEditAction = "selectedEnterprises" | "fields" | "moneyCard";

export type CurrentPage = {
	page: Page;
	name: IEnterprises;
};
