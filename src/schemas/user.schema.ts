import { z } from "zod";
import { Enterprises } from "../common/constants.js";

const S = z.string().default("");
export const EnterpriceFields = z
	.object({
		username: S,
		password: S,
	})
	.default({});

/**
 *  TODO: fix this.
 *  On .parse, this schema should populate missing fields AND create missing ones too.
 */
export const UserFileSchema = z
	.object({
		[Enterprises.Aysa]: EnterpriceFields,
		[Enterprises.Edesur]: EnterpriceFields,
	})
	.default({});

export type IUserInfoFile = z.TypeOf<typeof UserFileSchema>;
export type IEnterpriseFields = z.TypeOf<typeof EnterpriceFields>;
