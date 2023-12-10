import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { userActions } from "./routes";
import { setupUsersActionsFile } from "./data/fileBasedUserActions";

export function initServer() {
  const app = express();
  const { PORT } = process.env;

  app.use(express.json());
  app.use(cors());

  app.use("/api/user-actions", userActions);

  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    console.error(err.message);
    res.status(400).send(err.message);
  });

  app.listen(PORT, () => {
    setupUsersActionsFile();
    console.log(`listening on port ${PORT}`);
  });
}
