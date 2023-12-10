import { REFRESH_CREDITS_INTERVAL, randomizeCredits, randomUUID } from "../config";
import { UserActionsFactory } from "../data";
import { UserActions } from "../types/types";

export function refreshCreditsDelay(orignalUsersActions: UserActions) {
  return setTimeout(
    () => resetCredits(orignalUsersActions),
    REFRESH_CREDITS_INTERVAL
  );
}

async function resetCredits(orignalUserActions: UserActions) {
  const userActions = await UserActionsFactory().get();

  let needReset = false;

  if (hasUsedCredits(userActions, orignalUserActions)) {
    needReset = true;

    userActions.actions.forEach((action) => {
      action.credits = randomizeCredits();
    });

    userActions.id = randomUUID();
  }

  if (needReset) await UserActionsFactory().update(userActions);

  refreshCreditsDelay(needReset ? userActions : orignalUserActions);
}

function hasUsedCredits(
  userActions: UserActions,
  orignalUserActions: UserActions
) {
  return (
    JSON.stringify(orignalUserActions.actions) !==
    JSON.stringify(userActions.actions)
  );
}
