import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import { actions, auth } from "./routes";

import dotenv from "dotenv";
import { setupUsersActionsFile } from "./data/utils";
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use("/api/actions", actions);
app.use("/api/auth", auth);

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error(err.message);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  setupUsersActionsFile();
  console.log(`listening on port ${port}`);
});
