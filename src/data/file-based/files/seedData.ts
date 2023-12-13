import { DataProviderFactory } from "../..";
import { Queue, Actions } from "../../../types/types";
import { FileTypes, defaultContent } from "./config";
import { FileValidatorFactoryProvider } from "./fileValidator";



export async function seedAllData() {
  await Promise.all([seedData(FileTypes.ACTIONS), seedData(FileTypes.QUEUE)]);
}

export async function seedData(type: FileTypes) {
  try {
    console.log(`Validating ${type} file...`);
    await FileValidatorFactoryProvider()[type]();
    console.log(`${type} file is valid, no need to create new file`);
  } catch (err) {
    console.log(`${type} file is invalid, creating new file...`);
    await DataProviderFactory()[type].update(
      defaultContent[type] as Actions & Queue
    );
    console.log(`${type} file created`);
  }
}
