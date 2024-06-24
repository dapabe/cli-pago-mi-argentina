import { IUserData } from "../schemas/userData.schema.js";
import { chooseEnterpriseField } from "./chooseEnterpriseField.js";
import { chooseEnterpriseToEdit } from "./chooseEnterpriseToEdit.js";
import { modifyEnterpriseField } from "./modifyEnterpriseField.js";

export async function editEnterpriseFieldLoop(userData: IUserData) {
	const chosenEnterprise = await chooseEnterpriseToEdit(userData);

	if (chosenEnterprise === "exit") return await Promise.resolve();
	const enterpriseFieldData = await chooseEnterpriseField(
		userData,
		chosenEnterprise
	);

	if (enterpriseFieldData === "exit")
		return await editEnterpriseFieldLoop(userData);

	const data = await modifyEnterpriseField(
		enterpriseFieldData,
		chosenEnterprise
	);

	userData.enterprises[chosenEnterprise][enterpriseFieldData] = data;
	return await editEnterpriseFieldLoop(userData);
}
