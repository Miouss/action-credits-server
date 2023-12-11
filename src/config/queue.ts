import { Queue } from "../types/types";

export const EXECUTION_INTERVAL = 3000; // ms
export const QUEUE_PENDING_ACTION_LIMIT = 3;
export const QUEUE_EXECUTED_ACTION_LIMIT = 3;
export const DEFAULT_QUEUE: Queue = {
  items: [],
  nextActionIndex: 0,
};
