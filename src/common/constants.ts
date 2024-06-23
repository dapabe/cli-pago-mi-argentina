import { IEnterpriseFields } from "../schemas/user.schema.js";

export const UserJsonPath = "info.json";

export const Enterprises = Object.freeze({
	Aysa: "Aysa",
	Edesur: "Edesur", //WIP
	Telecentro: "Telecentro", //WIP
});
export type IEnterprises = keyof typeof Enterprises;

export const EnterprisePages: Record<IEnterprises, string> = Object.freeze({
	[Enterprises.Aysa]: "https://oficinavirtual.web.aysa.com.ar/index.html",
	[Enterprises.Edesur]: "https://ov.edesur.com.ar/login",
	[Enterprises.Telecentro]: "https://telecentro.com.ar/sucursal-virtual/login",
});

export const LoginFields = Object.freeze({
	[Enterprises.Aysa]: {
		username: "#j_username",
		password: "#j_password",
		submit: "#logOnFormSubmit",
	},
	[Enterprises.Edesur]: {
		username: "#j_username",
		password: "#j_password",
		submit: "#logOnFormSubmit",
	},
	[Enterprises.Telecentro]: {
		username: "#j_username",
		password: "#j_password",
		submit: "#logOnFormSubmit",
	},
});

export const StepsToLogin = {
	[Enterprises.Aysa]: ["#__link1", "#__button13"],
};
