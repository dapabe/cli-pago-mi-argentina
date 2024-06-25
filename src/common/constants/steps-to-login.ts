import { StepsToAnything } from "../types.js";
import { Enterprises } from "./enterprises.js";

/**
 * 	For sequential steps to enter login page. \
 * 	Some pages dont need this.
 */
export const StepsToLogin: StepsToAnything = {
	[Enterprises.Aysa]: ["#__link1", "#__button13"],
};
