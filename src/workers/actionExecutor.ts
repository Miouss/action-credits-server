import { EXECUTION_INTERVAL } from "../config";
import { DataProviderFactory } from "../data";
import { findActionByName } from "../services/actions";
import { hasAnyActionInQueue } from "../services/queue";
import { ActionStatus } from "../types/enums";

export function executeActionEachInterval() {
  return setInterval(async () => {
    try {
      await executeAction();
    } catch (err: any) {
      console.log(err.message);
    }
  }, EXECUTION_INTERVAL);
}

async function executeAction() {
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
