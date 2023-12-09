import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data/utils";

export async function sendQueue(_: Request, res: Response, __: NextFunction) {
  const queue = await UserActionsFactory().queue.get();
  res.status(200).json({ queue });
}
