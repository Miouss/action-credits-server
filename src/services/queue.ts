import { DataProviderFactory } from "../data";
import { ActionName, ActionStatus } from "../types/enums";
import { Actions, Queue } from "../types/types";
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

export async function verifyValidAction(actionName: ActionName) {
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

  // This part rework the filter to display the minimum number of the total actions required to display in the UI
  // by having more executed actions if the number of pending actions is too low

  const minActionsDisplayed = maxPendingActions + maxExecutedActions;
  const nbActionPending = pendingActions.length;

  let enhanceFilter = false;

  if (nbActionPending < minActionsDisplayed) {
    enhanceFilter = true;
  }

  const startIndex = enhanceFilter
    ? Math.max(
        0,
        nextActionIndex -
          maxExecutedActions -
          (minActionsDisplayed - nbActionPending) +
          1
      )
    : Math.max(0, nextActionIndex - maxExecutedActions);
  // End of the rework

  const executedActions = queue.items.slice(startIndex, nextActionIndex);

  const nbActionsLeft =
    queue.items.length - pendingActions.length - nextActionIndex;

  queue.items = [...executedActions, ...pendingActions];

  const nbActionsDone = nextActionIndex - executedActions.length;

  return {
    items: queue.items,
    nbActionsLeft,
    nbActionsDone,
  };
}

export function findNextExecutableAction(actions: Actions, queue: Queue) {
  for (let i = queue.nextActionIndex; i < queue.items.length; i++) {
    if (queue.items[i].status === ActionStatus.PENDING) {
      const action = findActionByName(actions, queue.items[i].name);
      if (!action || action.credits < 1) continue;

      return {
        queueActionToExecute: queue.items[i],
        queueActionToExecuteIndex: i,
        executableAction: action,
      };
    }
  }

  return null;
}
