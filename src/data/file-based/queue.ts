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
  const queue = await jsonfile.readFile(QUEUE_FILE_PATH);

  const { nextActionIndex } = queue;

  const pendingActions = queue.items.slice(
    nextActionIndex,
    Math.min(nextActionIndex + maxPendingActions, queue.items.length)
  );

  const executedActions = queue.items.slice(
    nextActionIndex - maxExecutedActions,
    nextActionIndex
  );

  const nbActionsLeft =
    queue.items.length - pendingActions.length - nextActionIndex;

  queue.items = [...executedActions, ...pendingActions];

  return {
    items: queue.items,
    nbActionsLeft,
  };
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
