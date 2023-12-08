import { Request, Response, NextFunction } from "express";
import { consumeAction } from "../../../data/utils";
import { ActionName, User } from "../../../enums";

export async function executeAction(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName, username } = req.body as {
    actionName: ActionName;
    username: User;
  };

  await consumeAction(username, actionName);
  next();
}
