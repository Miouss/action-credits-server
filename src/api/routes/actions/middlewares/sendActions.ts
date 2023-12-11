import { Request, Response, NextFunction } from "express";
import { DataProviderFactory } from "../../../../data";

export async function sendActions(
  _: Request,
  res: Response,
  __: NextFunction
) {
  const actions = await DataProviderFactory().actions.get();

  res.json(actions);
}
