import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data";

export async function sendUserActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
console.log("Hello world");

  const userActions = await UserActionsFactory().get();
  res.json(userActions);
}
