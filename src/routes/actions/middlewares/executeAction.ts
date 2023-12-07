import { Request, Response, NextFunction } from "express";
import { consumeAction } from "../../../data";

export async function executeAction(
  _: Request,
  res: Response,
  __: NextFunction
) {
  await consumeAction();
  res.sendStatus(200);
}
