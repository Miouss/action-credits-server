import { Router } from "express";
import {
  sendActions,
  executeAction,
  verifyAction,
} from "./middlewares";

const actions = Router();

actions.get("/", sendActions);
actions.post("/queue", verifyAction, executeAction);

export { actions };
