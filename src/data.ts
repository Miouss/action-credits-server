import jsonfile from "jsonfile";
import { Action, ActionName } from "./types";
import {
  FILE_PATH,
  MAX_CREDITS,
  MAX_CREDITS_PERCENT,
  MIN_CREDITS_PERCENT,
} from "./config";

export async function getAllActionsName() {
  const actions = await getAllActions();

  return actions.map(({ name }) => name);
}

export async function addAction(action: Action) {
  await jsonfile.writeFile(FILE_PATH, action, { flag: "a" });
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

export async function getAllActions(): Promise<Action[]> {
  return await jsonfile.readFile(FILE_PATH);
}

async function updateActions(actions: Action[]) {
  return await jsonfile.writeFile(FILE_PATH, actions);
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
      credits: randomMinPercent(
        MAX_CREDITS,
        MAX_CREDITS_PERCENT,
        MIN_CREDITS_PERCENT
      ),
    }))
  );
}

function randomMinPercent(max: number, maxPercent: number, minPercent: number) {
  const min = Math.ceil(max * (maxPercent / 100) * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
