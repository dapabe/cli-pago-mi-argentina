import { Enterprises } from "./enterprises.js";

/**
 * 	This constant has to be changed manually if for some reason \
 * 	the login form changes.
 */
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
