import { EXECUTION_INTERVAL } from "../config";
import { DataProviderFactory } from "../data";
import {
  findNextExecutableAction,
  hasAnyActionInQueue,
} from "../services/queue";
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

  if (!hasAnyActionInQueue(queue)) return console.log("No action to execute");

  const actions = await DataProviderFactory().actions.get();

  const data = findNextExecutableAction(actions, queue);

  if (!data) return console.log("No action eligible for execution");

  const { executableAction, queueActionToExecute, queueActionToExecuteIndex } =
    data;

  const isNormalExecutionOrder =
    queueActionToExecuteIndex === queue.nextActionIndex;

  if (!isNormalExecutionOrder) {
    // move the executed action after the previous last executed action to keep the executed actions in order
    queue.items.splice(queueActionToExecuteIndex, 1);
    queue.items.splice(queue.nextActionIndex, 0, queueActionToExecute);
  }

  queueActionToExecute.status = ActionStatus.COMPLETED;
  executableAction.credits--;
  queue.nextActionIndex++;

  await DataProviderFactory().actions.update(actions);
  await DataProviderFactory().queue.update(queue);

  console.log(`Action '${executableAction.name}' executed`);
}
