import { Queue } from "../../types/types";
import jsonfile from "jsonfile";

const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  return await jsonfile.readFile(QUEUE_FILE_PATH);
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
