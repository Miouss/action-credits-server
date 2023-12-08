import { Router } from "express";
import { verifyUser, createToken, sendToken } from "./middlewares";
const auth = Router();

auth.post("/", verifyUser, createToken, sendToken);

export { auth };
