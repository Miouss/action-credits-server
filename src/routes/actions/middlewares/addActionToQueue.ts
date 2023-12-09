import { Request, Response, NextFunction } from "express";
import { ActionName } from "../../../enums";
import { addAction } from "../../../data/utils";

export async function addActionToQueue(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  await addAction(actionName);

  next();
}
