import jsonfile from "jsonfile";
import { UserActions } from "../../types/types";

const USER_ACTIONS_FILE_PATH = "./src/data/file-based/user-actions.json";

export function createUserActionsFile(userActions: UserActions) {
  return jsonfile.writeFile(USER_ACTIONS_FILE_PATH, userActions);
}

export async function updateUserActions(userActions: UserActions) {
  return await jsonfile.writeFile(USER_ACTIONS_FILE_PATH, userActions);
}

export async function getUserActions(): Promise<UserActions> {
  return await jsonfile.readFile(USER_ACTIONS_FILE_PATH);
}
