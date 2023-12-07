import { Request, Response, NextFunction } from "express";
import { getAllActions } from "../../../data";

export async function verifyAction(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const action = req.body.action;

  try {
    await isActionValid(action);
    next();
  } catch (err) {
    next(err);
  }
}

async function isActionValid(actionName: string) {
  const actions = await getAllActions();
  const validAction = actions.find(({ name }) => name === actionName);

  if (!validAction) throw new Error("Invalid action");

  const hasEnoughCredits = validAction.credits > 0;

  if (!hasEnoughCredits) throw new Error("Not enough credits");

  return true;
}
