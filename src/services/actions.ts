import { ActionName } from "../types/enums";
import { Actions, UserActions } from "../types/types";

export function findActionByName(actions: Actions, actionName: ActionName) {
  return actions.items.find(({ name }) => name === actionName)!;
}

export function hasUsedCredits(
  userActions: UserActions,
  orignalUserActions: UserActions
) {
  return (
    JSON.stringify(orignalUserActions.actions) !==
    JSON.stringify(userActions.actions)
  );
}
