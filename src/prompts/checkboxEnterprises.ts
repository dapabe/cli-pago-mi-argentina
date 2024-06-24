import { checkbox } from "@inquirer/prompts";
import { Enterprises } from "../common/constants.js";
import { IEnterprises } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IUserInfoFile } from "../schemas/user.schema.js";

export async function checkboxEnterprises(userData: IUserInfoFile) {
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
