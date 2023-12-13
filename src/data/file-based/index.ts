import { Actions } from "../../types/types";
import { IDataProvider } from "../";
import {
  getQueue,
  getQueueByStatus as _getQueueByStatus,
  updateQueue,
} from "./queue";
import { getActions, updateActions } from "./actions";
import { ActionStatus } from "../../types/enums";
import { seedAllData, validateActionsFile, validateQueueFile } from "./init";

export function FileBasedProvider(): IDataProvider {
  return {
    init: () => seedAllData(),
    actions: {
      get: () => getActions(),
      update: (actions: Actions) => updateActions(actions),
    },
    queue: {
      get: () => getQueue(),
      getQueueByStatus: (count: number, statuses: ActionStatus[]) =>
        _getQueueByStatus(count, statuses),

      update: (queue) => updateQueue(queue),
    },
  };
}

// put fileValidator instead of init.ts to mock it
export function FileValidatorFactoryProvider() {
  return {
    queue: validateQueueFile,
    actions: validateActionsFile,
  };
}
