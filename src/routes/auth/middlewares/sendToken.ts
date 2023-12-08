import { Request, Response, NextFunction } from "express";

export function sendToken(_: Request, res: Response, __: NextFunction) {
  const { token } = res.locals;
  res.status(200).json({ token });
}
