import { Router } from "express";
import { sendActions, executeAction, verifyAction, verifyToken } from "./middlewares";

const actions = Router();

actions.post("/", verifyToken, sendActions);
actions.post("/queue", verifyToken, verifyAction, executeAction, sendActions);

export { actions };
