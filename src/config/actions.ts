import { DataProviderType } from "../data";
import { ActionName } from "../types/enums";
import { Actions } from "../types/types";
import { randomizeCredits } from "./credits";
import { v4 as uuidv4 } from "uuid";

export const DATA_PROVIDER_TYPE: DataProviderType = "file";

export const DEFAULT_ACTIONS_NAME: ActionName[] = Object.values(ActionName);
export const DEFAULT_ACTIONS: Actions = {
  items: DEFAULT_ACTIONS_NAME.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  id: randomUUID(),
};

export function randomUUID() {
  return uuidv4();
}
