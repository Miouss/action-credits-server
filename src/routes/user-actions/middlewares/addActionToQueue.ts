import { Request, Response, NextFunction } from "express";
import { ActionName } from "../../../types/enums";
import { addActionToQueue as add } from "../../../services/queue";

export async function addActionToQueue(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  await add(actionName);

  next();
}
