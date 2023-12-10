import { Request, Response, NextFunction } from "express";
import { EXECUTION_INTERVAL, REFRESH_CREDITS_INTERVAL } from "../../../config";

export function sendRefreshInterval(_: Request, res: Response, __: NextFunction) {
  res.status(200).json({
    execution: EXECUTION_INTERVAL,
    credits: REFRESH_CREDITS_INTERVAL,
  });
}
