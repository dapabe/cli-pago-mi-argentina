import { IEnterprises } from "./types.js";

export const UserJsonPath = "info.json";

/**
 * 	Current enterprises to login to.
 */
export const Enterprises = {
	Aysa: "Aysa",
	Edesur: "Edesur",
	Telecentro: "Telecentro",
} as const;

export const EnterprisePages: Record<IEnterprises, string> = {
	[Enterprises.Aysa]: "https://oficinavirtual.web.aysa.com.ar/index.html",
	[Enterprises.Edesur]: "https://ov.edesur.com.ar/login",
	[Enterprises.Telecentro]: "https://telecentro.com.ar/sucursal-virtual/login",
} as const;

export const LoginFields = {
	[Enterprises.Aysa]: {
		username: "#j_username",
		password: "#j_password",
		submit: "#logOnFormSubmit",
	},
	[Enterprises.Edesur]: {
		username: ".show-smart-phone input[type=email]",
		password: "input[type=password]",
		submit: "form button",
	},
	[Enterprises.Telecentro]: {
		username: "input[type=email]",
		password: "input[type=password]",
		submit: "button[type=submit]",
	},
} as const;

/**
 * 	For sequential steps to enter login page.
 */
export const StepsToLogin = {
	[Enterprises.Aysa]: ["#__link1", "#__button13"],
} as const;
