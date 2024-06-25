import { z } from "zod";
import { Enterprises } from "../common/constants/enterprises.js";
import { UserEnterprisesFieldsSchema } from "./enterpriseFields.schema.js";

/**
 *  TODO: fix this.
 *  On .parse, this schema should populate missing fields AND create missing ones too.
 */
export const UserDataSchema = z.object({
	/**
	 *	Login form fields
	 */
	enterpriseFields: UserEnterprisesFieldsSchema,
	selectedEnterprises: z.nativeEnum(Enterprises).array().default([]),
	// paymentMethods:
});

export type IUserData = z.TypeOf<typeof UserDataSchema>;
