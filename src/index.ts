import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { Request, Response, NextFunction } from "express";
import { actions } from "./routes";
import jsonfile from "jsonfile";

import dotenv from "dotenv";
import { ActionName } from "./types";
dotenv.config();

const app = express();
const port = 3001;

app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/actions", actions);

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error(err.message);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  setupActions();
  console.log(`listening on port ${port}`);
});

async function setupActions() {
  try {
    const obj = await jsonfile.readFile("./data/actions.json");
    console.dir(obj);
  } catch (err) {
    await jsonfile.writeFile(
      "./data/actions.json",
      Object.values(ActionName).map((name) => ({
        name,
        credits: randomMinPercent(5, 80),
      }))
    );
  }
}

function randomMinPercent(max: number, percent: number) {
  const min = Math.ceil(max * (percent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}
