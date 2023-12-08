import { User, ActionName } from "./enums";
import { UserActions } from "./types";
import { v4 as uuidv4 } from "uuid";

export const USERS_ACTIONS_FILE_PATH = "./src/data/users-actions.json";
export const REFRESH_INTERVAL = 5000;

export const CREDITS = 100;
export const MAX_CREDITS_PERCENT = 100;
export const MIN_CREDITS_PERCENT = 80;

export const DEFAULT_USERS: User[] = Object.values(User);
export const DEFAULT_ACTIONS: ActionName[] = Object.values(ActionName);
export const DEFAULT_USERS_ACTIONS: UserActions[] = DEFAULT_USERS.map((username) => ({
  username,
  actions: DEFAULT_ACTIONS.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  id: ramdomUUID(),
}));

export function ramdomUUID() {
  return uuidv4();
}


export function randomizeCredits(
  value: number = CREDITS,
  minPercent: number = MIN_CREDITS_PERCENT,
  maxPercent: number = MAX_CREDITS_PERCENT
) {
  const max = Math.floor(value * (maxPercent / 100));
  const min = Math.ceil(max * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
