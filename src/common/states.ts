import { IEnterpriseFields } from "../schemas/user.schema.js";
import { IEnterprises } from "./constants.js";

export const UserState = new Map<IEnterprises, IEnterpriseFields>();
export const CardState = new Map();
// export const CurrentPages =
