import { Request, Response, NextFunction } from "express";
import { verifyValidAction } from "../../../../services/queue";
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
    await verifyValidAction(actionName);

    next();
  } catch (err) {
    next(err);
  }
}
