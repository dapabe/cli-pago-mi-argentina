import { Page } from "@playwright/test";
import chalk from "chalk";
import fs from "node:fs/promises";
import {
	EnterprisePages,
	Enterprises,
	LoginFields,
	StepsToLogin,
	UserJsonPath,
} from "./common/constants.js";
import { CurrentPage, IEnterprises } from "./common/types.js";
import { explicitReject } from "./common/utils.js";
import { IUserInfoFile, UserFileSchema } from "./schemas/user.schema.js";

export async function validateBaseFile(): Promise<IUserInfoFile> {
	try {
		await fs.access(UserJsonPath, fs.constants.F_OK);
		console.log(chalk.bgYellow("Validando información del usuario"));

		const stringFile = await fs.readFile(UserJsonPath, "utf-8");
		const parsedFile = UserFileSchema.safeParse(JSON.parse(stringFile));

		if (!parsedFile.success) throw Error();
		console.log(chalk.bgGreen(`${UserJsonPath} existe, continuando..`));
		return parsedFile.data;
	} catch (_) {
		console.log(
			chalk.bgRed(
				`El archivo ${UserJsonPath} no se a encontrado o es invalido, recreando`
			)
		);
		const defaultData = UserFileSchema.parse({});
		console.log(defaultData);
		await fs.writeFile(UserJsonPath, JSON.stringify(defaultData, null, 2));
		return validateBaseFile();
	}
}

export async function goToUserPage(
	page: Page,
	enterprise: IEnterprises
): Promise<CurrentPage> {
	console.log(chalk.bgBlue(`Navegando a ${enterprise}`));

	const cb = async () => {
		console.log(chalk.cyan(`Rellenando formulario de ${enterprise}`));
		// await fillUpForm(page, enterprise,);
		console.log(chalk.green(`Logeado correctamente en ${enterprise}`));
	};

	switch (enterprise) {
		case Enterprises.Aysa:
			await page.goto(EnterprisePages[enterprise]);
			for (const step of StepsToLogin[enterprise]) {
				const btn1 = page.locator(step);
				await btn1.waitFor();
				await btn1.click();
			}

			await cb();

			break;
		case Enterprises.Edesur:
			await page.goto(EnterprisePages[enterprise]);

			await cb();

			break;
		case Enterprises.Telecentro:
			await page.goto(EnterprisePages[enterprise]);

			// cb()

			break;
	}
	console.log(chalk.bgGreen(`${enterprise} abierto correctamente`));
	return {
		page,
		name: enterprise,
	};
}

async function fillUpForm(
	page: Page,
	enterprise: IEnterprises,
	userData: IUserInfoFile
): Promise<Page> {
	const field = LoginFields[enterprise];
	const fieldData = userData[enterprise];

	const rejectInput = (cb: () => Promise<void>) =>
		explicitReject(cb, `No se pudo encontrar el input en ${enterprise}`);

	try {
		switch (enterprise) {
			case Enterprises.Aysa:
				const userInput1 = page.locator(field.username);
				await rejectInput(() => userInput1.waitFor());
				await userInput1.fill(fieldData.username);

				const passInput1 = page.locator(LoginFields[enterprise].password);
				await rejectInput(() => passInput1.waitFor());
				await passInput1.fill(fieldData.password);

				const submit1 = page.locator(field.submit);
				await rejectInput(() => submit1.waitFor());
				await submit1.click();
				break;
			case Enterprises.Edesur:
				const userInput2 = page.locator(field.username);
				await rejectInput(() => userInput2.waitFor());
				await userInput2.fill(fieldData.username);

				const passInput2 = page.locator(LoginFields[enterprise].password);
				await rejectInput(() => {
					throw Error();
				});
				await passInput2.fill(fieldData.password);

				const submit2 = page.locator(LoginFields[enterprise].submit);
				await rejectInput(() => submit2.waitFor());
				await submit2.click();
		}

		return page;
	} catch (error) {
		throw console.log((error as Error).cause);
	}
}
