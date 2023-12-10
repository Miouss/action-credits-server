import { Request, Response, NextFunction } from "express";
import { UserActionsFactory } from "../../../data/utils";
import { EXECUTION_INTERVAL, REFRESH_CREDITS_INTERVAL } from "../../../config";

export async function sendUserActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
  const userActions = await UserActionsFactory().get();
  res.json({ userActions, executionInterval: EXECUTION_INTERVAL, refreshCreditsInterval: REFRESH_CREDITS_INTERVAL });
}
