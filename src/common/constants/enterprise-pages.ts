import { IEnterprises } from "../types.js";
import { Enterprises } from "./enterprises.js";

/**
 * 	Some pages will have to enter from another place \
 *  if this is the case then procced with `StepsToLogin` \
 * 	but in first place must be setted to `login` page.
 */
export const EnterprisePages: Record<IEnterprises, string> = {
	[Enterprises.Aysa]: "https://oficinavirtual.web.aysa.com.ar/index.html",
	[Enterprises.Edesur]: "https://ov.edesur.com.ar/login",
	[Enterprises.Telecentro]: "https://telecentro.com.ar/sucursal-virtual/login",
} as const;
