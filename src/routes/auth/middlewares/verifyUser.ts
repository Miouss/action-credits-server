import { Request, Response, NextFunction } from "express";
import { User } from "../../../enums";

export function verifyUser(req: Request, _: Response, next: NextFunction) {
    const { username } = req.body;
    console.log(req.body);
    console.log(Object.values(User));
    
    if (!isValidUser(username)) {
        return next(new Error("Invalid user"));
    }
    next();
}

function isValidUser(username: User) {
  return Object.values(User).includes(username);
}
