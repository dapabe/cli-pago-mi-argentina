import { select } from "@inquirer/prompts";
import { IEditAction, IUserAction } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function chooseEditAction(userData: IUserData) {
	const noEnterprises = !userData.selectedEnterprises.length;

	return select<Exclude<IUserAction, "back"> | IEditAction>({
		message: "¿Qué quieres hacer?",
		default: "next",
		choices: [
			{
				name: "Siguiente",
				value: "next",
				description: "Ver mi lista de empresas.",
				disabled: noEnterprises,
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
				description: "Añade o elimina que empresa utilices.",
			},
			{
				name: "Datos de usuarios",
				value: "fields",
				description: "Modifica los campos de inicio de sesión de tus empresas.",
			},
			{
				name: "Metodos de pago",
				value: "moneyCard",
				description: "Modifica tus metodos de pago",
			},
			defaultSeparator,
		],
	});
}
