import { UserActionsFactoryType } from "../data/userActionsFactory";
import { ActionName } from "../types/enums";
import { UserActions } from "../types/types";
import { randomizeCredits } from "./credits";
import { v4 as uuidv4 } from "uuid";

export const USER_ACTIONS_FACTORY_TYPE: UserActionsFactoryType = "file";

export const DEFAULT_ACTIONS: ActionName[] = Object.values(ActionName);
export const DEFAULT_USER_ACTIONS: UserActions = {
  actions: DEFAULT_ACTIONS.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  queue: {
    items: [],
    nextActionIndex: 0,
  },
  id: randomUUID(),
};

export function randomUUID() {
  return uuidv4();
}
