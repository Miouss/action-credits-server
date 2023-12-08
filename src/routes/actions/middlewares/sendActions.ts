import { Request, Response, NextFunction } from "express";
import { getUserActions } from "../../../data/utils";

export async function sendActions(_: Request, res: Response, __: NextFunction) {
  const actions = await getUserActions(res.locals.username);
  res.json(actions);
}
