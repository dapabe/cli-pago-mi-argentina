import { password } from "@inquirer/prompts";

export async function changePasswordPrompt(userPass: string, isEqual = false) {
	const answer = await password({
		message: isEqual
			? "Tu nueva contraseña es identica a la actual, elije otra."
			: "Escribe tu nueva contraseña",
	});
	if (answer === userPass) return await changePasswordPrompt(userPass, true);
	return answer;
}
