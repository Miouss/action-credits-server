import { DataProviderFactory } from "../data";
import { ActionName, ActionStatus } from "../types/enums";
import { Actions, Queue } from "../types/types";
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

export async function verifyValidAction(actionName: ActionName) {
  const actions = await DataProviderFactory().actions.get();
  const validAction = findActionByName(actions, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

export function findNextExecutableAction(actions: Actions, queue: Queue) {
  for (let i = queue.nextActionIndex; i < queue.items.length; i++) {
    if (queue.items[i].status === ActionStatus.PENDING) {
      const action = findActionByName(actions, queue.items[i].name);
      if (!action || action.credits < 1) continue;

      return {
        queueActionToExecute: queue.items[i],
        queueActionToExecuteIndex: i,
        executableAction: action,
      };
    }
  }

  return null;
}
