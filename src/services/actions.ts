import { DataProviderFactory } from "../data";
import { ActionName } from "../types/enums";
import { Action, Actions } from "../types/types";
import { v4 as uuidv4 } from "uuid";
import { findNextExecutableAction, hasAnyActionInQueue } from "./queue";

const CREDITS = 100;
const MAX_CREDITS_PERCENT = 100;
const MIN_CREDITS_PERCENT = 80;


export function findActionByName(actions: Actions, actionName: ActionName) {
  return actions.items.find(({ name }) => name === actionName)!;
}

export async function executeAction() {
  const queue = await DataProviderFactory().queue.get();

  if (!hasAnyActionInQueue(queue.pending))
    return console.log("No action to execute");

  const actions = await DataProviderFactory().actions.get();

  const data = findNextExecutableAction(actions, queue.pending);

  if (!data) return console.log("No action eligible for execution");

  const { executableAction, queueActionToExecuteIndex } = data;

  queue.pending.splice(queueActionToExecuteIndex, 1);
  queue.executed.push(executableAction.name);

  executableAction.credits--;

  await DataProviderFactory().actions.update(actions);
  await DataProviderFactory().queue.update(queue);

  console.log(`Action '${executableAction.name}' executed`);
}


export async function resetCredits(originalActions: Actions) {
  const actions = await DataProviderFactory().actions.get();

  const needReset = hasUsedCredits(actions, originalActions);

  if (!needReset) {
    console.log("No need to reset credits")
    return;
  }

  actions.items.forEach((action) => {
    action.credits = randomizeCredits();
  });

  actions.id = randomUUID();

  await DataProviderFactory().actions.update(actions);
  console.log("Credits have been reseted");
}


export function hasUsedCredits(actions: Actions, orignalActions: Actions) {
  return JSON.stringify(orignalActions.items) !== JSON.stringify(actions.items);
}

export function verifyCredits(action: Action) {
  const hasEnoughCredits = action.credits > 0;

  if (!hasEnoughCredits) throw new Error("Not enough credits");
}

export function randomizeCredits(
  value: number = CREDITS,
  minPercent: number = MIN_CREDITS_PERCENT,
  maxPercent: number = MAX_CREDITS_PERCENT
) {
  if (value <= 0) throw new Error("Value must be greater than 0");
  if (minPercent < 0) throw new Error("Min percent must be greater or equal than 0");
  if (maxPercent <= 0) throw new Error("Max percent must be greater than 0");
  if (minPercent > 100 || maxPercent > 100) throw new Error("Percents cannot be greater than 100");
  if (minPercent > maxPercent) throw new Error("Min percent cannot be greater than max percent");
  
  const max = Math.floor(value * (maxPercent / 100));
  const min = Math.ceil(max * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function randomUUID() {
  return uuidv4();
}
