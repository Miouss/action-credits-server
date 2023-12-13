import { DataProviderFactory } from "../data";
import { executeActionEachInterval } from "./executor";
import dotenv from "dotenv";
import { refreshCreditsDelay } from "./refresherRefreshCreditsDelay";
dotenv.config();

await DataProviderFactory().init();

refreshCreditsDelay(await DataProviderFactory().actions.get());
executeActionEachInterval();
