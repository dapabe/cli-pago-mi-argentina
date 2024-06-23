import { Page } from "@playwright/test";
import { Enterprises } from "./constants.js";

export type IEnterprises = keyof typeof Enterprises;

export type CurrentPage = {
	page: Page;
	name: IEnterprises;
};
