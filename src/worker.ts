import { EXECUTION_INTERVAL } from "./config";
import { UserActionsFactory } from "./data";

function executeActionEachInterval() {
  return setInterval(async () => {
    try {
      const userActions = await UserActionsFactory().get();

      if (!UserActionsFactory().queue.hasAny(userActions.queue))
        throw new Error("No action to execute");

      await UserActionsFactory().queue.executeAction(userActions);
      console.log("Action executed");
    } catch (err: any) {
      console.log(err.message);
    }
  }, EXECUTION_INTERVAL);
}

executeActionEachInterval();
