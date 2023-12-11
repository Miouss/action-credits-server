import { DEFAULT_ACTIONS, DEFAULT_QUEUE } from "../../config";
import { Actions } from "../../types/types";
import { IDataProvider, DataProviderFactory } from "../";
import { getQueue, updateQueue } from "./queue";
import { validateFile } from "./fileValidation";
import { getActions, updateActions } from "./actions";

export function FileBasedUserActions(): IDataProvider {
  return {
    init: async () => await seedData(),
    actions: {
      get: () => getActions(),
      update: (actions: Actions) => updateActions(actions),
    },
    queue: {
      get: () => getQueue(),
      update: (queue) => updateQueue(queue),
    },
  };
}

async function seedData() {
  try {
    console.log("Validating file...");
    await validateFile();
    console.log("File is valid, no need to create new file");
  } catch (err) {
    console.log("File is invalid, creating new file...");
    await DataProviderFactory().actions.update(DEFAULT_ACTIONS);
    await DataProviderFactory().queue.update(DEFAULT_QUEUE);
    console.log("File created");
  }
}
