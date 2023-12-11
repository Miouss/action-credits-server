import { DataProviderFactory } from "../data";
import { ActionName, ActionStatus } from "../types/enums";
import { Queue } from "../types/types";
import { findActionByName } from "./actions";

export async function addActionToQueue(actionName: ActionName) {
  const queue = await DataProviderFactory().queue.get();

  queue.items.push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await DataProviderFactory().queue.update(queue);
}

export function hasAnyActionInQueue(queue: Queue) {
  const { nextActionIndex } = queue;

  if (queue.items[nextActionIndex]) return true;
  return false;
}

export async function findValidAction(actionName: ActionName) {
  const actions = await DataProviderFactory().actions.get();
  const validAction = findActionByName(actions, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

