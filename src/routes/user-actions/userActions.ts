import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  addActionToQueue,
  sendRefreshInterval,
} from "./middlewares";

const userActions = Router();

userActions.get("/", sendUserActions);
userActions.get("/refresh-interval", sendRefreshInterval);
userActions.patch("/queue", verifyAction, addActionToQueue, sendUserActions);

export { userActions };
