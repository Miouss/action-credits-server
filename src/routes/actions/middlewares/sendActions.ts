import { Request, Response, NextFunction } from "express";
import { getUserActions } from "../../../data/utils";

export async function sendActions(
  req: Request,
  res: Response,
  __: NextFunction
) {
  const actions = await getUserActions(req.body.username);
  res.json(actions);
}
