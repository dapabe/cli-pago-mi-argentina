import { StepsToAnything } from "../types.js";
import { Enterprises } from "./enterprises.js";

/**
 * 	The last step MUST contain the innerHTML of the bill amount.
 */
export const StepsToLastBill: Required<StepsToAnything> = {
	[Enterprises.Aysa]: [],
	[Enterprises.Edesur]: [],
	[Enterprises.Telecentro]: [],
};
