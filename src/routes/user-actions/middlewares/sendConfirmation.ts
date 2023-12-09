import { Request, Response, NextFunction } from 'express';

export function sendConfirmation(_: Request, res: Response, __: NextFunction) {
  res.sendStatus(200);
}