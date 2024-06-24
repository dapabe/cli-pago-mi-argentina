import { z } from "zod";

export const EncryptedDataSchema = z.object({
	iv: z.string(),
	encryptedData: z.string(),
});

export type IEncryptedData = z.TypeOf<typeof EncryptedDataSchema>;
