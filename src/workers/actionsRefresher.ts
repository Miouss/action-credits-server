import { REFRESH_CREDITS_INTERVAL, randomUUID, randomizeCredits } from "../config";
import { DataProviderFactory } from "../data";
import { hasUsedCredits } from "../services/actions";
import { UserActions } from "../types/types";

export function refreshCreditsDelay(orignalUsersActions: UserActions) {
  return setTimeout(
    () => resetCredits(orignalUsersActions),
    REFRESH_CREDITS_INTERVAL
  );
}


async function resetCredits(orignalUserActions: UserActions) {
  const userActions = await DataProviderFactory().get();

  let needReset = false;

  if (hasUsedCredits(userActions, orignalUserActions)) {
    needReset = true;

    userActions.actions.forEach((action) => {
      action.credits = randomizeCredits();
    });

    userActions.id = randomUUID();
  }

  if (needReset) await DataProviderFactory().update(userActions);

  refreshCreditsDelay(needReset ? userActions : orignalUserActions);
}
