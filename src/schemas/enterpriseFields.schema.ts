import { z } from "zod";

const S = z.string().default("");
export const EnterpriseFields = z
	.object({
		username: S,
		password: S,
	})
	.default({});

export type IEnterpriseFields = z.TypeOf<typeof EnterpriseFields>;
