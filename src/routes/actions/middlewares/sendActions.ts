import { Request, Response, NextFunction } from "express";
import { getAllActions } from "../../../data";

export async function sendActions(_: Request, res: Response, __: NextFunction) {
  const actions = await getAllActions();
  console.log(actions);
  res.json(actions);
}
