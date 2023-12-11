import { DataProviderType } from "../data";
import { randomUUID, randomizeCredits } from "../services/actions";
import { ActionName } from "../types/enums";
import { Actions } from "../types/types";

export const DATA_PROVIDER_TYPE: DataProviderType = "file";

export const DEFAULT_ACTIONS_NAME: ActionName[] = Object.values(ActionName);
export const DEFAULT_ACTIONS: Actions = {
  items: DEFAULT_ACTIONS_NAME.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  id: randomUUID(),
};
