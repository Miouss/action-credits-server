import { USER_ACTIONS_FACTORY_TYPE } from "../config";
import { ActionName } from "../types/enums";
import { UserActions, Action, Queue } from "../types/types";
import { DBBasedUserActions } from "./db-based";
import { FileBasedUserActions } from "./file-based";

export type UserActionsFactoryType = "file" | "db";

export function UserActionsFactory(): IUserActions {
  switch (USER_ACTIONS_FACTORY_TYPE) {
    case "file":
      return FileBasedUserActions();
    case "db":
      return DBBasedUserActions();
    default:
      throw new Error("Invalid user actions");
  }
}

export interface IUserActions {
  create: (userActions: UserActions) => Promise<void>;
  init: () => Promise<void>;
  get: () => Promise<UserActions>;
  update: (userActions: UserActions) => Promise<void>;
  actions: {
    get: () => Promise<Action[]>;
    findByName: (userActions: UserActions, actionName: ActionName) => Action;
  };
  queue: {
    get: (userActions: UserActions) => Queue;
    hasAny: (queue: Queue) => boolean;
    add: (actionName: ActionName) => Promise<void>;
    executeAction: (userActions: UserActions) => Promise<void>;
  };
}
