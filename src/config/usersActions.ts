import { ActionName, User } from "../enums";
import { UserActions } from "../types";
import { randomizeCredits } from "./credits";
import { v4 as uuidv4 } from "uuid";

export const USERS_ACTIONS_FILE_PATH = "./src/data/users-actions.json";

export const DEFAULT_USERS: User[] = Object.values(User);
export const DEFAULT_ACTIONS: ActionName[] = Object.values(ActionName);
export const DEFAULT_USERS_ACTIONS: UserActions[] = DEFAULT_USERS.map((username) => ({
  username,
  actions: DEFAULT_ACTIONS.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  queue: [],
  id: randomUUID(),
}));

export function randomUUID() {
  return uuidv4();
}
