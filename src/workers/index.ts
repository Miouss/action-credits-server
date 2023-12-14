import { DataProviderFactory } from "../data";
import dotenv from "dotenv";
import { executeActionDelay } from "./executor";
import { refreshCreditsDelay } from "./refresher";
dotenv.config();

await DataProviderFactory().init();

refreshCreditsDelay();
executeActionDelay();
