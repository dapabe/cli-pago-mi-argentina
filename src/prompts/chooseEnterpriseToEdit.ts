import { select } from "@inquirer/prompts";
import { IEnterprises, IUserAction } from "../common/types.js";
import { defaultSeparator, requiredFieldAmount } from "../common/utils.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function chooseEnterpriseToEdit(userData: IUserData) {
	return select<Extract<IUserAction, "exit"> | IEnterprises>({
		message: "Editar tu información de usuario en:",
		default: "exit",
		choices: [
			{
				name: "Volver",
				value: "exit",
				description:
					"No editar nada y continuar - Las paginas sin usuario no estaran disponible para navegar",
			},
			defaultSeparator,
			...Object.entries(userData.enterpriseFields).map(([key, fields]) => {
				const fieldAmount = Object.values(fields).filter(
					(x) => x.length
				).length;
				return {
					name: `${key} - [${fieldAmount}/${requiredFieldAmount}] ${
						fieldAmount !== requiredFieldAmount
							? "Rellene campos faltantes"
							: ""
					}`,
					value: key as IEnterprises,
					description: `Editar usuario de '${key}'`,
				};
			}),
			defaultSeparator,
		],
	});
}
