import { Browser, BrowserContext, Page, chromium } from "@playwright/test";
import chalk from "chalk";
import { createSpinner } from "nanospinner";
import fs from "node:fs/promises";
import { getDefaultsForSchema } from "zod-defaults";
import {
	EnterprisePages,
	LoginFields,
	StepsToLogin,
	UserJsonPath,
} from "./common/constants.js";
import { decryptData, encryptData } from "./common/crypto.js";
import { IEnterprises } from "./common/types.js";
import { checkboxEnterprises } from "./prompts/checkboxEnterprises.js";
import { chooseEditAction } from "./prompts/chooseEditAction.js";
import { decryptPrompt } from "./prompts/decrypt.prompt.js";
import { editEnterpriseFieldLoop } from "./prompts/editEnterpriseField.loop.js";
import { firstTimePrompt } from "./prompts/firstTime.prompt.js";
import { EncryptedDataSchema } from "./schemas/encryptedData.schema.js";
import { IUserData, UserDataSchema } from "./schemas/userData.schema.js";

export class PromptSequence {
	private static _DATA: IUserData;
	private static set DATA(data: IUserData) {
		this._DATA = data;
	}
	private static get DATA(): IUserData {
		return this._DATA;
	}

	private static _PASS: string;
	private static set PASS(s: string) {
		this._PASS = s;
	}
	private static get PASS(): string {
		return this._PASS;
	}

	private static _BROWSER?: Browser;
	private static set BROWSER(b: Browser) {
		this._BROWSER = b;
	}
	private static get BROWSER(): Browser {
		return this._BROWSER!;
	}

	private static _CTX?: BrowserContext;
	private static set CTX(c: BrowserContext) {
		this._CTX = c;
	}
	private static get CTX(): BrowserContext {
		return this._CTX!;
	}

	static async validateBaseFile(): Promise<void> {
		console.log(chalk.yellow(`Chequeando que '${UserJsonPath}' exista.`));
		try {
			const stringFile = await fs.readFile(UserJsonPath, "utf-8");

			console.log(
				chalk.yellow(`Validando que '${UserJsonPath}' sea correcto.`)
			);
			const parsedFile = EncryptedDataSchema.safeParse(JSON.parse(stringFile));
			if (!parsedFile.success) {
				console.log(
					chalk.red(
						`Los datos encriptados no son correctos, verifique que no los haya cambiado o tendra que borrar '${UserJsonPath}'`
					)
				);
				process.exit(1);
			}
			const password = await decryptPrompt();
			const decryptedData = decryptData(password, parsedFile.data);
			this.PASS = password;

			const parsedData = UserDataSchema.safeParse(decryptedData);
			if (!parsedData.success) {
				console.log(
					chalk.red("Las contraseñas no coinciden, reintentelo denuevo.")
				);
				return await this.validateBaseFile();
			}
			console.log(chalk.green("Datos validados correctamente."));
			this.DATA = parsedData.data;
		} catch (_) {
			console.log(
				chalk.yellow(
					`El archivo '${UserJsonPath}' no se a encontrado o es invalido, recreando.`
				)
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
			const action = await chooseEditAction(this.DATA);
			switch (action) {
				case "next":
					return await Promise.resolve();
				case "fields":
					await editEnterpriseFieldLoop(this.DATA);
					await this.save();
					return this.selectEditAction();
				case "selectedEnterprises":
					const checkedEnterprises = await checkboxEnterprises(this.DATA);
					this.DATA.selectedEnterprises = checkedEnterprises;
					await this.save();
					return await this.selectEditAction();
				case "moneyCard":
					return await Promise.reject();
				default:
					return await this.terminateProgram();
			}
		} catch (error) {
			console.log(error);
		}
	}

	static async checkUserPages(): Promise<void> {
		// const spinner = createSpinner("Chequeando")
		const currentSelection = this.DATA.selectedEnterprises.filter((x) =>
			Object.values(this.DATA.enterprises[x]).every(Boolean)
		);
		try {
			this.BROWSER = await chromium.launch({ headless: false });
			this.CTX = await this.BROWSER.newContext();
			for await (const selectedWeb of currentSelection) {
				const page = await this.isPageAvailable(selectedWeb);
				if (page) {
					await this.navigateToDashboard(page, selectedWeb);
				}
			}
		} catch (error) {}
	}

	private static async isPageAvailable(
		enterprise: IEnterprises
	): Promise<Page | null> {
		const spinner = createSpinner(`Navegando a ${enterprise}`, {
			color: "yellow",
		});
		try {
			const page = await this.CTX.newPage();
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
			console.log(error);
			spinner.stop({
				text: `Al parecer ${enterprise} no esta disponible`,
				color: "red",
			});
			spinner.clear();
			return null;
		}
	}

	private static async navigateToDashboard(
		page: Page,
		enterprise: IEnterprises
	): Promise<void> {
		const spinner = createSpinner(`Logeandose a ${enterprise}`, {
			color: "yellow",
		});
		const field = LoginFields[enterprise];
		const fieldData = this.DATA.enterprises[enterprise];

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
		} catch (error) {
			spinner.error({
				text: `Ha ocurrido un error al logearse`,
				mark: ":(",
			});
			console.log(error);
			process.exit(1);
		} finally {
			spinner.clear();
		}
	}

	private static async save(): Promise<void> {
		try {
			await fs.writeFile(
				UserJsonPath,
				JSON.stringify(encryptData(this.PASS, this.DATA)),
				"utf-8"
			);
		} catch (error) {
			console.log("Error al guardar ", error);
			process.exit(1);
		}
	}

	static async terminateProgram() {
		console.log(
			chalk.green(
				"Gracias por usar esta herramienta, considera hacer un aporte 😊"
			)
		);
		if (this.CTX) await this.CTX.close();
		process.exit(0);
	}
}
