import { z } from "zod";

export const MoneyCardSchema = z.object({
	// type: z.enum(["Visa","MasterCard"]),
	fullname: z.string(),
	number: z.number(),
	expireDate: z.date(),
	backNumber: z.number(),
});

export type IMoneyCard = z.TypeOf<typeof MoneyCardSchema>;
