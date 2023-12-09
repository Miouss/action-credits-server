import { Request, Response, NextFunction } from "express";
import { ActionName } from "../../../types/enums";
import { UserActionsFactory } from "../../../data/utils";

export async function addActionToQueue(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  await UserActionsFactory().queue.add(actionName);

  next();
}
