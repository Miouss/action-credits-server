import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data";

export async function sendUserActions(
  req: Request,
  res: Response,
  __: NextFunction
) {
  const userActions = await UserActionsFactory().get();
  const { nextActionIndex } = userActions.queue;
  const maxPendingActions = parseInt(req.query.maxPendingActions as string);
  const maxExecutedActions = parseInt(req.query.maxExecutedActions as string);

  const pendingActions = userActions.queue.items.slice(
    nextActionIndex,
    Math.min(
      nextActionIndex + maxPendingActions,
      userActions.queue.items.length
    )
  );

  const executedActions = userActions.queue.items.slice(
    nextActionIndex -
      maxExecutedActions -
      (maxExecutedActions - pendingActions.length),
    nextActionIndex
  );

  const nbActionsLeft =
    userActions.queue.items.length - pendingActions.length - nextActionIndex;

  userActions.queue.items = [...executedActions, ...pendingActions];

  res.json({
    userActions,
    nbActionsLeft,
  });
}
