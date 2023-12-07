import jsonfile from "jsonfile";
import { Action } from "./types";

const filePath = "./data/actions.json";

export async function getAllActionsName() {
  const actions = await getAllActions();

  return actions.map(({ name }) => name);
}

export async function addAction(action: Action) {
  const actions = await getAllActions();
  actions.push(action);

  await updateActions(actions);
}

export async function removeAction() {
  const actions = await getAllActions();
  actions.shift();

  await updateActions(actions);
}

export async function consumeAction() {
  const actions = await getAllActions();
  actions[0].credits -= 1;

  await updateActions(actions);
}

export function getAllActions(): Promise<Action[]> {
  return jsonfile.readFile(filePath);
}

function updateActions(actions: Action[]) {
  return jsonfile.writeFile(filePath, actions);
}
