import { Actions } from "../../types/types";
import jsonfile from "jsonfile";

export const ACTIONS_FILE_PATH = "./src/data/file-based/files/actions.json";

export function getActions(): Promise<Actions> {
  return jsonfile.readFile(ACTIONS_FILE_PATH);
}

export function updateActions(actions: Actions): Promise<void> {
  return jsonfile.writeFile(ACTIONS_FILE_PATH, actions);
}
