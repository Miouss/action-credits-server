import { Request, Response, NextFunction } from "express";
import { ActionName, User } from "../../../enums";
import { addActionToUserActionQueue } from "../../../data/utils";

export async function addActionToQueue(
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

  await addActionToUserActionQueue(actionName, username);

  next();
}
