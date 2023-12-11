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
}

export interface Queue {
  items: QueueItem[];
  nextActionIndex: number;
}

export interface UserActions {
  actions: Actions;
  queue: Queue;
  id: string;
}
