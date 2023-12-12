import { ActionName, ActionStatus } from "../../types/enums";
import {
  Queue,
  QueueFilteredByActionStatus,
  QueueItem,
} from "../../types/types";
import jsonfile from "jsonfile";

export const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

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

  const filterByName = (actionsStatus: ActionStatus, queueItems: QueueItem[]) =>
    statuses.includes(actionsStatus) ? queueItems.map(({ name }) => name) : [];

  let executedItems: QueueItem[] = [];
  let queueItemsExecuted: ActionName[] = [];

  if (statuses.includes(ActionStatus.COMPLETED)) {
    executedItems = filterByStatus(ActionStatus.COMPLETED);

    queueItemsExecuted = filterByName(ActionStatus.COMPLETED, executedItems);
  }

  let pendingItems: QueueItem[] = [];
  let queueItemsPending: ActionName[] = [];

  if (statuses.includes(ActionStatus.COMPLETED)) {
    pendingItems = filterByStatus(ActionStatus.PENDING);

    queueItemsPending = filterByName(ActionStatus.PENDING, pendingItems);
  }

  return {
    items: {
      executed: queueItemsExecuted.slice(-count),
      pending: queueItemsPending,
    },
    executedItemsHistory:
      executedItems.length - Math.min(count, executedItems.length),
  };
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
