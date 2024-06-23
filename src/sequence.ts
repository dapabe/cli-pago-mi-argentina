import fs from "node:fs/promises";
import {
	IEnterprises,
	EnterprisePages,
	UserJsonPath,
	StepsToLogin,
	LoginFields,
	Enterprises,
} from "./common/constants.js";
import {
	EnterpriceFields,
	IEnterpriseFields,
	IUserInfoFile,
	UserFileSchema,
} from "./schemas/user.schema.js";
import { getDefaultZodSchema } from "./common/utils.js";
import { Page } from "@playwright/test";
import { UserState } from "./common/states.js";
import { CurrentPage } from "./common/types.js";

export async function validateBaseFile(): Promise<IUserInfoFile> {
	try {
		await fs.access(UserJsonPath, fs.constants.F_OK);
		console.log("Validando información del usuario");
		const stringFile = await fs.readFile(UserJsonPath, "utf-8");
		const parsedFile = await UserFileSchema.spa(JSON.parse(stringFile));
		if (!parsedFile.success) throw Error();
		console.log(`${UserJsonPath} existe, continuando..`);
		return parsedFile.data;
	} catch (_) {
		console.log(
			`El archivo ${UserJsonPath} no se a encontrado o es invalido, recreando`
		);
		await fs.writeFile(UserJsonPath, JSON.stringify(UserFileSchema.parse({})));
		throw await validateBaseFile();
	}
}

export async function goToUserPage(
	page: Page,
	enterprise: IEnterprises
): Promise<CurrentPage> {
	console.log(`Navegando a ${enterprise}`);

	switch (enterprise) {
		case Enterprises.Aysa:
			await page.goto(EnterprisePages[enterprise]);
			for (const step of StepsToLogin[enterprise]) {
				const btn1 = page.locator(step);
				await btn1.waitFor();
				await btn1.click();
			}
			fillUpForm(page, enterprise);
			break;
		case Enterprises.Edesur:
			await page.goto(EnterprisePages[enterprise]);
			break;
		case Enterprises.Telecentro:
			await page.goto(EnterprisePages[enterprise]);
			break;
	}
	console.log(`${enterprise} abierto`);
	return {
		page,
		name: enterprise,
	};
}

async function fillUpForm(page: Page, enterprise: IEnterprises): Promise<Page> {
	const field = LoginFields[enterprise];
	const fieldData = UserState.get(enterprise)!;
	console.log(fieldData);

	switch (enterprise) {
		case Enterprises.Aysa:
			const userInput = page.locator(field.username);
			await userInput.waitFor();
			await userInput.fill(fieldData.username);
			const passInput = page.locator(LoginFields[enterprise].password);
			await passInput.waitFor();
			await passInput.fill(fieldData.password);
			const submit = page.locator(field.submit);
			await submit.waitFor();
			await submit.click();
			break;
		default:
			break;
	}
	return page;
}
