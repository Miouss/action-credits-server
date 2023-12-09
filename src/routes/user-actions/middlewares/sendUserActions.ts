import { Request, Response, NextFunction } from "express";
import { getUserActions } from "../../../data/utils";

export async function sendUserActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
  const userActions = await getUserActions();
  res.json(userActions);
}
