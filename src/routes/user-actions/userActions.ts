import { Router } from "express";
import {
  sendActions,
  verifyAction,
  addActionToQueue,
  sendRefreshInterval,
} from "./middlewares";

const userActions = Router();

userActions.get("/", sendActions);
userActions.get("/refresh-interval", sendRefreshInterval);
userActions.patch("/queue", verifyAction, addActionToQueue, sendActions);

export { userActions };
