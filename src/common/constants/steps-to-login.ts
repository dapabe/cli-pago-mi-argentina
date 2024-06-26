import { StepsToAnything } from "../types.js";
import { SupportedServices } from "./services.js";

/**
 * 	For sequential steps to enter login page. \
 * 	Some pages dont need this.
 */
export const StepsToLogin: StepsToAnything = {
	[SupportedServices.Aysa]: ["#__link1", "#__button13"],
};
