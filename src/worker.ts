import { EXECUTION_INTERVAL } from "./config";
import { UserActionsFactory } from "./data";

function executeActionEachInterval() {
  return setInterval(async () => {
    const queue = await UserActionsFactory().queue.get();
    if (!UserActionsFactory().queue.hasAny(queue)) return;
    await UserActionsFactory().queue.consumeAction();
  }, EXECUTION_INTERVAL);
}

executeActionEachInterval();
