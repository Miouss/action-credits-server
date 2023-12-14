import { DataProviderFactory } from "../data";
import { ActionName } from "../types/enums";
import { Actions, Queue } from "../types/types";
import {
  executeAction,
  findActionByName,
  hasUsedCredits,
  randomizeCredits,
  resetCredits,
  verifyCredits,
} from "./actions";

jest.mock("../data", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("actions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("executeAction", () => {
    const queueWithPendingAction: Queue = {
      pending: [ActionName.INVITE, ActionName.SEND_MESSAGE, ActionName.VISIT],
      executed: [],
    };

    const actionsAllExecutable: Actions = {
      items: [
        {
          name: ActionName.INVITE,
          credits: 10,
        },
        {
          name: ActionName.SEND_MESSAGE,
          credits: 20,
        },
        {
          name: ActionName.VISIT,
          credits: 30,
        },
      ],
      id: "123",
    };

    beforeEach(() => {
      jest.clearAllMocks();
    });

    it("should call the update function for actions and queue with the correct data after an execution without blocked action in the queue", async () => {
      // Arrange

      const queueBeforeExecution: Queue = deepCopy(queueWithPendingAction);

      const queueAfterExecution: Queue = {
        pending: [ActionName.SEND_MESSAGE, ActionName.VISIT],
        executed: [ActionName.INVITE],
      };

      mockDataProviderFactory(actionsAllExecutable, queueBeforeExecution);

      const actionsAfterExecution = deepCopy(actionsAllExecutable);

      actionsAfterExecution.items[0].credits--;

      // Act
      await executeAction();

      // Assert
      expect(DataProviderFactory().actions.update).toHaveBeenCalledWith(
        actionsAfterExecution
      );
      expect(DataProviderFactory().queue.update).toHaveBeenCalledWith(
        queueAfterExecution
      );
    });

    it("should call the update function for actions and queue with the correct data after an execution with a blocked action in the queue", async () => {
      // Arrange
      const actionsWithBlockingAction: Actions = {
        items: [
          {
            name: ActionName.INVITE,
            credits: 0,
          },
          {
            name: ActionName.SEND_MESSAGE,
            credits: 20,
          },
          {
            name: ActionName.VISIT,
            credits: 30,
          },
        ],
        id: "123",
      };

      const queueBeforeExecution: Queue = deepCopy(queueWithPendingAction);
      const queueAfterExecution: Queue = {
        pending: [ActionName.INVITE, ActionName.VISIT],
        executed: [ActionName.SEND_MESSAGE],
      };

      mockDataProviderFactory(actionsWithBlockingAction, queueBeforeExecution);

      // Act
      await executeAction();

      // Assert
      expect(DataProviderFactory().actions.update).toHaveBeenCalledWith(
        actionsWithBlockingAction
      );
      expect(DataProviderFactory().queue.update).toHaveBeenCalledWith(
        queueAfterExecution
      );
    });

    it("should not update neither actions or queue data when there is no action to execute", async () => {
      // Arrange
      const queueWithoutPendingActions: Queue = {
        pending: [],
        executed: [
          ActionName.INVITE,
          ActionName.SEND_MESSAGE,
          ActionName.VISIT,
        ],
      };

      mockDataProviderFactory(actionsAllExecutable, queueWithoutPendingActions);

      // Act
      await executeAction();

      // Assert
      expect(DataProviderFactory().actions.update).not.toHaveBeenCalled();
      expect(DataProviderFactory().queue.update).not.toHaveBeenCalled();
    });
  });
  describe("findActionByName", () => {
    const credits = 3;
    const actions = {
      items: [
        { name: ActionName.INVITE, credits },
        { name: ActionName.SEND_MESSAGE, credits },
      ],
      id: "123",
    };

    it.each([[ActionName.INVITE], [ActionName.SEND_MESSAGE]])(
      "should return the action corresponding to the action name",
      (actionName) => {
        // Act
        const result = findActionByName(actions, actionName);

        // Assert
        expect(result).toEqual({ name: actionName, credits });
      }
    );

    it("should return undefined if no action with the corresponding action name is found", () => {
      // Arrange
      const actionName = ActionName.VISIT;

      // Act
      const result = findActionByName(actions, actionName);

      // Assert
      expect(result).toBeUndefined();
    });
  });
  describe("resetCredits", () => {
    const previousActions: Actions = {
      id: "id",
      items: [
        {
          name: ActionName.INVITE,
          credits: 10,
        },
        {
          name: ActionName.SEND_MESSAGE,
          credits: 20,
        },
      ],
    };

    const currentActionsWithoutUsedCredits: Actions = JSON.parse(
      JSON.stringify(previousActions)
    );

    const currentActionsWithUsedCredits: Actions = {
      id: "id",
      items: [
        {
          name: ActionName.INVITE,
          credits: 0,
        },
        {
          name: ActionName.SEND_MESSAGE,
          credits: 0,
        },
      ],
    };

    it("should not update the actions data and not modify the actions object if no credits have been used", async () => {
      // Arrange
      (DataProviderFactory as jest.Mock).mockReturnValue({
        actions: {
          get: jest.fn().mockResolvedValue(currentActionsWithoutUsedCredits),
          update: jest.fn(),
        },
      });

      const previousId = previousActions.id;
      const previousCredits1 = previousActions.items[0].credits;
      const previousCredits2 = previousActions.items[1].credits;

      // Act
      await resetCredits(previousActions);

      // Assert
      expect(DataProviderFactory().actions.update).not.toHaveBeenCalled();
      expect(previousId).toBe(currentActionsWithoutUsedCredits.id);
      expect(currentActionsWithoutUsedCredits.items[0].credits).toBe(
        previousCredits1
      );
      expect(currentActionsWithoutUsedCredits.items[1].credits).toBe(
        previousCredits2
      );
    });

    it("should update the actions data and modify the actions object with new credits and a new id", async () => {
      // Arrange
      (DataProviderFactory as jest.Mock).mockReturnValue({
        actions: {
          get: jest.fn().mockResolvedValue(currentActionsWithUsedCredits),
          update: jest.fn(),
        },
      });

      const previousId = previousActions.id;

      // Act
      await resetCredits(previousActions);

      // Assert
      expect(DataProviderFactory().actions.update).toHaveBeenCalledTimes(1);
      expect(DataProviderFactory().actions.update).toHaveBeenCalledWith(
        currentActionsWithUsedCredits
      );
      expect(previousId).not.toBe(currentActionsWithUsedCredits.id);
      expect(currentActionsWithUsedCredits.items[0].credits).toBeGreaterThan(0);
      expect(currentActionsWithUsedCredits.items[1].credits).toBeGreaterThan(0);
    });
  });
  describe("randomizeCredits", () => {
    it.each([
      [100, 10, 90],
      [89, 43, 68],
      [24, 3, 23],
      [11, 50, 50],
      [1, 0, 100],
    ])(
      "should return a random number within the specified range",
      (value, minPercent, maxPercent) => {
        // Arrange
        const maxVal = Math.floor(value * (maxPercent / 100));
        const minVal = Math.ceil(maxVal * (minPercent / 100));

        // Act
        const randomVal = randomizeCredits(value, minPercent, maxPercent);

        // Assert
        expect(randomVal).toBeGreaterThanOrEqual(minVal);
        expect(randomVal).toBeLessThanOrEqual(maxVal);
      }
    );

    it.each([[0], [-1]])(
      "should throw an error if value is less than or equal to 0",
      (value) => {
        // Arrange
        const minPercent = 10;
        const maxPercent = 90;

        // Act & Assert
        expect(() => randomizeCredits(value, minPercent, maxPercent)).toThrow(
          "Value must be greater than 0"
        );
      }
    );

    it("should throw an error if minPercent is less than 0", () => {
      // Arrange
      const value = 100;
      const minPercent = -10;
      const maxPercent = 90;

      // Act & Assert
      expect(() => randomizeCredits(value, minPercent, maxPercent)).toThrow(
        "Min percent must be greater or equal than 0"
      );
    });

    it.each([[0], [-1]])(
      "should throw an error if maxPercent is less than or equal to 0",
      (maxPercent) => {
        // Arrange
        const value = 100;
        const minPercent = 10;

        // Act & Assert
        expect(() => randomizeCredits(value, minPercent, maxPercent)).toThrow(
          "Max percent must be greater than 0"
        );
      }
    );

    it.each([
      [30, 101],
      [101, 90],
    ])(
      "should throw an error if minPercent or maxPercent is greater than 100",
      (minPercent, maxPercent) => {
        // Arrange
        const value = 100;

        // Act & Assert
        expect(() => randomizeCredits(value, minPercent, maxPercent)).toThrow(
          "Percents cannot be greater than 100"
        );
      }
    );

    it("should throw an error if minPercent is greater than maxPercent", () => {
      // Arrange
      const value = 100;
      const minPercent = 90;
      const maxPercent = 10;

      // Act & Assert
      expect(() => randomizeCredits(value, minPercent, maxPercent)).toThrow(
        "Min percent cannot be greater than max percent"
      );
    });
  });
  describe("verifyCredits", () => {
    const action = { name: ActionName.INVITE, credits: 0 };
    it("should throw an error if credits = 0", () => {
      // Act & Assert
      expect(() => verifyCredits(action)).toThrow("Not enough credits");
    });

    it("should not throw an error if credits are > 0", () => {
      // Arrange
      action.credits = 1;

      // Act & Assert
      expect(() => verifyCredits(action)).not.toThrow();
    });
  });
  describe("hasUsedCredits", () => {
    const originalActions = {
      items: [
        { name: ActionName.INVITE, credits: 10 },
        { name: ActionName.SEND_MESSAGE, credits: 2 },
      ],
      id: "123",
    };

    it("should return true if actions have not the same ammount of credits", () => {
      // Arrange
      const actions = {
        items: [
          { name: ActionName.INVITE, credits: 9 },
          { name: ActionName.SEND_MESSAGE, credits: 2 },
        ],
        id: "123",
      };

      // Act
      const result = hasUsedCredits(actions, originalActions);

      // Assert
      expect(result).toBe(true);
    });

    it("should return false if actions have the same amount of credits", () => {
      // Arrange
      const actions = {
        items: [
          { name: ActionName.INVITE, credits: 10 },
          { name: ActionName.SEND_MESSAGE, credits: 2 },
        ],
        id: "123",
      };

      // Act
      const result = hasUsedCredits(actions, originalActions);

      // Assert
      expect(result).toBe(false);
    });
  });
});

function mockDataProviderFactory(returnActions: Actions, returnQueue: Queue) {
  (DataProviderFactory as jest.Mock).mockReturnValue({
    actions: {
      get: jest.fn(() => Promise.resolve(returnActions)),
      update: jest.fn(),
    },
    queue: {
      get: jest.fn(() => Promise.resolve(returnQueue)),
      update: jest.fn(),
    },
  });
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
