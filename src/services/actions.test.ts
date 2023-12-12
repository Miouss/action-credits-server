import { ActionName } from "../types/enums";
import {
  findActionByName,
  hasUsedCredits,
  randomizeCredits,
  verifyCredits,
} from "./actions";

describe("actions", () => {
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
