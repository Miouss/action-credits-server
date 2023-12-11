import { Request, Response, NextFunction } from "express";
import { verifyCredits } from "../../../../services/actions";
import { findValidAction } from "../../../../services/queue";
import { ActionName } from "../../../../types/enums";

export async function verifyAction(
  req: Request,
  _: Response,
  next: NextFunction
) {
  const { actionName } = req.body as {
    actionName: ActionName;
  };

  try {
    const validAction = await findValidAction(actionName);
    verifyCredits(validAction);

    next();
  } catch (err) {
    next(err);
  }
}
