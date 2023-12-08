import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function verifyToken(req: Request, res: Response, next: NextFunction) {
  const { token } = req.body;
  const decoded = jwt.verify(token, process.env.JWT_SECRET!);
  res.locals.username = (decoded as { username: string }).username;

  next();
}
