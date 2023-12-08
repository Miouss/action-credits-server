import { ActionName, User } from "./enums";

export interface Action {
  name: ActionName;
  credits: number;
}

export interface UserActions {
  username: User;
  actions: Action[];
  id: string;
}