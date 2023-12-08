import jsonfile from "jsonfile";
import { UserActions } from "../types";
import { User, ActionName } from "../enums";
import { DEFAULT_USERS_ACTIONS, USERS_ACTIONS_FILE_PATH } from "../config";

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

export async function consumeAction(username: User, actionName: ActionName) {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, username);
  usersActions[index].actions.find((action) => action.name === actionName)!
    .credits--;

  await updateUsersActions(usersActions);
}

export async function doesFileExist() {
  await getUsersActions();
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

export async function setupActionsFile() {
  try {
    await doesFileExist();
  } catch (err) {
    await initUsersActions();
  }
}

export async function initUsersActions() {
  await createUsersActionsFile(DEFAULT_USERS_ACTIONS);
}
