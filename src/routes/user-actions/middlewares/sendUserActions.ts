import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data";

export async function sendUserActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
  const userActions = await UserActionsFactory().get();
  res.json(userActions);
}
