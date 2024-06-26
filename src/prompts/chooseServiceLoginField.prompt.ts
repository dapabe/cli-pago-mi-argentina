import { select } from "@inquirer/prompts";
import { IPromptAction, IServices } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IServiceLoginFields } from "../schemas/enterpriseFields.schema.js";
import { IUserData } from "../schemas/userData.schema.js";

type R = keyof Required<Exclude<IServiceLoginFields, undefined>>;

type LocalType = Extract<IPromptAction, "exit"> | R;

export async function chooseServiceLoginFieldPrompt(
	userData: IUserData,
	service: IServices
): Promise<LocalType> {
	const translatedInput = (field: string) =>
		field === "password" ? "Contraseña" : "Usuario";

	return select<LocalType>({
		message: `Editando usuario de '${service}' - Recuerda que tus datos son encriptados.'`,
		choices: [
			{
				name: "Volver",
				value: "exit",
			},
			defaultSeparator,
			...Object.entries(userData.serviceFields[service]!).map(
				([field, value]) => ({
					name: `${translatedInput(field)} - [${
						!value.length ? "Vacio" : "*****"
					}]`,
					value: field as R,
				})
			),
			defaultSeparator,
		],
	});
}
