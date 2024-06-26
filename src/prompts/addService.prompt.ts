import { password, select } from "@inquirer/prompts";
import { SupportedServices } from "../common/constants/services.js";
import { IPromptAction, IServices } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IServiceLoginFields } from "../schemas/enterpriseFields.schema.js";
import { IUserData } from "../schemas/userData.schema.js";
import { chooseServiceLoginFieldPrompt } from "./chooseServiceLoginField.prompt.js";

export async function addServicePrompt(userData: IUserData) {
	const chosenService = await select<
		Exclude<IPromptAction, "next"> | IServices
	>({
		message: "¿Que servicio agregar?",
		default: "exit",
		choices: [
			{
				name: "Volver",
				value: "exit",
			},
			defaultSeparator,
			...Object.values(SupportedServices).map((x) => ({
				name: x,
				value: x,
			})),
			defaultSeparator,
		],
	});

	if (chosenService === "exit") return await Promise.resolve();

	userData.serviceFields[chosenService] = {
		username: "",
		password: "",
	};
	console.log(userData.serviceFields[chosenService]);
	const serviceFieldData = await chooseServiceLoginFieldPrompt(
		userData,
		chosenService
	);
	console.log(userData.serviceFields[chosenService]);

	if (serviceFieldData === "exit") return await addServicePrompt(userData);

	userData.serviceFields[chosenService]![serviceFieldData] = data;
	return await addServicePrompt(userData);
}

async function modifyFieldData(
	userData: IUserData,
	field: keyof Exclude<Required<IServiceLoginFields>, undefined>
) {
	const translated = field === "password" ? "Contraseña" : "Usuario";
	const answer = await password({
		message: `Cambiando valor de '${translated}'. - Presiona <ENTER> sin escribir nada, para rescribirlo vacio.`,
	});
}
