import Ajv, { JSONSchemaType } from "ajv";
import { ActionName, ActionStatus } from "../types/enums";
import { Action, QueueItem, Queue, UserActions } from "../types/types";
import { UserActionsFactory } from "./userActionsFactory";

export async function validateFile() {
  const ajv = new Ajv();
  const actionSchema: JSONSchemaType<Action> = {
    type: "object",
    properties: {
      name: { type: "string", enum: Object.values(ActionName) },
      credits: { type: "number" },
    },
    required: ["name", "credits"],
    additionalProperties: false,
  };

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
      items: { type: "array", items: queueItemsSchema },
      nextActionIndex: { type: "number" },
    },
    required: ["items", "nextActionIndex"],
  };

  const schema: JSONSchemaType<UserActions> = {
    type: "object",
    properties: {
      actions: { type: "array", items: actionSchema },
      queue: queueSchema,
      id: { type: "string" },
    },
    required: ["actions", "queue", "id"],
  };

  const validate = ajv.compile(schema);
  const usersActions = await UserActionsFactory().get();

  if (!validate(usersActions)) {
    throw new Error();
  }
}
