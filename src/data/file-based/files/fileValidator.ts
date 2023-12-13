import Ajv, { JSONSchemaType } from "ajv";
import { ActionName } from "../../../types/enums";
import { Action, Actions, Queue } from "../../../types/types";
import { DataProviderFactory } from "../..";

export function FileValidatorFactoryProvider() {
  return {
    queue: validateQueueFile,
    actions: validateActionsFile,
  };
}

async function fileValidator<T>(data: T, schema: JSONSchemaType<T>) {
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
      pending: { type: "array", items: actionNameSchema },
    },
    required: ["executed", "pending"],
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
  };

  fileValidator(actions, actionsSchema);
}

export type FileType = "actions" | "queue";

export async function fileValidationHandler<T>(type: FileType, defaultContent: T) {
  try {
    console.log(`Validating ${type} file...`);
    await FileValidatorFactoryProvider()[type]();
    console.log(`${type} file is valid, no need to create new file`);
  } catch (err) {
    console.log(`${type} file is invalid, creating new file...`);
    await DataProviderFactory()[type].update(defaultContent as Actions & Queue);
    console.log(`${type} file created`);
  }
}
