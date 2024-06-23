import { z } from "zod";
import { Enterprises } from "../common/constants.js";
import { EnterpriseFields } from "./enterpriseFields.schema.js";

/**
 *  TODO: fix this.
 *  On .parse, this schema should populate missing fields AND create missing ones too.
 */
export const UserFileSchema = z
	.object({
		[Enterprises.Aysa]: EnterpriseFields,
		[Enterprises.Edesur]: EnterpriseFields,
		[Enterprises.Telecentro]: EnterpriseFields,
	})
	.default({});

export type IUserInfoFile = z.TypeOf<typeof UserFileSchema>;
