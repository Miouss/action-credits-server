import { Router } from "express";

const credits = Router();

credits.get("/", (_, res) => {
  const MAX_CREDITS = 100;
  const MIN_CREDITS = MAX_CREDITS * 0.8;

  const credits = Math.floor(
    Math.random() * (MAX_CREDITS - MIN_CREDITS) + MIN_CREDITS
  );

  res.json({ credits });
});

export { credits };
