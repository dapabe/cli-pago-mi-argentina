import { checkbox } from "@inquirer/prompts";
import { Enterprises } from "../common/constants.js";
import { IEnterprises } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function checkboxEnterprises(userData: IUserData) {
	const items = Object.values(Enterprises).map((x) => {
		return {
			name: x,
			value: x,
			checked: userData.selectedEnterprises.includes(x),
		};
	});

	return checkbox<IEnterprises>({
		message: "¿Qué empresas usas?",
		instructions:
			" (Presiona <space> para seleccionar, <a> para todo, <i> para invertir la selección o <enter> para proceder.)",
		choices: [defaultSeparator, ...items, defaultSeparator],
	});
}
