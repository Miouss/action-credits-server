import { User, ActionName } from "./enums";
import { UserActions } from "./types";

export const USERS_ACTIONS_FILE_PATH = "./src/data/users-actions.json";
export const CREDITS = 100;
export const MAX_CREDITS_PERCENT = 50;
export const MIN_CREDITS_PERCENT = 50;
export const DEFAULT_USERS: User[] = Object.values(User);
export const DEFAULT_ACTIONS: ActionName[] = Object.values(ActionName);

export const DEFAULT_USERS_ACTIONS: UserActions[] = DEFAULT_USERS.map(
  (username) => ({
    username,
    actions: DEFAULT_ACTIONS.map((name) => ({
      name,
      credits: randomMinMaxPercent(
        CREDITS,
        MIN_CREDITS_PERCENT,
        MAX_CREDITS_PERCENT
      ),
    })),
  })
);

function randomMinMaxPercent(
  value: number,
  minPercent: number,
  maxPercent: number
) {
  const max = Math.floor(value * (maxPercent / 100));
  const min = Math.ceil(max * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
