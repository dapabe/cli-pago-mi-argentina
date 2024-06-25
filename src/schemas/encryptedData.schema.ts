import { z } from "zod";
import { PasswordByteLength } from "../common/constants.js";

export const EncryptedDataSchema = z.object({
	salt: z.string().length(PasswordByteLength),
	iv: z.string().length(PasswordByteLength),
	encryptedData: z.string(),
});

export type IEncryptedData = z.TypeOf<typeof EncryptedDataSchema>;
