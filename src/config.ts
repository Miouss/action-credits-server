import { User, ActionName } from "./enums";
import { UserActions } from "./types";

export const USERS_ACTIONS_FILE_PATH = "./src/data/users-actions.json";
export const MAX_CREDITS = 5;
export const MAX_CREDITS_PERCENT = 100;
export const MIN_CREDITS_PERCENT = 80;
export const DEFAULT_USERS: User[] = Object.values(User);
export const DEFAULT_ACTIONS: ActionName[] = Object.values(ActionName);

export const DEFAULT_USERS_ACTIONS: UserActions[] = DEFAULT_USERS.map(
  (username) => ({
    username,
    actions: DEFAULT_ACTIONS.map((name) => ({
      name,
      credits: randomMinMaxPercent(
        MAX_CREDITS,
        MIN_CREDITS_PERCENT,
        MAX_CREDITS_PERCENT
      ),
    })),
  })
);

function randomMinMaxPercent(
  max: number,
  minPercent: number,
  maxPercent: number
) {
  const min = Math.ceil(max * (maxPercent / 100) * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
