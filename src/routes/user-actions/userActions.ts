import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  addActionToQueue,
  sendConfirmation,
} from "./middlewares";

const userActions = Router();

userActions.post("/", sendUserActions);
userActions.patch("/queue", verifyAction, addActionToQueue, sendConfirmation);

export { userActions };
