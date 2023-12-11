/* import { EXECUTION_INTERVAL } from "../config";
import { DataProviderFactory } from "../data";
import { refreshCreditsDelay } from "../services/actions";

await DataProviderFactory().init();

refreshCreditsDelay(await DataProviderFactory().get());
executeActionEachInterval();

function executeActionEachInterval() {
  return setInterval(async () => {
    try {
      const userActions = await DataProviderFactory().get();

      if (!DataProviderFactory().queue.hasAny(userActions.queue))
        throw new Error("No action to execute");

      await DataProviderFactory().queue.executeAction(userActions);
      console.log("Action executed");
    } catch (err: any) {
      console.log(err.message);
    }
  }, EXECUTION_INTERVAL);
}
 */