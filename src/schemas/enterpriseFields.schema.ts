import { z } from "zod";
import { Enterprises } from "../common/constants/enterprises.js";

const S = z.string().default("");
export const EnterpriseFields = z.object({
	username: S,
	password: S,
});

/**
 * 	Find a way to create this object exponentially as `Enterprises` \
 * 	grows that is type safe.
 */
export const UserEnterprisesFieldsSchema = z.object({
	[Enterprises.Aysa]: EnterpriseFields,
	[Enterprises.Edesur]: EnterpriseFields,
	[Enterprises.Telecentro]: EnterpriseFields,
});

export type IEnterpriseFields = z.TypeOf<typeof EnterpriseFields>;
export type IUserEnterprisesFields = z.TypeOf<
	typeof UserEnterprisesFieldsSchema
>;
