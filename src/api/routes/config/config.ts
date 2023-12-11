import { Router } from "express";
import { sendConfig } from "./middlewares";

const config = Router();

config.get("/", sendConfig);

export { config };
