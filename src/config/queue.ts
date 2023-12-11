import { Queue } from "../types/types";

export const EXECUTION_INTERVAL = 3000; // ms
export const DEFAULT_QUEUE: Queue = {
  items: [],
  nextActionIndex: 0,
};
