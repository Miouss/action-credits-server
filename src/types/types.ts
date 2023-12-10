import { ActionName } from "./enums";

export interface Action {
  name: ActionName;
  credits: number;
}

/* type ActionStatus = "pending" | "completed";

interface QueueItem {
  name: ActionName;
  status: ActionStatus;
} */

export interface UserActions {
  actions: Action[];
  queue: ActionName[];
  /* queue: QueueItem[]; */
  /* nextActionIndex: number; */
  id: string;
}

export interface IUserActions {
  get: () => Promise<UserActions>;
  update: (userActions: UserActions) => Promise<void>;
  actions: {
    get: () => Promise<Action[]>;
    findByName: (actionName: ActionName) => Promise<Action | undefined>;
  };
  queue: {
    get: () => Promise<ActionName[]>;
    hasAny: (queue: ActionName[]) => boolean;
    add: (actionName: ActionName) => Promise<void>;
    consumeAction: () => Promise<void>;
  };
}
