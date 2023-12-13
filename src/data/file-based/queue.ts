import {  ActionStatus } from "../../types/enums";
import {
  Queue,
  QueueByStatusWithExecutedHistory,
} from "../../types/types";
import jsonfile from "jsonfile";

export const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  return await jsonfile.readFile(QUEUE_FILE_PATH);
}

export async function getQueueByStatus(
  count: number,
  statuses: ActionStatus[]
): Promise<QueueByStatusWithExecutedHistory> {
  const queue = await getQueue();

  const pendingQueue = queue.pending;
  const executedQueue = queue.executed.slice(-count);

  const executedItemsHistory = queue.executed.length - count;
  return {
    items: {
      executed: statuses.includes(ActionStatus.EXECUTED)
        ? executedQueue
        : undefined,
      pending: statuses.includes(ActionStatus.PENDING)
        ? pendingQueue
        : undefined,
    },
    executedItemsHistory,
  };
}

export async function updateQueue(queue: Queue) {
  await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
