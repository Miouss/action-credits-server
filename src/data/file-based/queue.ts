import { ActionStatus } from "../../types/enums";
import { Queue, QueueByStatusWithExecutedHistory } from "../../types/types";
import jsonfile from "jsonfile";

export const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export function getQueue(): Promise<Queue> {
  return jsonfile.readFile(QUEUE_FILE_PATH);
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

  const executedItemsHistory = queue.executed.length - count;
  return {
    items: {
      executed: executedQueue,
      pending: pendingQueue,
    },
    executedItemsHistory,
  };
}

export function updateQueue(queue: Queue) {
  return jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
