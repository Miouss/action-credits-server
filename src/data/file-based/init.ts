import Ajv, { JSONSchemaType } from "ajv";
import { DataProviderFactory } from "..";
import { ActionName } from "../../types/enums";
import { Queue, Actions, Action } from "../../types/types";
import { FileTypes, defaultContent } from "./config";
import { FileValidatorFactoryProvider } from ".";
import lockfile from "proper-lockfile";

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
    await DataProviderFactory()[type].create(
      defaultContent[type] as Actions & Queue
    );
    console.log(`${type} file created`);
  }
}

function fileValidator<T>(data: T, schema: JSONSchemaType<T>) {
  const ajv = new Ajv();

  const validate = ajv.compile(schema);

  if (!validate(data)) {
    throw new Error();
  }
}

export async function validateQueueFile() {
  const queue = await DataProviderFactory().queue.get();

  const actionNameSchema: JSONSchemaType<ActionName> = {
    type: "string",
    enum: Object.values(ActionName),
  };

  const queueSchema: JSONSchemaType<Queue> = {
    type: "object",
    properties: {
      executed: {
        type: "array",
        items: actionNameSchema,
      },
      pending: {
        type: "array",
        items: actionNameSchema,
      },
    },
    required: ["executed", "pending"],
    additionalProperties: false,
  };

  fileValidator(queue, queueSchema);
}

export async function validateActionsFile() {
  const actions = await DataProviderFactory().actions.get();

  const actionSchema: JSONSchemaType<Action> = {
    type: "object",
    properties: {
      name: { type: "string", enum: Object.values(ActionName) },
      credits: { type: "number" },
    },
    required: ["name", "credits"],
    additionalProperties: false,
  };

  const actionsSchema: JSONSchemaType<Actions> = {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: actionSchema,
      },
      id: { type: "string" },
    },
    required: ["items", "id"],
    additionalProperties: false,
  };

  fileValidator(actions, actionsSchema);
}

export function waitForFileAccess(path: string) {
  return lockfile.lock(path, {
    retries: {
      retries: 10,
      minTimeout: 100,
      maxTimeout: 1000,
    },
  });
}
