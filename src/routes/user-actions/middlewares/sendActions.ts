import { Request, Response, NextFunction } from "express";
import { DataProviderFactory } from "../../../data";

export async function sendActions(
  req: Request,
  res: Response,
  _: NextFunction
) {
  const actions = await DataProviderFactory().actions.get();
  const queue = await DataProviderFactory().queue.get();

  const { nextActionIndex } = queue;
  const maxPendingActions = parseInt(req.query.maxPendingActions as string);
  const maxExecutedActions = parseInt(req.query.maxExecutedActions as string);

  if (isNaN(maxPendingActions) || isNaN(maxExecutedActions))
    throw new Error("Invalid query parameters");

  if (maxPendingActions < 0 || maxExecutedActions < 0)
    throw new Error("query parameters must be positive integers");

  const pendingActions = queue.items.slice(
    nextActionIndex,
    Math.min(nextActionIndex + maxPendingActions, queue.items.length)
  );

  const executedActions = queue.items.slice(
    nextActionIndex - maxExecutedActions,
    nextActionIndex
  );

  const nbActionsLeft =
    queue.items.length - pendingActions.length - nextActionIndex;

  queue.items = [...executedActions, ...pendingActions];

  res.json({
    userActions: {
      actions: actions.items,
      id: actions.id,
      queue,
    },
    nbActionsLeft,
  });
}
