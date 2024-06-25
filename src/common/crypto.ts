import crypto from "node:crypto";
import { IEncryptedData } from "../schemas/encryptedData.schema.js";
import { IUserData, UserDataSchema } from "../schemas/userData.schema.js";
import { PasswordByteLength } from "./constants.js";

export function encryptData(
	password: string,
	userData: IUserData
): IEncryptedData {
	const salt = crypto.randomBytes(16).toString("hex");
	const derivedKey = generateDerivedKey(password, salt);

	const iv = crypto.randomBytes(16);
	const stringData = JSON.stringify(userData);
	const cipher = crypto.createCipheriv("aes-256-cbc", derivedKey, iv);

	let encrypted = cipher.update(stringData, "utf-8", "hex");
	encrypted += cipher.final("hex");

	return {
		salt,
		iv: iv.toString("hex"),
		encryptedData: encrypted,
	};
}

export function decryptData(password: string, data: IEncryptedData): IUserData {
	const derivedKey = generateDerivedKey(password, data.salt);

	const iv = Buffer.from(data.iv, "hex");
	const encryptedText = data.encryptedData;

	const decipher = crypto.createDecipheriv("aes-256-cbc", derivedKey, iv);

	let decrypted = decipher.update(encryptedText, "hex", "utf-8");
	decrypted += decipher.final("utf-8");

	return UserDataSchema.parse(JSON.parse(decrypted));
}
/**
 * 	Password-Based Key Derivation Function 2
 */
function generateDerivedKey(pass: string, salt: string): Buffer {
	const iterations = 100000; // Number of iterations

	return crypto.pbkdf2Sync(
		pass,
		salt,
		iterations,
		PasswordByteLength,
		"sha512"
	);
}
