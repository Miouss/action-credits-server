import { DataProviderFactory } from "../data";
import { ActionName } from "../types/enums";
import { Queue } from "../types/types";
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
    pending: [ActionName.INVITE, ActionName.SEND_MESSAGE],
    executed: [],
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
    it("should add an action to the pending queue", async () => {
      // Arrange
      const actionName = ActionName.INVITE;

      // Act
      await addActionToQueue(actionName);

      // Assert
      expect(queue.pending).toHaveLength(3);
      expect(queue.pending[2]).toEqual(ActionName.INVITE);
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
    it("should return true when there is an action in the pending queue", () => {
      // Arrange
      const queue: Queue = {
        pending: [ActionName.INVITE],
        executed: [],
      };

      // Act
      const result = hasAnyActionInQueue(queue.pending);

      // Assert
      expect(result).toEqual(true);
    });

    it("should return false when there is no action in the pending queue", () => {
      // Arrange
      const emptyQueue = {
        pending: [],
        executed: [],
      };

      // Act
      const result = hasAnyActionInQueue(emptyQueue.pending);

      // Assert
      expect(result).toEqual(false);
    });
  });

  describe("findNextExecutableAction", () => {
    it("should return the next executable action when it exists", () => {
      // Arrange
      const expectedAction = {
        queueActionToExecuteIndex: 0,
        executableAction: {
          name: ActionName.INVITE,
          credits: 1,
        },
      };

      // Act
      const result = findNextExecutableAction(actions, queue.pending);

      // Assert
      expect(result).toEqual(expectedAction);
    });

    it("should return null when there is no next executable action", () => {
      // Arrange
      const emptyQueue = {
        pending: [],
        executed: [],
      };

      // Act
      const result = findNextExecutableAction(actions, emptyQueue.pending);

      // Assert
      expect(result).toBeNull();
    });
  });
});
