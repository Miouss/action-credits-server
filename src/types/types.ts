import { ActionName } from "./enums";

export interface Action {
  name: ActionName;
  credits: number;
}

export interface UserActions {
  actions: Action[];
  queue: ActionName[];
  id: string;
}