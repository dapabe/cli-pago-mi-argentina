import { password } from "@inquirer/prompts";
import { decryptData } from "../common/crypto.js";
import { IEncryptedData } from "../schemas/encryptedData.schema.js";

export async function decryptPrompt(
	encryptedData: IEncryptedData,
	attempt = 0
) {
	try {
		const answer = await password({
			message: attempt
				? "Las contraseñas no coinciden, intentalo de nuevo."
				: "Escribe tu contraseña para desbloquear tus datos encriptados.",
		});

		return {
			password: answer,
			decryptedData: decryptData(answer, encryptedData),
		};
	} catch (error) {
		if ((error as any).code === "ERR_OSSL_BAD_DECRYPT") {
			return decryptPrompt(encryptedData, ++attempt);
		} else {
			process.exit(1);
		}
	}
}
