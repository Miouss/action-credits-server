import { Actions, Queue } from "../../types/types";
import { IDataProvider, DataProviderFactory } from "../";
import { getQueue, getQueueFiltered, updateQueue } from "./queue";
import { fileValidationHandler } from "./fileValidator";
import { getActions, updateActions } from "./actions";
import { ActionName } from "../../types/enums";
import { randomUUID, randomizeCredits } from "../../services/actions";



const DEFAULT_QUEUE: Queue = {
  items: [],
  nextActionIndex: 0,
};

const DEFAULT_ACTIONS_NAME: ActionName[] = Object.values(ActionName);

const DEFAULT_ACTIONS: Actions = {
  items: DEFAULT_ACTIONS_NAME.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  id: randomUUID(),
};

export function FileBasedProvider(): IDataProvider {
  return {
    init: async () => await seedData(),
    actions: {
      get: () => getActions(),
      update: (actions: Actions) => updateActions(actions),
    },
    queue: {
      get: () => getQueue(),
      getFiltered: async (
        maxPendingActions: number,
        maxExecutedActions: number
      ) => await getQueueFiltered(maxPendingActions, maxExecutedActions),
      update: (queue) => updateQueue(queue),
    },
  };
}

async function seedData() {
  await Promise.all([
    fileValidationHandler(
      "actions",
      DataProviderFactory().actions.update,
      DEFAULT_ACTIONS
    ),
    fileValidationHandler(
      "queue",
      DataProviderFactory().queue.update,
      DEFAULT_QUEUE
    ),
  ]);
}