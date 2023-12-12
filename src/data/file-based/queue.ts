import { Queue } from "../../types/types";
import jsonfile from "jsonfile";

const QUEUE_FILE_PATH = "./src/data/file-based/files/queue.json";

export async function getQueue(): Promise<Queue> {
  return await jsonfile.readFile(QUEUE_FILE_PATH);
}

export async function getQueueActionsByStatus(
  count: number,
  statuses: string[],
  order: "asc" | "desc"
) {
  const filteredQueue = (await getQueue()).items.filter((action) =>
    statuses.includes(action.status)
  );
  // on veut les 10 prochaines actions en attente, et les 10 dernières actions exécutées
  if (order === "asc") return filteredQueue.slice(0, count);
  else return filteredQueue.slice(-count);
}

export async function updateQueue(queue: Queue) {
  return await jsonfile.writeFile(QUEUE_FILE_PATH, queue);
}
