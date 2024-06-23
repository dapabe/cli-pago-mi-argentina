#!/usr/bin/env node
import { editUser } from "./prompts/editUser.js";
import { validateBaseFile } from "./sequence.js";

const userData = await validateBaseFile();

await editUser(userData);

// const browser = await chromium.launch({ headless: false });
// const ctx = await browser.newContext();

// const promises = await Promise.allSettled([
// 	await goToUserPage(await ctx.newPage(), Enterprises.Aysa),
// 	await goToUserPage(await ctx.newPage(), Enterprises.Edesur),
// 	await goToUserPage(await ctx.newPage(), Enterprises.Telecentro),
// ]);

// for (const prom of promises) {
// 	if (prom.status !== "fulfilled") break;
// 	const { name, page } = prom.value;
// 	AvailableWebs.set(name, page);
// }

// await operateOn();

// console.log(pages.map(x=> x.));

// await userInput.fill("dpb");
// console.log(await userInput.inputValue());

// await browser.close();
// process.exit(1);
