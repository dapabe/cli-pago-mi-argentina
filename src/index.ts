#!/usr/bin/env node
import { input } from "@inquirer/prompts";
import { chromium, webkit } from "@playwright/test";
import {
	Enterprises,
	LoginFields,
	EnterprisePages,
	UserJsonPath,
	IEnterprises,
} from "./common/constants.js";
import { goToUserPage, validateBaseFile } from "./sequence.js";
import { UserState } from "./common/states.js";

const data = await validateBaseFile();

for (const [enterprise, fields] of Object.entries(data)) {
	UserState.set(enterprise as IEnterprises, fields);
}

const browser = await chromium.launch({ headless: false });

const ctx = await browser.newContext();

const promises = await Promise.allSettled([
	await goToUserPage(await ctx.newPage(), Enterprises.Aysa),
	await goToUserPage(await ctx.newPage(), Enterprises.Edesur),
	await goToUserPage(await ctx.newPage(), Enterprises.Telecentro),
]);

for (const prom of promises) {
	if (prom.status !== "fulfilled") break;
	// prom.value.
}

// console.log(pages.map(x=> x.));

// await userInput.fill("dpb");
// console.log(await userInput.inputValue());

// await browser.close();
// process.exit(1);
