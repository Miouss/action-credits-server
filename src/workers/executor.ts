import { EXECUTION_INTERVAL } from "../config";
import { executeAction } from "../services/actions";

export function executeActionDelay() {
  setTimeout(async () => {
    await executeAction();
    return executeActionDelay();
  }, EXECUTION_INTERVAL);
}
