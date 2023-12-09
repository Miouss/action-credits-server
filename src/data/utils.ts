import jsonfile from "jsonfile";
import { Action, UserActions } from "../types";
import { ActionName } from "../enums";
import {
  USERS_ACTIONS_FILE_PATH,
  REFRESH_CREDITS_INTERVAL,
  DEFAULT_USER_ACTIONS,
  randomizeCredits,
  randomUUID,
} from "../config";

import Ajv, { JSONSchemaType } from "ajv";

export async function getUserActions(): Promise<UserActions> {
  return await jsonfile.readFile(USERS_ACTIONS_FILE_PATH);
}

export async function getActions(): Promise<Action[]> {
  const userActions = await getUserActions();

  return userActions.actions;
}

export async function getQueue() {
  const userActions = await getUserActions();

  return userActions.queue;
}

async function updateUserActions(userActions: UserActions) {
  return await jsonfile.writeFile(USERS_ACTIONS_FILE_PATH, userActions);
}

function createUsersActionsFile(userActions: UserActions) {
  return jsonfile.writeFile(USERS_ACTIONS_FILE_PATH, userActions);
}

export async function consumeAction(actionName: ActionName) {
  const userAction = await getUserActions();
  userAction.actions.find(({ name }) => name === actionName)!.credits--;

  await updateUserActions(userAction);
}

export async function addAction(actionName: ActionName) {
  const userActions = await getUserActions();

  userActions.queue.push(actionName);

  await updateUserActions(userActions);
}

export async function findActionByName(actionName: ActionName) {
  const userAction = await getUserActions();

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
  const usersActions = await getUserActions();

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
  }

  refreshCreditsInterval(DEFAULT_USER_ACTIONS);
}

function refreshCreditsInterval(orignalUsersActions: UserActions) {
  return setTimeout(
    () => resetCredits(orignalUsersActions),
    REFRESH_CREDITS_INTERVAL
  );
}

async function resetCredits(orignalUserActions: UserActions) {
  const userActions = await getUserActions();

  let needReset = false;

  if (hasUsedCredits(userActions, orignalUserActions)) {
    needReset = true;

    userActions.actions.forEach((action) => {
      action.credits = randomizeCredits();
    });

    userActions.id = randomUUID();
  }

  if (needReset) await updateUserActions(userActions);

  refreshCreditsInterval(needReset ? userActions : orignalUserActions);
}

function hasUsedCredits(
  userActions: UserActions,
  orignalUserActions: UserActions
) {
  return JSON.stringify(orignalUserActions) !== JSON.stringify(userActions);
}
