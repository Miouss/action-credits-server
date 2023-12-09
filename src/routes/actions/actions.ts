import { Router } from "express";
import {
  sendUserActions,
  executeAction,
  verifyAction,
  verifyToken,
} from "./middlewares";

const actions = Router();

actions.post("/", verifyToken, sendUserActions);
actions.post(
  "/queue",
  verifyToken,
  verifyAction,
  executeAction,
  sendUserActions
);

export { actions };
