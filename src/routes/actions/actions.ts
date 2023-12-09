import { Router } from "express";
import {
  sendUserActions,
  verifyAction,
  verifyToken,
  addActionToQueue,
  sendQueue,
  sendConfirmation,
} from "./middlewares";

const actions = Router();

actions.post("/", verifyToken, sendUserActions);
actions.post("/queue", verifyToken, sendUserActions);
actions.get("/queue", verifyToken, sendQueue);
actions.patch(
  "/queue",
  verifyToken,
  verifyAction,
  addActionToQueue,
  sendConfirmation
);

export { actions };
