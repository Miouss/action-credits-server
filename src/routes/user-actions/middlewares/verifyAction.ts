import { Request, Response, NextFunction } from "express";
import { ActionName } from "../../../types/enums";
import { Action } from "../../../types/types";
import { DataProviderFactory } from "../../../data";
import { findActionByName } from "../../../services/actions";

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
  const actions = await DataProviderFactory().actions.get();
  const validAction = findActionByName(actions, actionName);

  if (!validAction) throw new Error("Invalid action");

  return validAction;
}

async function verifyCredits(userAction: Action) {
  if (userAction.credits < 1) throw new Error("Not enough credits");
}
