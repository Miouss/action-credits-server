import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  addActionToQueue,
  sendQueue,
  sendConfirmation,
} from "./middlewares";

const actions = Router();

actions.post("/", sendUserActions);
actions.post("/queue", sendUserActions);
actions.get("/queue", sendQueue);
actions.patch("/queue", verifyAction, addActionToQueue, sendConfirmation);

export { actions };
