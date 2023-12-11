import { ActionName } from "../../types/enums";
import { Action, UserActions } from "../../types/types";
import { UserActionsFactory } from "../";

export function findActionByName(
  userActions: UserActions,
  actionName: ActionName
) {
  return userActions.actions.find(({ name }) => name === actionName)!;
}

export async function getActions(): Promise<Action[]> {
  const userActions = await UserActionsFactory().get();

  return userActions.actions;
}
