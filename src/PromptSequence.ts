import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import { createSpinner } from "nanospinner";
import fs from "node:fs/promises";
import { getDefaultsForSchema } from "zod-defaults";
import { EnterprisePages } from "./common/constants/enterprise-pages.js";
import { LoginFields } from "./common/constants/login-fields.js";
import { StepsToLastBill } from "./common/constants/steps-to-last-bill.js";
import { StepsToLogin } from "./common/constants/steps-to-login.js";
import { StepsToPay } from "./common/constants/steps-to-pay.js";
import { encryptData } from "./common/crypto.js";
import { UserJsonPath } from "./common/file.js";
import { IEnterprises } from "./common/types.js";
import { printChalk, retrieveFromSelectedFilledForms } from "./common/utils.js";
import { changePasswordPrompt } from "./prompts/changePassword.prompt.js";
import { checkboxEnterprises } from "./prompts/checkboxEnterprises.js";
import { chooseEditAction } from "./prompts/chooseEditAction.js";
import { decryptPrompt } from "./prompts/decrypt.prompt.js";
import { editEnterpriseFieldLoop } from "./prompts/editEnterpriseField.loop.js";
import { firstTimePrompt } from "./prompts/firstTime.prompt.js";
import { navigateOnContextPrompt } from "./prompts/navigateOnContext.prompt.js";
import { EncryptedDataSchema } from "./schemas/encryptedData.schema.js";
import { IUserData, UserDataSchema } from "./schemas/userData.schema.js";

export class PromptSequence {
	private static DATA: IUserData | null = null;
	private static PASS: string | null = null;
	private static BROWSER: Browser | null = null;
	private static CTX: BrowserContext | null = null;
	private static CURRENT_WEBS = new Map<IEnterprises, Page>();

	static async validateBaseFile(): Promise<void> {
		try {
			printChalk.warning(`Chequeando que '${UserJsonPath}' exista.`);
			const stringFile = await fs.readFile(UserJsonPath, "utf-8");

			printChalk.warning(`Validando que '${UserJsonPath}' sea correcto.`);
			const parsedFile = EncryptedDataSchema.safeParse(JSON.parse(stringFile));
			if (!parsedFile.success) {
				printChalk.error(
					`Los datos encriptados no son correctos, verifique que no los haya cambiado o tendra que borrar '${UserJsonPath}' \n`,
					JSON.stringify(parsedFile.error.flatten().fieldErrors, null, 2)
				);
				return await this.terminateProgram(1);
			}
			const { password, userData } = await decryptPrompt(parsedFile.data);
			printChalk.success("Datos validados correctamente.");

			this.PASS = password;
			this.DATA = userData;
		} catch (_) {
			printChalk.warning(
				`El archivo '${UserJsonPath}' no se a encontrado o es invalido, recreando.`
			);
			await this.recreateBaseFile();
			await this.validateBaseFile();
		}
	}

	private static async recreateBaseFile(): Promise<void> {
		try {
			const password = await firstTimePrompt();
			const encryptedData = encryptData(
				password,
				getDefaultsForSchema(UserDataSchema)
			);
			await fs.writeFile(UserJsonPath, JSON.stringify(encryptedData));
		} catch (error) {
			console.log("Error creando archivo base: ", error);
			process.exit(1);
		}
	}

	static async selectEditAction(): Promise<void> {
		try {
			const action = await chooseEditAction(this.DATA!);
			switch (action) {
				case "next":
					return await Promise.resolve();
				case "enterpriseFields":
					await editEnterpriseFieldLoop(this.DATA!);
					await this.save();
					return this.selectEditAction();
				case "selectedEnterprises":
					const checkedEnterprises = await checkboxEnterprises(this.DATA!);
					this.DATA!.selectedEnterprises = checkedEnterprises;
					await this.save();
					return await this.selectEditAction();
				// case "paymentMethods":
				// 	return await Promise.reject();
				case "password":
					const newPass = await changePasswordPrompt(this.PASS!);
					this.PASS = newPass;
					await this.save();
					return await this.selectEditAction();
				default:
					this.displayGoodbye();
					return await this.terminateProgram(0);
			}
		} catch (error) {
			printChalk.error(error);
			await this.terminateProgram(1);
		}
	}

