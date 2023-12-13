import { REFRESH_CREDITS_INTERVAL } from "../config";
import { Actions } from "../types/types";
import { resetCredits } from "./refresher";

// put it in a separate file to be able to mock it in tests

export function refreshCreditsDelay(originalActions: Actions) {
  return setTimeout(
    () => resetCredits(originalActions),
    REFRESH_CREDITS_INTERVAL
  );
}
