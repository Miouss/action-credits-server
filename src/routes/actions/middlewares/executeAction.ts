import { Request, Response, NextFunction } from "express";
import { consumeAction } from "../../../data/utils";
import { ActionName, User } from "../../../enums";

export async function executeAction(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  const { username } = res.locals as {
    username: User;
  };

  await consumeAction(username, actionName);
  next();
}
