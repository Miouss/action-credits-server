import { DataProviderType } from "./data";

export const DATA_PROVIDER_TYPE: DataProviderType = "file";

const ONE_HOUR = 1000 * 60 * 60;

export const REFRESH_CREDITS_INTERVAL = ONE_HOUR * 24; // ms

export const EXECUTION_INTERVAL = ONE_HOUR * 2; // ms
