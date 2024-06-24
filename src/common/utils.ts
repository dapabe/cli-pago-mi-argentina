import { Separator } from "@inquirer/select";

/**
 *  @link https://github.com/colinhacks/zod/discussions/1953#discussioncomment-4811588
 */
// export function getDefaultZodSchema<Schema extends z.AnyZodObject>(
// 	schema: Schema
// ): z.infer<Schema> {
// 	return Object.fromEntries(
// 		Object.entries(schema.shape).map(([key, value]) => {
// 			if (value instanceof z.ZodDefault)
// 				return [key, value._def.defaultValue()];
// 			return [key, undefined];
// 		})
// 	);
// }

export const defaultSeparator = new Separator("-----------------");

// export const requiredFieldAmount = Object.keys(
// 	getDefaultZodSchema(EnterpriseFields)
// ).length;
export const requiredFieldAmount = 2;

export const sleep = async (ms: number = 2000) =>
	new Promise((_) => setTimeout(_, ms));
