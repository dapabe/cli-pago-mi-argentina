import { StepsToAnything } from "../types.js";
import { Enterprises } from "./enterprises.js";

export const StepsToPay: Required<StepsToAnything> = {
	[Enterprises.Aysa]: [],
	[Enterprises.Edesur]: [],
	[Enterprises.Telecentro]: ["div.hidden button[type=button]"],
};
