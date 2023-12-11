import { Request, Response, NextFunction } from "express";
import { DataProviderFactory } from "../../../../data";
import { filterQueue } from "../../../../services/queue";

export async function sendFilteredQueue(
  req: Request,
  res: Response,
  _: NextFunction
) {
  const maxPendingActions = parseInt(req.query.maxPendingActions as string);
  const maxExecutedActions = parseInt(req.query.maxExecutedActions as string);

  if (isNaN(maxPendingActions) || isNaN(maxExecutedActions))
    throw new Error("Invalid query parameters");

  if (maxPendingActions < 0 || maxExecutedActions < 0 )
    throw new Error("Invalid query parameters");

  const queue = await DataProviderFactory().queue.get();

  const filteredQueue = filterQueue(
    queue,
    maxPendingActions,
    maxExecutedActions,
  );

  
  res.json(filteredQueue);
}