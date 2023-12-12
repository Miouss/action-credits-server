import { ActionStatus } from "../../types/enums";
import {
  Queue,
  QueueFilteredByActionStatus,
  QueueItem,
} from "../../types/types";
import jsonfile from "jsonfile";

const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  return await jsonfile.readFile(QUEUE_FILE_PATH);
}

export async function getQueueItemsByActionStatus(
  count: number,
  statuses: ActionStatus[]
): Promise<QueueFilteredByActionStatus> {
  const queue = await getQueue();

  const filterByStatus = (status: ActionStatus) =>
    queue.items.filter(({ status: itemStatus }) => itemStatus === status);

  const executedItems = filterByStatus(ActionStatus.COMPLETED);
  const pendingItems = filterByStatus(ActionStatus.PENDING);

  const filterByName = (actionsStatus: ActionStatus, queueItems: QueueItem[]) =>
    statuses.includes(actionsStatus) ? queueItems.map(({ name }) => name) : [];

  const queueItemsExecuted = filterByName(
    ActionStatus.COMPLETED,
    executedItems
  );
  const queueItemsPending = filterByName(ActionStatus.PENDING, pendingItems);

  return {
    items: {
      executed: statuses.includes(ActionStatus.COMPLETED)
        ? queueItemsExecuted.slice(-count)
        : [],
      pending: statuses.includes(ActionStatus.PENDING) ? queueItemsPending : [],
    },
    executedItemsHistory:
      executedItems.length - Math.min(count, executedItems.length),
    pendingItemsHistory:
      pendingItems.length - Math.min(count, pendingItems.length),
  };
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
