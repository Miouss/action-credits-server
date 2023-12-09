import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

import { userActions } from "./routes";
import { setupUsersActionsFile } from "./data/utils";

export function initServer() {
  const app = express();
  const port = 3001;

  app.use(express.json());
  app.use(cors());

  app.use("/api/user-actions", userActions);

  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    console.error(err.message);
    res.status(400).send(err.message);
  });

  app.listen(port, () => {
    setupUsersActionsFile();
    console.log(`listening on port ${port}`);
  });
}
