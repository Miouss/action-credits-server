import { randomizeCredits, randomUUID } from "../../../services/actions";
import { ActionName } from "../../../types/enums";
import { Actions, Queue } from "../../../types/types";

const DEFAULT_QUEUE: Queue = {
  pending: [],
  executed: [],
};

const DEFAULT_ACTIONS_NAME = Object.values(ActionName);

const DEFAULT_ACTIONS: Actions = {
  items: DEFAULT_ACTIONS_NAME.map((name) => ({
    name,
    credits: randomizeCredits(),
  })),
  id: randomUUID(),
};

export enum FileTypes {
  ACTIONS = "actions",
  QUEUE = "queue",
}

export const defaultContent: Record<FileTypes, Actions | Queue> = {
  actions: DEFAULT_ACTIONS,
  queue: DEFAULT_QUEUE,
};
