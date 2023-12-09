import jsonfile from "jsonfile";
import { Action, UserActions } from "../types";
import { ActionName } from "../enums";
import {
  USER_ACTIONS_FILE_PATH,
  EXECUTION_INTERVAL,
  REFRESH_CREDITS_INTERVAL,
  DEFAULT_USER_ACTIONS,
  randomizeCredits,
  randomUUID,
} from "../config";

import Ajv, { JSONSchemaType } from "ajv";

export function UserActionsFactory() {
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
      hasAny: (queue: ActionName[]) => hasAnyActionInQueue(queue),
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

function hasAnyActionInQueue(queue: ActionName[]) {
  return queue.length > 0;
}

async function consumeAction() {
  const userAction = await UserActionsFactory().get();
  userAction.actions.find(({ name }) => name === userAction.queue[0])!
    .credits--;
  userAction.queue.shift();

  await UserActionsFactory().update(userAction);
}

async function addAction(actionName: ActionName) {
  const userActions = await UserActionsFactory().get();

  userActions.queue.push(actionName);

  await UserActionsFactory().update(userActions);
}

async function findActionByName(actionName: ActionName) {
  const userAction = await UserActionsFactory().get();

  return userAction.actions.find(({ name }) => name === actionName);
}

async function validateFile() {
  const ajv = new Ajv();
  const actionSchema: JSONSchemaType<Action> = {
    type: "object",
    properties: {
      name: { type: "string", enum: Object.values(ActionName) },
      credits: { type: "number" },
    },
    required: ["name", "credits"],
    additionalProperties: false,
  };

  const schema: JSONSchemaType<UserActions> = {
    type: "object",
    properties: {
      actions: { type: "array", items: actionSchema },
      queue: {
        type: "array",
        items: { type: "string", enum: Object.values(ActionName) },
      },
      id: { type: "string" },
    },
    required: ["actions", "queue", "id"],
    additionalProperties: false,
  };

  const validate = ajv.compile(schema);
  const usersActions = await UserActionsFactory().get();

  if (!validate(usersActions)) {
    throw new Error();
  }
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
  } finally {
    executeActionEachInterval();
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

export function executeActionEachInterval() {
  return setInterval(async () => {
    const queue = await getQueue();
    if (!UserActionsFactory().queue.hasAny(queue)) return;
    await UserActionsFactory().queue.consumeAction();
  }, EXECUTION_INTERVAL);
}
