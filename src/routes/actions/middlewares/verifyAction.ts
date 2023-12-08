import { Request, Response, NextFunction } from "express";
import { getUserAction } from "../../../data/utils";
import { ActionName, User } from "../../../enums";

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
    await isActionValid(username, actionName);
    next();
  } catch (err) {
    next(err);
  }
}

async function isActionValid(username: User, actionName: ActionName) {
  const validAction = await getUserAction(username, actionName);

  if (!validAction) throw new Error("Invalid action");

  const hasEnoughCredits = validAction.credits > 0;

  if (!hasEnoughCredits) throw new Error("Not enough credits");

  return true;
}
