import { EXECUTION_INTERVAL } from "../config";
import { DataProviderFactory } from "../data";
import {
  findNextExecutableAction,
  hasAnyActionInQueue,
} from "../services/queue";

export function executeActionEachInterval() {
  return setInterval(async () => {
    try {
      await executeAction();
    } catch (err: any) {
      console.log(err.message);
    }
  }, EXECUTION_INTERVAL);
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
