import { DataProviderFactory } from "../data";
import { ActionName, ActionStatus } from "../types/enums";
import {
  addActionToQueue,
  hasAnyActionInQueue,
  verifyValidAction,
  findNextExecutableAction,
} from "./queue";

jest.mock("../data", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("queue", () => {
  // Arrange
  const actions = {
    items: [
      { name: ActionName.INVITE, credits: 1 },
      { name: ActionName.SEND_MESSAGE, credits: 11 },
    ],
    id: "122",
  };

  const queue = {
    items: [
      { name: ActionName.INVITE, status: ActionStatus.PENDING },
      { name: ActionName.SEND_MESSAGE, status: ActionStatus.PENDING },
    ],
    nextActionIndex: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    (DataProviderFactory as jest.Mock).mockReturnValue({
      actions: {
        get: jest.fn(() => actions),
      },
      queue: {
        get: jest.fn(() => Promise.resolve(queue)),
        update: jest.fn(() => Promise.resolve()),
      },
    });
  });

  describe("addActionToQueue", () => {
    it("should add an action to the queue", async () => {
      // Arrange
      const actionName = ActionName.INVITE;

      // Act
      await addActionToQueue(actionName);

      // Assert
      expect(queue.items).toHaveLength(3);
      expect(queue.items[2]).toEqual({
        name: actionName,
        status: ActionStatus.PENDING,
      });
      expect(DataProviderFactory().queue.update).toHaveBeenCalledWith(queue);
    });
  });

  describe("verifyValidAction", () => {
    it.each([
      [ActionName.INVITE, 0],
      [ActionName.SEND_MESSAGE, 1],
    ])(
      "should return the valid action when it exists",
      async (actionName, expectedObjectIndex) => {
        // Act
        const result = await verifyValidAction(actionName);

        // Assert
        expect(result).toEqual(actions.items[expectedObjectIndex]);
        expect(DataProviderFactory().actions.get).toHaveBeenCalledTimes(1);
      }
    );

    it("should throw an error when the action is invalid", async () => {
      // Arrange
      const actionName = ActionName.VISIT;

      // Assert
      await expect(verifyValidAction(actionName)).rejects.toThrow(
        "Invalid action"
      );
      expect(DataProviderFactory().actions.get).toHaveBeenCalledTimes(1);
    });
  });

  describe("hasAnyActionInQueue", () => {
    it("should return true when there is an action in the queue", () => {
      // Arrange
      const queue = {
        items: [{ name: ActionName.INVITE, status: ActionStatus.PENDING }],
        nextActionIndex: 0,
      };

      // Act
      const result = hasAnyActionInQueue(queue);

      // Assert
      expect(result).toEqual(true);
    });

    it("should return false when there is no action in the queue", () => {
      // Arrange
      const queue = {
        items: [],
        nextActionIndex: 0,
      };

      // Act
      const result = hasAnyActionInQueue(queue);

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe("findNextExecutableAction", () => {
    it("should return the next executable action when it exists", () => {
      // Arrange
      const expectedAction = {
        queueActionToExecute: {
          name: ActionName.INVITE,
          status: ActionStatus.PENDING,
        },
        queueActionToExecuteIndex: 0,
        executableAction: {
          name: ActionName.INVITE,
          credits: 1,
        },
      };

      // Act
      const result = findNextExecutableAction(actions, queue);

      // Assert
      expect(result).toEqual(expectedAction);
    });

    it("should return null when there is no next executable action", () => {
      // Arrange
      const emptyQueue = {
        items: [],
        nextActionIndex: 0,
      };

      // Act
      const result = findNextExecutableAction(actions, emptyQueue);

      // Assert
      expect(result).toBeNull();
    });
  });
});
