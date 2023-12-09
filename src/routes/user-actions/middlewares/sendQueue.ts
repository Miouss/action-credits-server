import { Request, Response, NextFunction } from "express";
import { getQueue } from "../../../data/utils";

export async function sendQueue(_: Request, res: Response, __: NextFunction) {
  const queue = await getQueue();
  res.status(200).json({ queue });
}
