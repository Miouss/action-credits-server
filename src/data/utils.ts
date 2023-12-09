import jsonfile from "jsonfile";
import { Action, UserActions } from "../types";
import { User, ActionName } from "../enums";
import {
  USERS_ACTIONS_FILE_PATH,
  REFRESH_CREDITS_INTERVAL,
  DEFAULT_USERS_ACTIONS,
  randomizeCredits,
  randomUUID,
} from "../config";

import Ajv, { JSONSchemaType } from "ajv";

export async function getUserAction(
  usernameSearched: User,
  actionName: ActionName
) {
  const { actions } = await getUserActions(usernameSearched);

  return actions.find(({ name }) => name === actionName);
}

export async function getUserActions(
  usernameSearched: User
): Promise<UserActions> {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, usernameSearched);

  return usersActions[index];
}

export async function getUsersActions(): Promise<UserActions[]> {
  return await jsonfile.readFile(USERS_ACTIONS_FILE_PATH);
}

export async function findUserActionsIndex(
  usersActions: UserActions[],
  usernameSearched: User
): Promise<number> {
  const userActionIndex = usersActions.findIndex(
    ({ username }) => username === usernameSearched
  );

  if (userActionIndex === -1)
    throw new Error(`User ${usernameSearched} not found`);

  return userActionIndex;
}

async function updateUsersActions(usersActions: UserActions[]) {
  return await jsonfile.writeFile(USERS_ACTIONS_FILE_PATH, usersActions);
}

function createUsersActionsFile(usersActions: UserActions[]) {
  return jsonfile.writeFile(USERS_ACTIONS_FILE_PATH, usersActions);
}

export async function consumeAction(username: User) {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, username);
  const actionName = usersActions[index].queue.shift()!;

  findUserActionByName(usersActions[index], actionName)!.credits--;

  await updateUsersActions(usersActions);
}

export async function addActionToUserActionQueue(
  actionName: ActionName,
  username: User
) {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, username);

  usersActions[index].queue.push(actionName);

  await updateUsersActions(usersActions);
}

export async function getUserQueue(username: User) {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, username);

  return usersActions[index].queue;
}

function findUserActionByName(userAction: UserActions, actionName: ActionName) {
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

  const schema: JSONSchemaType<UserActions[]> = {
    type: "array",
    items: {
      type: "object",
      properties: {
        username: {
          type: "string",
          enum: Object.values(User),
        },
        actions: { type: "array", items: actionSchema },
        queue: {
          type: "array",
          items: { type: "string", enum: Object.values(ActionName) },
        },
        id: { type: "string" },
      },
      required: ["username", "actions", "queue", "id"],
      additionalProperties: false,
    },
  };

  const validate = ajv.compile(schema);
  const usersActions = await getUsersActions();

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
    await createUsersActionsFile(DEFAULT_USERS_ACTIONS);
    console.log("File created");
  }

  refreshCreditsInterval(DEFAULT_USERS_ACTIONS);
}

function refreshCreditsInterval(orignalUsersActions: UserActions[]) {
  return setTimeout(
    () => resetCredits(orignalUsersActions),
    REFRESH_CREDITS_INTERVAL
  );
}

async function resetCredits(orignalUsersActions: UserActions[]) {
  const usersActions = await getUsersActions();

  let needReset = false;

  usersActions.forEach((userActions, i) => {
    if (hasUsedCredits(userActions, i, orignalUsersActions)) {
      needReset = true;

      userActions.actions.forEach((action) => {
        action.credits = randomizeCredits();
      });
      userActions.id = randomUUID();
    }
  });

  if (needReset) await updateUsersActions(usersActions);

  refreshCreditsInterval(needReset ? usersActions : orignalUsersActions);
}

function hasUsedCredits(
  userActions: UserActions,
  i: number,
  orignalUsersActions: UserActions[]
) {
  return userActions.actions.some(
    (action, j) => action.credits !== orignalUsersActions[i].actions[j].credits
  );
}
