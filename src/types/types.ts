import { ActionName, ActionStatus } from "./enums";

export interface Action {
  name: ActionName;
  credits: number;
}

export interface QueueItem {
  name: ActionName;
  status: ActionStatus;
}

export interface Queue {
  items: QueueItem[];
  nextActionIndex: number;
}

export interface UserActions {
  actions: Action[];
  queue: Queue;
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
    get: () => Promise<Queue>;
    hasAny: (queue: Queue) => boolean;
    add: (actionName: ActionName) => Promise<void>;
    consumeAction: () => Promise<void>;
  };
}
