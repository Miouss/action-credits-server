import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  addActionToQueue,
  sendQueue,
  sendConfirmation,
} from "./middlewares";

const userActions = Router();

userActions.post("/", sendUserActions);
userActions.post("/queue", sendUserActions);
userActions.get("/queue", sendQueue);
userActions.patch("/queue", verifyAction, addActionToQueue, sendConfirmation);

export { userActions };
