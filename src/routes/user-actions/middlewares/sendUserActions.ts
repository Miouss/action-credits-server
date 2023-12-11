import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data";
import { UserActions } from "../../../types/types";

export async function sendUserActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
  const userActions = await UserActionsFactory().get();

  userActions.queue.items = filteredQueue(userActions);

  res.json(userActions);
}


// return all queue page starting from the previous page of the action that will be executed
function filteredQueue(userActions: UserActions) {
  let filteredQueue = [];

  for (
    let i = Math.max(0, userActions.queue.nextActionPageIndex - 1);
    i < userActions.queue.items.length;
    i++
  ) {
    filteredQueue.push(userActions.queue.items[i]);
  }

  return filteredQueue;
}
