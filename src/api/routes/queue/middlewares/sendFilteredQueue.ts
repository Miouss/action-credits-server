import { Request, Response, NextFunction } from "express";
import { DataProviderFactory } from "../../../../data";

export async function sendFilteredQueue(
  req: Request,
  res: Response,
  _: NextFunction
) {
  const statuses = req.query.statuses as string;
  const count = parseInt(req.query.count as string);
  const parsedStatuses = statuses ? statuses.split(",") : undefined;
  const order = req.query.order as "asc" | "desc";
  
  const queue = await DataProviderFactory().queue.getQueueActionsByStatus(
    count,
    parsedStatuses!,
    order
  );

  console.log("queue", queue);

  res.json(queue);
}