import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { actions, credits } from "./routes";
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());

app.use("/api/credits", credits);
app.use("/api/actions", actions);

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, async () => {
  console.log(`Example app listening on port ${port}`);
});
