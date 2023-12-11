import { DEFAULT_USER_ACTIONS } from "../../config";
import { ActionName } from "../../types/enums";
import { UserActions, Queue } from "../../types/types";
import { refreshCreditsDelay } from "../../utils/creditsHandler";
import { validateFile } from "./fileValidation";
import { IUserActions, UserActionsFactory } from "../";
import {
  findActionByName,
  getActions,
} from "./actions";
import { getQueue, hasAnyActionInQueue, executeAction, addActionToQueue } from "./queue";
import {
  createUserActionsFile,
  getUserActions,
  updateUserActions,
} from "./userActions";

export function FileBasedUserActions(): IUserActions {
  return {
    create: async (userActions: UserActions) =>
      await createUserActionsFile(userActions),
    init: async () => await initUsersActionsFile(),
    get: async () => await getUserActions(),
    update: async (userActions: UserActions) =>
      await updateUserActions(userActions),
    actions: {
      get: () => getActions(),
      findByName: (userActions: UserActions, actionName: ActionName) =>
        findActionByName(userActions, actionName),
    },
    queue: {
      get: (userActions: UserActions) => getQueue(userActions),
      hasAny: (queue: Queue) => hasAnyActionInQueue(queue),
      add: async (actionName: ActionName) => await addActionToQueue(actionName),
      executeAction: async (userActions: UserActions) =>
        await executeAction(userActions),
    },
  };
}

export async function initUsersActionsFile() {
  try {
    console.log("Validating file...");
    await validateFile();
    console.log("File is valid, no need to create new file");
  } catch (err) {
    console.log("File is invalid, creating new file...");
    await UserActionsFactory().create(DEFAULT_USER_ACTIONS);
    console.log("File created");
  }

  refreshCreditsDelay(await UserActionsFactory().get());
}
