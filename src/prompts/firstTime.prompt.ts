import { password } from "@inquirer/prompts";

export async function firstTimePrompt(): Promise<string> {
	return password({
		message:
			"Crea una contraseña con la que podras acceder a tu datos personales, recuerda guardarla bien",
	});
}
