import { DATA_PROVIDER_TYPE } from "../config";
import { Queue, Actions, QueueFiltered } from "../types/types";
import { DBBasedUserActions } from "./db-based";
import { FileBasedUserActions } from "./file-based";

export type DataProviderType = "file" | "db";

export function DataProviderFactory(): IDataProvider {
  switch (DATA_PROVIDER_TYPE) {
    case "file":
      return FileBasedUserActions();
    case "db":
      return DBBasedUserActions();
    default:
      throw new Error("Invalid user actions");
  }
}

export interface IDataProvider {
  init: () => Promise<void>;
  actions: {
    get: () => Promise<Actions>;
    update: (actions: Actions) => Promise<void>;
  };
  queue: {
    get: () => Promise<Queue>;
    getFiltered: (
      maxPendingActions: number,
      maxExecutedActions: number
    ) => Promise<QueueFiltered>;
    update: (queue: Queue) => Promise<void>;
  };
}
