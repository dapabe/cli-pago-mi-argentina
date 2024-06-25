import { password } from "@inquirer/prompts";

export async function decryptPrompt(): Promise<string> {
	return password({
		message:
			"Escribe tu contraseña para desbloquear tus datos encriptados.\n No se te volvera a pedir esto mientras uses el CLI",
	});
}
