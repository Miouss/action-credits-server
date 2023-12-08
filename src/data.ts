import jsonfile from "jsonfile";
import { Action, ActionName } from "./types";

const filePath = "./data/actions.json";
const MAX_CREDITS = 5;
const MIN_CREDITS_PERCENT = 80;

export async function getAllActionsName() {
  const actions = await getAllActions();

  return actions.map(({ name }) => name);
}

export async function addAction(action: Action) {
  await jsonfile.writeFile(filePath, action, { flag: "a" });
}

export async function removeAction() {
  const actions = await getAllActions();
  actions.shift();

  await updateActions(actions);
}

export async function consumeAction(action: ActionName) {
  const actions = await getAllActions();
  actions.find(({ name }) => name === action)!.credits--;

  await updateActions(actions);
}

export async function doesFileExist() {
  await getAllActions();
}

export function getAllActions(): Promise<Action[]> {
  return jsonfile.readFile(filePath);
}

function updateActions(actions: Action[]) {
  return jsonfile.writeFile(filePath, actions);
}

export async function setupActionsFile() {
  try {
    await doesFileExist();
  } catch (err) {
    await initActions();
  }
}

export async function initActions() {
  await updateActions(
    Object.values(ActionName).map((name) => ({
      name,
      credits: randomMinPercent(MAX_CREDITS, MIN_CREDITS_PERCENT),
    }))
  );
}

function randomMinPercent(max: number, percent: number) {
  const min = Math.ceil(max * (percent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
