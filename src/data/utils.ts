import jsonfile from "jsonfile";
import { UserActions } from "../types";
import { User, ActionName } from "../enums";
import {
  USERS_ACTIONS_FILE_PATH,
  REFRESH_CREDITS_INTERVAL,
  DEFAULT_USERS_ACTIONS,
  randomizeCredits,
  randomUUID,
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

export async function consumeAction(username: User, actionName: ActionName) {
  const usersActions = await getUsersActions();
  const index = await findUserActionsIndex(usersActions, username);
  findUserActionByName(usersActions[index], actionName)!.credits--;

  await updateUsersActions(usersActions);
}

function findUserActionByName(userAction: UserActions, actionName: ActionName) {
  return userAction.actions.find(({ name }) => name === actionName);
}

export async function setupUsersActionsFile() {
  await createUsersActionsFile(DEFAULT_USERS_ACTIONS);

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
