import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import { config, queue, actions } from "./routes";
import dotenv from "dotenv";
dotenv.config();

initServer();

function initServer() {
  const app = express();
  const { PORT } = process.env || 3001;

  app.use(express.json());
  app.use(cors());

  app.use("/api/config", config);
  app.use("/api/queue", queue);
  app.use("/api/actions", actions);

  app.use((err: any, _: Request, res: Response, __: NextFunction) => {
    console.error(err.message);
    res.status(400).send(err.message);
  });

  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
  });
}
