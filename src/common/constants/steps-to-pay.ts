import { StepsToAnything } from "../types.js";
import { EnterprisePages } from "./enterprise-pages.js";

export const StepsToPay: StepsToAnything = {
	[EnterprisePages.Telecentro]: ["div.hidden button[type=button]"],
};
