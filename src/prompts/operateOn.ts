import { select } from "@inquirer/prompts";
import { BrowserContext, Page } from "@playwright/test";
import { createSpinner } from "nanospinner";
import { Enterprises } from "../common/constants.js";
import { IEnterprises } from "../common/types.js";
import { defaultSeparator } from "../common/utils.js";
import { IUserData } from "../schemas/userData.schema.js";
import { isPageAvailable } from "../sequence.js";

export async function operateOn(
	userData: IUserData,
	ctx: BrowserContext
): Promise<Page> {
	const availableWebs = new Map<IEnterprises, Page | null>();
	const spinner = createSpinner("Chequeando disponibilidad de las paginas...", {
		color: "yellow",
	});
	spinner.start();
	try {
		const page = await ctx.newPage();
		for (const enterprise of Object.values(Enterprises)) {
			const available = await isPageAvailable(page, enterprise);
			availableWebs.set(enterprise, available);
		}
		spinner.stop();

		const filteredWebs = [...availableWebs]
			.filter(([_, item]) => item !== null)
			.map(([name, item]) => ({
				name,
				value: { name, page: item },
				description: `Ver ultima factura y pago de '${name}'`,
			}));

		const answer = await select({
			message: `Páginas disponibles [${availableWebs.size}/${
				Object.keys(Enterprises).length
			}]`,
			choices: [defaultSeparator, ...filteredWebs, defaultSeparator],
		});

		return page;
	} catch (error) {
		console.log(error);
		process.exit(1);
	} finally {
		spinner.clear();
	}
}