	static async checkUserPages(): Promise<void> {
		const currentSelection = retrieveFromSelectedFilledForms(this.DATA!);
		try {
			if (!currentSelection.length)
				await Promise.reject("No has seleccionado empresas.");

			const previousLoop = currentSelection.map((x) => ({
				[x]: this.CURRENT_WEBS.has(x),
			}));
			console.log(previousLoop);
			/**
			 * 	When user navigates to selectEditAction from
			 * 	waitForUserActionOnContext this should resolve
			 * 	only when currentSelection is equal to CURRENT_WEBS
			 * 	else should navigate to the new selected webs.
			 */
			const isEqualToPreviusLoop = previousLoop.every(Boolean);
			if (isEqualToPreviusLoop || this.BROWSER) Promise.resolve();

			this.BROWSER = await chromium.launch({ headless: false });
			this.CTX = await this.BROWSER.newContext();

			for await (const selectedWeb of currentSelection) {
				const page = await this.isPageAvailable(selectedWeb);
				if (!page) break;
				await this.navigateToDashboard(page, selectedWeb);
				this.CURRENT_WEBS.set(selectedWeb, page);
			}
		} catch (error) {
			printChalk.error(error);
			await this.terminateProgram(1);
		}
	}

	private static async isPageAvailable(
		enterprise: IEnterprises
	): Promise<Page | null> {
		const spinner = createSpinner(`Navegando a ${enterprise}`, {
			color: "yellow",
		});
		try {
			const page = await this.CTX!.newPage();
			await page.goto(EnterprisePages[enterprise]);

			if (StepsToLogin[enterprise] !== undefined) {
				for await (const step of StepsToLogin[enterprise]!) {
					const element = page.locator(step);
					await element.waitFor();
					await element.click();
				}
			}
			spinner.success({ text: `${enterprise} abierto correctamente` });

			return page;
		} catch (error) {
			printChalk.error(error);
			spinner.stop({
				text: `Al parecer ${enterprise} no esta disponible`,
				color: "red",
			});

			return null;
		} finally {
			spinner.clear();
		}
	}

	private static async navigateToDashboard(
		page: Page,
		enterprise: IEnterprises
	): Promise<void> {
		const spinner = createSpinner(`Entrando a ${enterprise}..`, {
			color: "yellow",
		});
		const field = LoginFields[enterprise];
		const fieldData = this.DATA!.enterpriseFields[enterprise];

		try {
			const userInput = page.locator(field.username);
			await userInput.waitFor();
			await userInput.fill(fieldData.username);

			const passInput = page.locator(field.password);
			await passInput.waitFor();
			await passInput.fill(fieldData.password);

			const submit = page.locator(field.submit);
			await submit.waitFor();
			await submit.click();
			spinner.success({ text: `Logeado en '${enterprise}' correctamente.` });
		} catch (error) {
			spinner.error({
				text: `Ha ocurrido un error al logearse. \n ${JSON.stringify(error)}`,
				mark: ":(",
			});
			await this.terminateProgram(1);
		} finally {
			spinner.clear();
		}
	}

	static async waitForUserActionOnContext(): Promise<void> {
		try {
			const answer = await navigateOnContextPrompt(
				Object.keys(this.CURRENT_WEBS) as IEnterprises[]
			);
			switch (answer) {
				case "all":
					console.log("first");
					return this.waitForUserActionOnContext();
				case "exit":
					return await this.selectEditAction();
				default:
					const bill = await this.lookUpBill(answer);
					if (bill) printChalk.info(`Monto a pagar: ${bill}`);
					else
						printChalk.error(
							"No se ha podido encontrar el monto a pagar, \n nuestros metodos pueden estar desactualizados, \n pongase en contacto con el autor para mas información."
						);
					return await this.waitForUserActionOnContext();
			}
		} catch (error) {
			await this.terminateProgram(1);
		}
	}

	private static async lookUpBill(
		enterprise: IEnterprises
	): Promise<string | null> {
		try {
			const page = this.CURRENT_WEBS.get(enterprise)!;
			const tempArr = Object.values(StepsToLastBill[enterprise]);
			let bill = "";

			for (let i = 0; i <= tempArr.length; ++i) {
				const element = page.locator(tempArr[i]);
				await element.waitFor();
				if (i === tempArr.length) {
					bill = await element.innerHTML();
				}
				await element.click();
			}

			return bill;
		} catch (error) {
			printChalk.error(error);
			return null;
		}
	}

	private static async navigateToPayForm(enterprise: IEnterprises) {
		try {
			const page = this.CURRENT_WEBS.get(enterprise)!;
			for (const step of Object.values(StepsToPay[enterprise])) {
				const element = page.locator(step);
				await element.waitFor();
				await element.click();
			}
		} catch (error) {
			printChalk.error(error);
		}
	}

	private static async save(): Promise<void> {
		try {
			await fs.writeFile(
				UserJsonPath,
				JSON.stringify(encryptData(this.PASS!, this.DATA!)),
				"utf-8"
			);
		} catch (error) {
			printChalk.error("Error al guardar ", error);
			await this.terminateProgram(1);
		}
	}

	private static async terminateProgram(code: 0 | 1) {
		if (this.CTX) await this.CTX.close();
		if (this.BROWSER) await this.BROWSER.close();
		process.exit(code);
	}

	private static displayGoodbye() {
		printChalk.success(
			"Gracias por usar esta herramienta, considera hacer un aporte 😊"
		);
	}
}
