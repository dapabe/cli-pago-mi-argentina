import { z } from "zod";
import { IEnterprises } from "./constants.js";
import { IEnterpriseFields } from "../schemas/user.schema.js";

/**
 *  Abbreviation fro querySelector
 */
export const $ = <T>(selector: string) => document.querySelector(selector) as T;

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
