import { Separator } from "@inquirer/select";
import chalk from "chalk";
import { EnterpriseFields } from "../schemas/enterpriseFields.schema.js";
import { IUserData } from "../schemas/userData.schema.js";

export const defaultSeparator = new Separator("-----------------");

export const requiredFieldAmount = Object.keys(EnterpriseFields.shape).length;

export const sleep = async (ms: number = 2000) =>
	new Promise((_) => setTimeout(_, ms));

export function retrieveFromSelectedFilledForms(userData: IUserData) {
	return userData.selectedEnterprises.filter((x) =>
		Object.values(userData.enterpriseFields[x]).every(Boolean)
	);
}

export const printChalk = {
	success: (first: unknown, ...rest: unknown[]) =>
		console.log(chalk.green(first), ...rest),
	warning: (first: unknown, ...rest: unknown[]) =>
		console.log(chalk.yellow(first), ...rest),
	error: (first: unknown, ...rest: unknown[]) =>
		console.log(chalk.red(first), ...rest),
	info: (first: unknown, ...rest: unknown[]) =>
		console.log(chalk.blue(first, ...rest)),
};
