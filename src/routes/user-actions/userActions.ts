import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  addActionToQueue,
} from "./middlewares";

const userActions = Router();

userActions.post("/", sendUserActions);
userActions.patch("/queue", verifyAction, addActionToQueue, sendUserActions);

export { userActions };
