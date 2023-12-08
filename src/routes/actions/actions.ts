import { Router } from "express";
import { sendActions, executeAction, verifyAction } from "./middlewares";

const actions = Router();

actions.post("/", sendActions);
actions.post("/queue", verifyAction, executeAction, sendActions);

export { actions };
