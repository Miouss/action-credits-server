import { Router } from "express";
import { sendActions } from "./middlewares";

const actions = Router();

actions.get("/", sendActions);

export { actions };
