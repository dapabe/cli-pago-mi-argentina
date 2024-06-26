import { select } from "@inquirer/prompts";
import { IEnterprises, IPromptAction } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";

export async function navigateOnContextPrompt(availableWebs: IEnterprises[]) {
	return select<Exclude<IPromptAction, "next"> | "all" | IEnterprises>({
		message:
			"¿Que pagaras hoy? - Luego de cada acción se mostrara el monto pagado.",
		choices: [
			{
				name: "Volver",
				value: "exit",
				description: "Vuelve al menú anterior",
			},
			{
				name: "Todo - Pagar todo",
				value: "all",
				description:
					"Paga todas los impuestos y facturas pendientes con los respectivos metodos de pago",
			},
			defaultSeparator,
			...availableWebs.map((x) => ({
				name: x,
				value: x,
				description: `Ver servicio a pagar de '${x}'`,
			})),
			defaultSeparator,
		],
	});
}
