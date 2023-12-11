import { EXECUTION_INTERVAL } from "./config";
import { DataProviderFactory } from "./data";
import { executeAction } from "./services/queue";
import { refreshCreditsDelay } from "./utils/creditsHandler";

await DataProviderFactory().init();

refreshCreditsDelay(await DataProviderFactory().actions.get());
executeActionEachInterval();

function executeActionEachInterval() {
  return setInterval(async () => {
    try {
      await executeAction();
    } catch (err: any) {
      console.log(err.message);
    }
  }, EXECUTION_INTERVAL);
}