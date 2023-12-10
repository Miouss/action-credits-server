import { ActionName, ActionStatus } from "../../types/enums";
import { Action } from "../../types/types";
import { UserActionsFactory } from "../";

export async function addAction(actionName: ActionName) {
  const userActions = await UserActionsFactory().get();

  userActions.queue.items.push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await UserActionsFactory().update(userActions);
}

export async function consumeAction() {
  const userAction = await UserActionsFactory().get();
  userAction.queue.items[userAction.queue.nextActionIndex].status =
    ActionStatus.COMPLETED;

  userAction.queue.nextActionIndex = userAction.queue.nextActionIndex + 1;

  await UserActionsFactory().update(userAction);
}

export async function findActionByName(actionName: ActionName) {
  const userAction = await UserActionsFactory().get();

  return userAction.actions.find(({ name }) => name === actionName);
}

export async function getActions(): Promise<Action[]> {
  const userActions = await UserActionsFactory().get();

  return userActions.actions;
}
