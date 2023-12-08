export const CREDITS = 100;
export const MAX_CREDITS_PERCENT = 100;
export const MIN_CREDITS_PERCENT = 80;

export const REFRESH_CREDITS_INTERVAL = 5000;

export function randomizeCredits(
  value: number = CREDITS,
  minPercent: number = MIN_CREDITS_PERCENT,
  maxPercent: number = MAX_CREDITS_PERCENT
) {
  const max = Math.floor(value * (maxPercent / 100));
  const min = Math.ceil(max * (minPercent / 100));

  return Math.floor(Math.random() * (max - min + 1)) + min;
}