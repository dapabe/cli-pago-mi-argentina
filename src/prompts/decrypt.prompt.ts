import { password } from "@inquirer/prompts";
import chalk from "chalk";
import { decryptData } from "../common/crypto.js";
import { IEncryptedData } from "../schemas/encryptedData.schema.js";
import { IUserData, UserDataSchema } from "../schemas/userData.schema.js";

export async function decryptPrompt(
	encryptedData: IEncryptedData,
	attempt = 0
): Promise<{ password: string; userData: IUserData }> {
	try {
		const answer = await password({
			message: attempt
				? "Las contraseñas no coinciden, intentalo de nuevo."
				: "Escribe tu contraseña para desbloquear tus datos encriptados.",
		});

		const decryptedData = decryptData(answer, encryptedData);
		if (!decryptedData) return await decryptPrompt(encryptedData, ++attempt);

		const parsedData = UserDataSchema.safeParse(decryptedData);
		if (!parsedData.success) {
			console.log(
				chalk.red(
					"La estructura de datos almacenada no es correcta \n",
					JSON.stringify(parsedData.error.flatten().fieldErrors)
				)
			);
			process.exit(1);
		}

		return {
			password: answer,
			userData: parsedData.data,
		};
	} catch (error) {
		console.log(error);
		process.exit(1);
	}
}
