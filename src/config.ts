import { DataProviderType } from "./data";

export const DATA_PROVIDER_TYPE: DataProviderType = "file";

const ONE_SECOND = 1000;

const ONE_MINUTE = ONE_SECOND * 60;

const ONE_HOUR = ONE_MINUTE * 60;

const ONE_DAY = ONE_HOUR * 24;

export const REFRESH_CREDITS_INTERVAL = ONE_DAY;

export const EXECUTION_INTERVAL = ONE_HOUR * 2;
