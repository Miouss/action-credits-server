import { Request, Response, NextFunction } from "express";
import { DataProviderFactory } from "../../../../data";
import { ActionStatus } from "../../../../types/enums";

export async function sendFilteredQueue(
  req: Request,
  res: Response,
  _: NextFunction
) {
  const statuses = req.query.statuses as string;
  const count = parseInt(req.query.count as string);
  const parsedStatuses = statuses
    ? (statuses.split(",") as ActionStatus[])
    : undefined;

  const queue = await DataProviderFactory().queue.getQueueItemsByActionStatus(
    count,
    parsedStatuses!
  );

  res.json(queue);
}
