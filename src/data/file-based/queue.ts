import { Queue, UserActions } from "../../types/types";
import { UserActionsFactory } from "../";
import { ActionName, ActionStatus } from "../../types/enums";
import { NB_ACTION_BY_QUEUE_PAGE } from "../../config";

export async function addActionToQueue(actionName: ActionName) {
  const userActions = await UserActionsFactory().get();
  const { nextActionPageIndex } = userActions.queue;

  if (!Array.isArray(userActions.queue.items[nextActionPageIndex]))
    userActions.queue.items[nextActionPageIndex] = [];

  let lastPageIndex = userActions.queue.items.length - 1;

  const isQueueFull =
    userActions.queue.items[lastPageIndex].length === NB_ACTION_BY_QUEUE_PAGE;

  if (isQueueFull) {
    userActions.queue.items[lastPageIndex + 1] = [];
    lastPageIndex++;
  }

  userActions.queue.items[lastPageIndex].push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await UserActionsFactory().update(userActions);
}

export function getQueue(userActions: UserActions) {
  return userActions.queue;
}

export function hasAnyActionInQueue(queue: Queue) {
  const { nextActionIndex, nextActionPageIndex } = queue;

  if (
    queue.items[nextActionPageIndex] &&
    queue.items[nextActionPageIndex][nextActionIndex]
  )
    return true;
  return false;
}

export async function executeAction(userActions: UserActions) {
  const { nextActionIndex, nextActionPageIndex } = userActions.queue;

  const action = userActions.queue.items[nextActionPageIndex][nextActionIndex];
  const userAction = UserActionsFactory().actions.findByName(
    userActions,
    action.name
  );

  const canExecuteAction = userAction.credits > 0;

  if (!canExecuteAction) throw new Error("No credits left to execute action");

  action.status = ActionStatus.COMPLETED;

  const isActionInNextPage =
    nextActionIndex - (NB_ACTION_BY_QUEUE_PAGE - 1) === 0;

  userActions.queue.nextActionPageIndex = isActionInNextPage
    ? nextActionPageIndex + 1
    : nextActionPageIndex;

  userActions.queue.nextActionIndex = isActionInNextPage
    ? 0
    : nextActionIndex + 1;

  userAction.credits--;

  await UserActionsFactory().update(userActions);
}
