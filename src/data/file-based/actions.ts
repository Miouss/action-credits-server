import { Actions } from "../../types/types";
import jsonfile from "jsonfile";
import { waitForFileAccess } from "./init";

export const ACTIONS_FILE_PATH = "./src/data/file-based/files/actions.json";

export async function getActions(): Promise<Actions> {
  const release = await waitForFileAccess(ACTIONS_FILE_PATH);

  const actions = await jsonfile.readFile(ACTIONS_FILE_PATH);

  await release();

  return actions;
}

export async function updateActions(actions: Actions): Promise<void> {
  const release = await waitForFileAccess(ACTIONS_FILE_PATH);

  await jsonfile.writeFile(ACTIONS_FILE_PATH, actions);

  await release();
}
