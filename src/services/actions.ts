import { ActionName } from "../types/enums";
import { Action, Actions, UserActions } from "../types/types";
import { v4 as uuidv4 } from "uuid";

const CREDITS = 100;
const MAX_CREDITS_PERCENT = 100;
const MIN_CREDITS_PERCENT = 80;

export function findActionByName(actions: Actions, actionName: ActionName) {
  return actions.items.find(({ name }) => name === actionName)!;
}

export function hasUsedCredits(
  userActions: UserActions,
  orignalUserActions: UserActions
) {
  return (
    JSON.stringify(orignalUserActions.actions) !==
    JSON.stringify(userActions.actions)
  );
}

export function verifyCredits(action: Action) {
  const hasEnoughCredits = action.credits > 0;

  if (!hasEnoughCredits) throw new Error("Not enough credits");
}

export function randomizeCredits(
  value: number = CREDITS,
  minPercent: number = MIN_CREDITS_PERCENT,
  maxPercent: number = MAX_CREDITS_PERCENT
) {
  const max = Math.floor(value * (maxPercent / 100));
  const min = Math.ceil(max * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}


export function randomUUID() {
  return uuidv4();
}