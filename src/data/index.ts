import { DATA_PROVIDER_TYPE } from "../config";
import { Queue, Actions, QueueItem } from "../types/types";
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
    get: () => Promise<Actions>;
    update: (actions: Actions) => Promise<void>;
  };
  queue: {
    get: () => Promise<Queue>;
    getQueueActionsByStatus: (
      count: number,
      statuses: string[],
      order: "asc" | "desc"
    ) => Promise<QueueItem[]>;
    update: (queue: Queue) => Promise<void>;
  };
}
