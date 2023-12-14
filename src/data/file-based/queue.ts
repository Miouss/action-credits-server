import { ActionStatus } from "../../types/enums";
import { Queue, QueueByStatusWithExecutedHistory } from "../../types/types";
import jsonfile from "jsonfile";
import { waitForFileAccess } from "./init";

export const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  const release = await waitForFileAccess(QUEUE_FILE_PATH);

  const queue = await jsonfile.readFile(QUEUE_FILE_PATH);

  await release();

  return queue;
}

export async function getQueueByStatus(
  count: number,
  statuses: ActionStatus[]
): Promise<QueueByStatusWithExecutedHistory> {
  const queue = await getQueue();

  const pendingQueue = statuses.includes(ActionStatus.PENDING)
    ? queue.pending
    : undefined;

  const executedQueue = statuses.includes(ActionStatus.EXECUTED)
    ? queue.executed.slice(-count)
    : undefined;

  const executedItemsHistory = statuses.includes(ActionStatus.EXECUTED)
    ? Math.max(queue.executed.length - count, 0)
    : undefined;

  return {
    items: {
      executed: executedQueue,
      pending: pendingQueue,
    },
    executedItemsHistory: executedItemsHistory,
  };
}

export async function updateQueue(queue: Queue) {
  const release = await waitForFileAccess(QUEUE_FILE_PATH);

  await jsonfile.writeFile(QUEUE_FILE_PATH, queue);

  await release();
}
