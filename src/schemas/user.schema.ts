import { z } from "zod";
import { Enterprises } from "../common/constants.js";
import { UserEnterprisesFieldsSchema } from "./enterpriseFields.schema.js";

/**
 *  TODO: fix this.
 *  On .parse, this schema should populate missing fields AND create missing ones too.
 */
export const UserFileSchema = z
	.object({
		// @ts-ignore fix `default({})` typo
		enterprises: UserEnterprisesFieldsSchema,
		selectedEnterprises: z.nativeEnum(Enterprises).array().default([]),
		// payMethods:
	})
	.default({});

export type IUserInfoFile = z.TypeOf<typeof UserFileSchema>;
