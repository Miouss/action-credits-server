import { Request, Response, NextFunction } from "express";
import { getUserQueue } from "../../../data/utils";

export async function sendQueue(_: Request, res: Response, __: NextFunction) {
  const queue = await getUserQueue(res.locals.username);
  res.status(200).json({ queue });
}
