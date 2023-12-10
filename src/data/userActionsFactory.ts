import { USER_ACTIONS_FACTORY_TYPE } from "../config";
import { DBBasedUserActions } from "./dbBasedUserActions";
import { FileBasedUserActions } from "./fileBasedUserActions";

export type UserActionsFactoryType = "file" | "db";

export function UserActionsFactory() {
  switch (USER_ACTIONS_FACTORY_TYPE) {
    case "file":
      return FileBasedUserActions();
    case "db":
      return DBBasedUserActions();
    default:
      throw new Error("Invalid user actions");
  }
}
