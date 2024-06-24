import { select } from "@inquirer/prompts";
import { UserJsonPath } from "../common/constants.js";
import { IEnterprises, IUserAction } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IEnterpriseFields } from "../schemas/enterpriseFields.schema.js";
import { IUserData } from "../schemas/userData.schema.js";

export async function chooseEnterpriseField(
	userData: IUserData,
	enterprise: IEnterprises
) {
	const translatedInput = (field: string) =>
		field === "password" ? "Contraseña" : "Usuario";

	return select<keyof IEnterpriseFields | Extract<IUserAction, "exit">>({
		message: `Editando usuario de '${enterprise}' - Recuerda que tus datos estan guardados en '${UserJsonPath}'`,
		choices: [
			{
				name: "Volver",
				value: "exit",
			},
			defaultSeparator,
			...Object.entries(userData.enterprises[enterprise]).map(
				([field, value]) => ({
					name: `${translatedInput(field)} - [${
						!value.length ? "Vacio" : "*****"
					}]`,
					value: field as keyof IEnterpriseFields,
				})
			),
			defaultSeparator,
		],
	});
}
