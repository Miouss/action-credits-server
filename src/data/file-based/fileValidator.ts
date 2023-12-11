import Ajv, { JSONSchemaType } from "ajv";
import { ActionName, ActionStatus } from "../../types/enums";
import { Action, Actions, QueueItem, Queue } from "../../types/types";
import { DataProviderFactory } from "..";

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

  const queueItemsSchema: JSONSchemaType<QueueItem> = {
    type: "object",
    properties: {
      name: { type: "string", enum: Object.values(ActionName) },
      status: { type: "string", enum: Object.values(ActionStatus) },
    },
    required: ["name", "status"],
  };

  const queueSchema: JSONSchemaType<Queue> = {
    type: "object",
    properties: {
      items: {
        type: "array",
        items: queueItemsSchema,
      },
      nextActionIndex: { type: "number" },
    },
    required: ["items", "nextActionIndex"],
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

export async function fileValidationHandler<T>(
  type: "actions" | "queue",
  update: (data: T) => Promise<void>,
  defaultContent: T
) {
  try {
    console.log(`Validating ${type} file...`);
    await FileValidatorFactoryProvider()[type]();
    console.log(`${type} file is valid, no need to create new file`);
  } catch (err) {
    console.log(`${type} file is invalid, creating new file...`);
    await update(defaultContent);
    console.log(`${type} file created`);
  }
}