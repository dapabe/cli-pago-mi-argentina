import { StepsToAnything } from "../types.js";
import { SupportedServices } from "./services.js";

/**
 * 	The last step MUST contain the innerHTML of the bill amount.
 */
export const StepsToLastBill: Required<StepsToAnything> = {
	[SupportedServices.Aysa]: [],
	[SupportedServices.Edesur]: [],
	[SupportedServices.Telecentro]: [],
};
