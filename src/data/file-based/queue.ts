import { Queue, QueueFiltered } from "../../types/types";
import jsonfile from "jsonfile";

const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  return await jsonfile.readFile(QUEUE_FILE_PATH);
}

export async function getQueueFiltered(
  maxPendingActions: number,
  maxExecutedActions: number
): Promise<QueueFiltered> {
  const queue: Queue = await jsonfile.readFile(QUEUE_FILE_PATH);
  const { nextActionIndex } = queue;

  const pendingActions = queue.items.slice(
    nextActionIndex,
    Math.min(nextActionIndex + maxPendingActions, queue.items.length)
  );

  let executedActions = queue.items.slice(
    Math.max(0, nextActionIndex - maxExecutedActions),
    nextActionIndex
  );

  let nbActionsDone = nextActionIndex - executedActions.length;

  const nbActionsLeft =
    queue.items.length - pendingActions.length - nextActionIndex;

  // This part rework the filter to display the minimum number of the total actions required to display in the UI
  // by adding more executed actions if the number of pending actions is too low
  const minActionsDisplayed = maxPendingActions + maxExecutedActions;
  const nbActionPending = pendingActions.length;

  if (nbActionPending < minActionsDisplayed) {
    const startIndex = Math.max(
      0,
      nextActionIndex -
        maxExecutedActions -
        (minActionsDisplayed - nbActionPending) +
        1
    );

    nbActionsDone -= minActionsDisplayed - nbActionPending - 1;
    executedActions = [
      ...queue.items.slice(
        startIndex,
        startIndex + (minActionsDisplayed - nbActionPending) - 1
      ),
      ...executedActions,
    ];
  }
  // End of the rework

  queue.items = [...executedActions, ...pendingActions];

  return {
    items: queue.items,
    nbActionsLeft,
    nbActionsDone,
  };
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
