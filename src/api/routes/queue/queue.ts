import { Router } from "express";
import {
  addActionToQueue,
  verifyAction,
  sendFilteredQueue,
} from "./middlewares";

const queue = Router();

queue.patch("/", verifyAction, addActionToQueue, sendFilteredQueue);
queue.get("/", sendFilteredQueue);

export { queue };
