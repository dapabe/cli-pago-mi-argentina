import { Separator } from "@inquirer/select";
import { z } from "zod";
import { EnterpriseFields } from "../schemas/enterpriseFields.schema.js";

/**
 *  @link https://github.com/colinhacks/zod/discussions/1953#discussioncomment-4811588
 */
export function getDefaultZodSchema<Schema extends z.AnyZodObject>(
	schema: Schema
): z.infer<Schema> {
	return Object.fromEntries(
		Object.entries(schema.shape).map(([key, value]) => {
			if (value instanceof z.ZodDefault)
				return [key, value._def.defaultValue()];
			return [key, undefined];
		})
	);
}

/**
 * 	Explicity handles throws inside of other apis
 */
export async function explicitReject(cb: () => Promise<void>, reason: string) {
	try {
		await cb();
	} catch (_) {
		Promise.reject(reason);
	}
}

export const defaultSeparator = new Separator("-----------------");

export const requiredFieldAmount = Object.keys(
	getDefaultZodSchema(EnterpriseFields)
).length;
