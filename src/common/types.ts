import { Page } from "@playwright/test";
import { IEnterprises } from "./constants.js";

export type CurrentPage = {
	page: Page;
	name: IEnterprises;
};
