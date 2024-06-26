import { select } from "@inquirer/prompts";
import { IEditAction, IPromptAction } from "../common/types.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function chooseEditAction(userData: IUserData) {
	const noServices = !Object.keys(userData.serviceFields).length;

	return select<Exclude<IPromptAction, "back"> | IEditAction | "password">({
		message: "¿Qué quieres hacer?",
		default: "next",
		choices: [
			{
				name: "Siguiente",
				value: "next",
				description: "Ver que si adeudo dinero de mis servicios seleccionados.",
				disabled: noServices,
			},
			{
				name: "Mis datos",
				value: "serviceFields",
				description:
					"Modifica los campos de inicio de sesión de servicios que uses.",
			},
			{
				name: "Cambiar contraseña",
				value: "password",
			},
			// {
			// 	name: "Metodos de pago",
			// 	value: "paymentMethods",
			// 	description: "Modifica tus metodos de pago",
			// },
			{
				name: "Salir",
				value: "exit",
				description: "Termina el programa.",
			},
		],
	});
}
