import { password } from "@inquirer/prompts";
import { IEnterprises } from "../common/types.js";
import { IEnterpriseFields } from "../schemas/enterpriseFields.schema.js";

export async function modifyEnterpriseField(
	field: keyof IEnterpriseFields,
	enterprise: IEnterprises
) {
	const translatedInput = field === "password" ? "Contraseña" : "Usuario";

	return password({
		message: `Modificando '${translatedInput}' de '${enterprise}' - Presionar solo <ENTER> dejara vacio el campo.`,
		mask: "",
	});
}
