import crypto from "node:crypto";
import { IEncryptedData } from "../schemas/encryptedData.schema.js";
import { IUserData, UserDataSchema } from "../schemas/userData.schema.js";

export function encryptData(
	userKey: string,
	userData: IUserData
): IEncryptedData {
	const iv = crypto.randomBytes(16);
	const stringData = JSON.stringify(userData);
	const cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(userKey), iv);

	let encrypted = cipher.update(stringData, "utf-8", "hex");
	encrypted += cipher.final("hex");

	return {
		iv: iv.toString("hex"),
		encryptedData: encrypted,
	};
}

export function decryptData(userKey: string, data: IEncryptedData): IUserData {
	const iv = Buffer.from(data.iv, "hex");
	const encryptedText = data.encryptedData;

	const decipher = crypto.createDecipheriv(
		"aes-256-cbc",
		Buffer.from(userKey),
		iv
	);

	let decrypted = decipher.update(encryptedText, "hex", "utf-8");
	decrypted += decipher.final("utf-8");

	return UserDataSchema.parse(JSON.parse(decrypted));
}

export function generateHashedKey(pass: string) {
	return crypto.createHash("sha256").update(pass).digest("hex").slice(0, 32);
}
