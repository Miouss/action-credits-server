import { Request, Response, NextFunction } from "express";
import { ActionName } from "../../../enums";
import { Action } from "../../../types";
import { UserActionsFactory } from "../../../data/utils";

export async function verifyAction(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  try {
    const validAction = await verifyValidAction(actionName);
    verifyCredits(validAction);

    next();
  } catch (err) {
    next(err);
  }
}

async function verifyValidAction(actionName: ActionName) {
  const validAction = await UserActionsFactory().actions.findByName(actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

async function verifyCredits(userAction: Action) {
  if (userAction.credits < 1) throw new Error("Not enough credits");
}
