import { Request, Response, NextFunction } from "express";
import { consumeAction } from "../../../data";

export async function executeAction(
  req: Request,
  res: Response,
  __: NextFunction
) {
  const action = req.body.action;

  await consumeAction(action);
  res.sendStatus(200);
}
