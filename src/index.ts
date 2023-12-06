import express from "express";
import cors from "cors";
import { Request, Response, NextFunction } from "express";

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors());

app.get("/", (_, res) => {
  res.send("Hello World!");
});

app.post("/api/consume", (req, res) => {
  const { credits } = req.body;
  if (credits <= 0) {
    throw new Error("No credits left");
  } else {
    res.status(200).send("Credits consumed");
  }
});

app.use((err: any, _: Request, res: Response, __: NextFunction) => {
  console.error(err.stack);
  res.status(400).send(err.message);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
