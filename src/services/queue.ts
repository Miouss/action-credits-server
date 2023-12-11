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

export async function executeAction() {
  const queue = await DataProviderFactory().queue.get();
  
  if (!hasAnyActionInQueue(queue)) return console.log("No actions to execute");
  
  const actions = await DataProviderFactory().actions.get();
  
  const queueActionToExecute = queue.items[queue.nextActionIndex];
  const actionToExecute = findActionByName(actions, queueActionToExecute.name);

  const canExecuteAction = actionToExecute.credits > 0;

  if (!canExecuteAction) throw new Error("No credits left to execute action");

  queueActionToExecute.status = ActionStatus.COMPLETED;

  queue.nextActionIndex++;

  actionToExecute.credits--;

  await DataProviderFactory().actions.update(actions);
  await DataProviderFactory().queue.update(queue);

  console.log(`Action ${actionToExecute.name} executed`);
}
