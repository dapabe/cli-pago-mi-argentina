import { select } from "@inquirer/prompts";
import { IEditAction, IPromptAction } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function chooseEditAction(userData: IUserData) {
	const noEnterprises = !userData.selectedEnterprises.length;

	return select<Exclude<IPromptAction, "back"> | IEditAction | "password">({
		message: "¿Qué quieres hacer?",
		default: "next",
		choices: [
			{
				name: "Siguiente",
				value: "next",
				description: "Ver que empresas opero.",
				disabled: noEnterprises,
			},
			{
				name: "Cambiar contraseña",
				value: "password",
			},
			{
				name: "Salir",
				value: "exit",
				description: "Termina el programa.",
			},
			defaultSeparator,
			{
				name: "Listar mis empresas",
				value: "selectedEnterprises",
				description: "Añade o elimina servicios que utilices.",
			},
			{
				name: "Mis datos",
				value: "enterpriseFields",
				description:
					"Modifica los campos de inicio de sesión de servicios que uses.",
			},
			// {
			// 	name: "Metodos de pago",
			// 	value: "paymentMethods",
			// 	description: "Modifica tus metodos de pago",
			// },
			defaultSeparator,
		],
	});
}
