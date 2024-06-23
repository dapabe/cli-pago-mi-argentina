import { password, select } from "@inquirer/prompts";
import chalk from "chalk";
import fs from "node:fs/promises";
import { UserJsonPath } from "../common/constants.js";
import { IEnterprises } from "../common/types.js";
import { defaultSeparator, requiredFieldAmount } from "../common/utils.js";
import { IEnterpriseFields } from "../schemas/enterpriseFields.schema.js";
import { IUserInfoFile } from "../schemas/user.schema.js";

export async function editUser(userData: IUserInfoFile) {
	const answer1 = await select<IEnterprises | "next">({
		message: "Editar tu información de usuario en:",
		choices: [
			{
				name: "Siguiente",
				value: "next",
				description: "No editar nada y continuar.",
			},
			defaultSeparator,
			...Object.entries(userData).map(([key, fields]) => {
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
		default: "next",
	});
	if (answer1 === "next")
		return console.log(chalk.cyan("Has dejado de editar"));

	const answer2 = await select<keyof IEnterpriseFields | "back">({
		message: `Editando usuario de '${answer1}' - Presionar solo ENTER dejara vacio el campo.`,
		choices: [
			{
				name: "Volver",
				value: "back",
			},
			defaultSeparator,
			...Object.entries(userData[answer1]).map(([field, value]) => ({
				name: `${field} - [${!value.length ? "Vacio" : "*****"}]`,
				value: field as keyof IEnterpriseFields,
			})),
			defaultSeparator,
		],
	});
	if (answer2 === "back") return await editUser(userData);

	const answer3 = await password({
		message: `Editando '${answer2}' - Siempre puedes ver el ${UserJsonPath} sin censura.`,
	});
	userData[answer1][answer2] = answer3;
	await fs.writeFile(UserJsonPath, JSON.stringify(userData), "utf-8");
	console.log(chalk.green("Cambios guardados"));

	return await editUser(userData);
}
