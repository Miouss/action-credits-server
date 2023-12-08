import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function createToken(req: Request, res: Response, next: NextFunction) {
  const { username } = req.body;
  const token = jwt.sign({ username }, process.env.JWT_SECRET!);
  res.locals.token = token;
  next();
}
