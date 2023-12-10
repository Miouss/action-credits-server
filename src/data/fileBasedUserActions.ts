import jsonfile from "jsonfile";
import { Action, UserActions, IUserActions, Queue } from "../types/types";
import { ActionName, ActionStatus } from "../types/enums";
import {
  REFRESH_CREDITS_INTERVAL,
  DEFAULT_USER_ACTIONS,
  randomizeCredits,
  randomUUID,
} from "../config";

import { UserActionsFactory } from "./userActionsFactory";
import { validateFile } from "./fileValidation";

const USER_ACTIONS_FILE_PATH = "./src/data/user-actions.json";

export function FileBasedUserActions(): IUserActions {
  return {
    get: async () => await getUserActions(),
    update: async (userActions: UserActions) =>
      await updateUserActions(userActions),
    actions: {
      get: () => getActions(),
      findByName: async (actionName: ActionName) =>
        await findActionByName(actionName),
    },
    queue: {
      get: async () => await getQueue(),
      hasAny: (queue: Queue) => hasAnyActionInQueue(queue),
      add: async (actionName: ActionName) => await addAction(actionName),
      consumeAction: async () => await consumeAction(),
    },
  };
}

async function getUserActions(): Promise<UserActions> {
  return await jsonfile.readFile(USER_ACTIONS_FILE_PATH);
}

async function getActions(): Promise<Action[]> {
  const userActions = await UserActionsFactory().get();

  return userActions.actions;
}

async function getQueue() {
  const userActions = await UserActionsFactory().get();

  return userActions.queue;
}

async function updateUserActions(userActions: UserActions) {
  return await jsonfile.writeFile(USER_ACTIONS_FILE_PATH, userActions);
}

function createUsersActionsFile(userActions: UserActions) {
  return jsonfile.writeFile(USER_ACTIONS_FILE_PATH, userActions);
}

function hasAnyActionInQueue(queue: Queue) {
  if (queue.items[queue.nextActionIndex] === undefined) return false;
  return true;
}

async function consumeAction() {
  const userAction = await UserActionsFactory().get();
  userAction.queue.items[userAction.queue.nextActionIndex].status =
    ActionStatus.COMPLETED;

  userAction.queue.nextActionIndex = userAction.queue.nextActionIndex + 1;

  await UserActionsFactory().update(userAction);
}

async function addAction(actionName: ActionName) {
  const userActions = await UserActionsFactory().get();

  userActions.queue.items.push({
    name: actionName,
    status: ActionStatus.PENDING,
  });

  await UserActionsFactory().update(userActions);
}

async function findActionByName(actionName: ActionName) {
  const userAction = await UserActionsFactory().get();

  return userAction.actions.find(({ name }) => name === actionName);
}

export async function setupUsersActionsFile() {
  try {
    console.log("Validating file...");
    await validateFile();
    console.log("File is valid, no need to create new file");
  } catch (err) {
    console.log("File is invalid, creating new file...");
    await createUsersActionsFile(DEFAULT_USER_ACTIONS);
    console.log("File created");
  }

  refreshCreditsDelay(await UserActionsFactory().get());
}

function refreshCreditsDelay(orignalUsersActions: UserActions) {
  return setTimeout(
    () => resetCredits(orignalUsersActions),
    REFRESH_CREDITS_INTERVAL
  );
}

async function resetCredits(orignalUserActions: UserActions) {
  const userActions = await UserActionsFactory().get();

  let needReset = false;

  if (hasUsedCredits(userActions, orignalUserActions)) {
    needReset = true;

    userActions.actions.forEach((action) => {
      action.credits = randomizeCredits();
    });

    userActions.id = randomUUID();
  }

  if (needReset) await UserActionsFactory().update(userActions);

  refreshCreditsDelay(needReset ? userActions : orignalUserActions);
}

function hasUsedCredits(
  userActions: UserActions,
  orignalUserActions: UserActions
) {
  return (
    JSON.stringify(orignalUserActions.actions) !==
    JSON.stringify(userActions.actions)
  );
}
