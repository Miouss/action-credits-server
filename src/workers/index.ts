import { DataProviderFactory } from "../data";
import { executeActionEachInterval } from "./actionExecutor";
import { refreshCreditsDelay } from "./actionsRefresher";
import dotenv from "dotenv";
dotenv.config();

await DataProviderFactory().init();

refreshCreditsDelay(await DataProviderFactory().actions.get());
executeActionEachInterval();
