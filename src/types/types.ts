import { ActionName, ActionStatus } from "./enums";

export interface Action {
  name: ActionName;
  credits: number;
}

export interface Actions {
  items: Action[];
  id: string;
}

export interface QueueItem {
  name: ActionName;
  status: ActionStatus;
}

export interface QueueFiltered {
  items: QueueItem[];
  nbActionsLeft: number;
  nbActionsDone: number;
}

export interface Queue {
  items: QueueItem[];
  nextActionIndex: number;
}

export interface QueueItemsByActionStatus {
  executed: ActionName[];
  pending: ActionName[];
}

export interface QueueFilteredByActionStatus {
  items: QueueItemsByActionStatus;
  executedItemsHistory: number;
  pendingItemsHistory: number;
}
