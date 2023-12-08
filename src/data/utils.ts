import jsonfile from "jsonfile";
import { UserActions } from "../types";
import { User, ActionName } from "../enums";
import {
  USERS_ACTIONS_FILE_PATH,
  DEFAULT_USERS_ACTIONS,
  randomizeCredits,
  REFRESH_INTERVAL,
  ramdomUUID,
} from "../config";

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

function refreshCreditsInterval(orignalUsersActions: UserActions[]) {
  return setTimeout(() => resetCredits(orignalUsersActions), REFRESH_INTERVAL);
}

export async function setupUsersActionsFile() {
  await createUsersActionsFile(DEFAULT_USERS_ACTIONS);

  refreshCreditsInterval(DEFAULT_USERS_ACTIONS);
}

export async function resetCredits(orignalUsersActions: UserActions[]) {
  const usersActions = await getUsersActions();
  
  let hasReset = false;

  usersActions.forEach((userAction, i) => {
    const needReset = userAction.actions.some(
      (action, j) =>
        action.credits !== orignalUsersActions[i].actions[j].credits
    );

    if (needReset) {
      hasReset = true;

      userAction.actions.forEach((action) => {
        action.credits = randomizeCredits();
      });

      userAction.id = ramdomUUID();
    }
  });

  if (hasReset) {
    await updateUsersActions(usersActions);
    console.log("Credits reseted");
  } else {
    console.log("Credits not reseted");
  }

  refreshCreditsInterval(hasReset ? usersActions : orignalUsersActions);
}
