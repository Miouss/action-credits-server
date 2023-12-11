import { DataProviderFactory } from "../data";
import { ActionName, ActionStatus } from "../types/enums";
import { Queue } from "../types/types";
import { findActionByName } from "./actions";

export async function addActionToQueue(actionName: ActionName) {
  const queue = await DataProviderFactory().queue.get();

  queue.items.push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await DataProviderFactory().queue.update(queue);
}

export function hasAnyActionInQueue(queue: Queue) {
  const { nextActionIndex } = queue;

  if (queue.items[nextActionIndex]) return true;
  return false;
}

export async function findValidAction(actionName: ActionName) {
  const actions = await DataProviderFactory().actions.get();
  const validAction = findActionByName(actions, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}



export function filterQueue(
  queue: Queue,
  maxPendingActions: number,
  maxExecutedActions: number
) {
  const { nextActionIndex } = queue;

  const pendingActions = queue.items.slice(
    nextActionIndex,
    Math.min(nextActionIndex + maxPendingActions, queue.items.length)
  );

  let executedActions = queue.items.slice(
    Math.max(0, nextActionIndex - maxExecutedActions),
    nextActionIndex
  );

  let nbActionsDone = nextActionIndex - executedActions.length;

  const nbActionsLeft =
    queue.items.length - pendingActions.length - nextActionIndex;

  // This part rework the filter to display the minimum number of the total actions required to display in the UI
  // by adding more executed actions if the number of pending actions is too low
  const minActionsDisplayed = maxPendingActions + maxExecutedActions;
  const nbActionPending = pendingActions.length;

  if (nbActionPending < minActionsDisplayed) {
    const startIndex = Math.max(
      0,
      nextActionIndex -
        maxExecutedActions -
        (minActionsDisplayed - nbActionPending) +
        1
    );

    nbActionsDone -= minActionsDisplayed - nbActionPending - 1;
    executedActions = [
      ...queue.items.slice(
        startIndex,
        startIndex + (minActionsDisplayed - nbActionPending) - 1
      ),
      ...executedActions,
    ];
  }
  // End of the rework

  queue.items = [...executedActions, ...pendingActions];

  return {
    items: queue.items,
    nbActionsLeft,
    nbActionsDone,
  };
}