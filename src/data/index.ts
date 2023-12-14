import { DATA_PROVIDER_TYPE } from "../config";
import { ActionStatus } from "../types/enums";
import {
  Queue,
  Actions,
  QueueByStatusWithExecutedHistory,
} from "../types/types";
import { DBBasedProvider } from "./db-based";
import { FileBasedProvider } from "./file-based";

export type DataProviderType = "file" | "db";

export function DataProviderFactory(): IDataProvider {
  switch (DATA_PROVIDER_TYPE) {
    case "file":
      return FileBasedProvider();
    case "db":
      return DBBasedProvider();
    default:
      throw new Error("Invalid provider type");
  }
}

export interface IDataProvider {
  init: () => Promise<void>;
  actions: {
    create: (actions: Actions) => Promise<void>;
    get: () => Promise<Actions>;
    update: (actions: Actions) => Promise<void>;
  };
  queue: {
    create: (queue: Queue) => Promise<void>;
    get: () => Promise<Queue>;
    getQueueByStatus: (
      count: number,
      statuses: ActionStatus[]
    ) => Promise<QueueByStatusWithExecutedHistory>;
    update: (queue: Queue) => Promise<void>;
  };
}
