import { Request, Response, NextFunction } from "express";
import { getUserAction } from "../../../data/utils";
import { ActionName, User } from "../../../enums";
import { Action } from "../../../types";

export async function verifyAction(
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

  try {
    const validAction = await verifyValidAction(username, actionName);
    verifyCredits(validAction);

    next();
  } catch (err) {
    next(err);
  }
}

async function verifyValidAction(username: User, actionName: ActionName) {
  const validAction = await getUserAction(username, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

async function verifyCredits(userAction: Action) {
  if (userAction.credits < 1) throw new Error("Not enough credits");
}
