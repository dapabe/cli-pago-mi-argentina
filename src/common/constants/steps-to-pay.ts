import { StepsToAnything } from "../types.js";
import { SupportedServices } from "./services.js";

export const StepsToPay: Required<StepsToAnything> = {
	[SupportedServices.Aysa]: [],
	[SupportedServices.Edesur]: [],
	[SupportedServices.Telecentro]: ["div.hidden button[type=button]"],
};
