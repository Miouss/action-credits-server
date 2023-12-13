import { DataProviderFactory } from "../data";
import { ActionName } from "../types/enums";
import { Actions, Queue } from "../types/types";
import { findActionByName } from "./actions";

export async function addActionToQueue(actionName: ActionName) {
  const queue = await DataProviderFactory().queue.get();

  queue.pending.push(actionName);

  await DataProviderFactory().queue.update(queue);
}

export function hasAnyActionInQueue(pendingQueue: Queue["pending"]) {
  return pendingQueue.length > 0;
}

export async function verifyValidAction(actionName: ActionName) {
  const actions = await DataProviderFactory().actions.get();
  const validAction = findActionByName(actions, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

export function findNextExecutableAction(
  actions: Actions,
  pendingQueue: Queue["pending"]
) {
  for (let i = 0; i < pendingQueue.length; i++) {
    const action = findActionByName(actions, pendingQueue[i]);
    if (action.credits < 1) continue;

    return {
      queueActionToExecuteIndex: i,
      executableAction: action,
    };
  }

  return null;
}
