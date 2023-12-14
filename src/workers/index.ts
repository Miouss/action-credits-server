import { DataProviderFactory } from "../data";
import { executeActionEachInterval } from "./executor";
import dotenv from "dotenv";
import { refreshCreditsDelay } from "./refresher";
dotenv.config();

await DataProviderFactory().init();

refreshCreditsDelay();
executeActionEachInterval();
