import { REFRESH_CREDITS_INTERVAL } from "../config";
import { DataProviderFactory } from "../data";
import { resetCredits } from "../services/actions";

export async function refreshCreditsDelay() {
  const originalActions = await DataProviderFactory().actions.get();

  setTimeout(async () => {
    await resetCredits(originalActions);
    return refreshCreditsDelay();
  }, REFRESH_CREDITS_INTERVAL);
}
