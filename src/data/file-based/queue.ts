import { Queue } from "../../types/types";
import { UserActionsFactory } from "../";

export async function getQueue() {
  const userActions = await UserActionsFactory().get();

  return userActions.queue;
}

export function hasAnyActionInQueue(queue: Queue) {
  if (queue.items[queue.nextActionIndex] === undefined) return false;
  return true;
}
