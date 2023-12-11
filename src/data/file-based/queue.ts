import { Queue, UserActions } from "../../types/types";
import { UserActionsFactory } from "../";
import { ActionName, ActionStatus } from "../../types/enums";

export async function addActionToQueue(actionName: ActionName) {
  const userActions = await UserActionsFactory().get();

  userActions.queue.items.push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await UserActionsFactory().update(userActions);
}

export function getQueue(userActions: UserActions) {
  return userActions.queue;
}

export function hasAnyActionInQueue(queue: Queue) {
  const { nextActionIndex } = queue;

  if (queue.items[nextActionIndex]) return true;
  return false;
}

export async function executeAction(userActions: UserActions) {
  const action = userActions.queue.items[userActions.queue.nextActionIndex];
  const userAction = UserActionsFactory().actions.findByName(
    userActions,
    action.name
  );

  const canExecuteAction = userAction.credits > 0;

  if (!canExecuteAction) throw new Error("No credits left to execute action");

  action.status = ActionStatus.COMPLETED;

  userActions.queue.nextActionIndex++;

  userAction.credits--;

  await UserActionsFactory().update(userActions);
}
