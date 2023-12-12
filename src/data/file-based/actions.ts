import { Actions } from "../../types/types";
import jsonfile from "jsonfile";

export const ACTIONS_FILE_PATH = "./src/data/file-based/files/actions.json";

export async function getActions(): Promise<Actions> {
  return await jsonfile.readFile(ACTIONS_FILE_PATH);
}

export async function updateActions(actions: Actions): Promise<void> {
  return await jsonfile.writeFile(ACTIONS_FILE_PATH, actions);
}
