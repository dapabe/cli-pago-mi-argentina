import { z } from "zod";
import { Enterprises } from "../common/constants.js";
import { UserEnterprisesFieldsSchema } from "./enterpriseFields.schema.js";

/**
 *  TODO: fix this.
 *  On .parse, this schema should populate missing fields AND create missing ones too.
 */
export const UserDataSchema = z.object({
	// @ts-ignore fix `default({})` typo
	enterprises: UserEnterprisesFieldsSchema,
	selectedEnterprises: z.nativeEnum(Enterprises).array().default([]),
	// payMethods:
});

export type IUserData = z.TypeOf<typeof UserDataSchema>;
