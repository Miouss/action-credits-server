import { Request, Response, NextFunction } from "express";
import { consumeAction } from "../../../data/utils";
import { User } from "../../../enums";

export async function executeAction(
  _: Request,
  res: Response,
  next: NextFunction
) {
  const { username } = res.locals as {
    username: User;
  };

  await consumeAction(username);
  next();
}
