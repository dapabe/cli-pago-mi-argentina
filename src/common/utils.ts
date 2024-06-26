import { Separator } from "@inquirer/select";
import chalk from "chalk";
import { ServiceLoginFields } from "../schemas/enterpriseFields.schema.js";
import { IUserData } from "../schemas/userData.schema.js";
import { IServices } from "./types.js";

export const defaultSeparator = new Separator("-----------------");

export const requiredFieldAmount = Object.keys(
	ServiceLoginFields.unwrap().shape
).length;

export const sleep = async (ms: number = 2000) =>
	new Promise((_) => setTimeout(_, ms));

export function retrieveFromSelectedFilledForms(
	userData: IUserData
): IServices[] {
	return Object.entries(userData.serviceFields)
		.filter(([_, fields]) => Object.values(fields).every(Boolean))
		.map((x) => x[0] as IServices);
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
