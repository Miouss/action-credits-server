import { REFRESH_CREDITS_INTERVAL } from "../config";

import { DataProviderFactory } from "../data";
import { randomUUID, randomizeCredits } from "../services/actions";
import { Actions } from "../types/types";

export function refreshCreditsDelay(originalActions: Actions) {
  return setTimeout(
    () => resetCredits(originalActions),
    REFRESH_CREDITS_INTERVAL
  );
}

async function resetCredits(originalActions: Actions) {
  const actions = await DataProviderFactory().actions.get();

  let needReset = false;

  if (hasUsedCredits(actions, originalActions)) {
    needReset = true;

    actions.items.forEach((action) => {
      action.credits = randomizeCredits();
    });

    actions.id = randomUUID();
  }

  if (needReset) await DataProviderFactory().actions.update(actions);

  refreshCreditsDelay(needReset ? actions : originalActions);
}

function hasUsedCredits(actions: Actions, originalActions: Actions) {
  return JSON.stringify(actions) !== JSON.stringify(originalActions);
}
