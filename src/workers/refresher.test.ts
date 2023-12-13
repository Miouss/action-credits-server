import { hasUsedCredits } from "../services/actions";
import { ActionName } from "../types/enums";
import { Actions } from "../types/types";
import { refreshCreditsDelay } from "./refresherRefreshCreditsDelay";
import { DataProviderFactory } from "../data";
import { resetCredits } from "./refresher";

jest.mock("./refresherRefreshCreditsDelay", () => ({
  refreshCreditsDelay: jest.fn(),
}));

jest.mock("../data", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("refresher", () => {
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

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("resetCredits", () => {
    it("should not update the actions file and not modify the actions object if no credits have been used", async () => {
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
      expect(refreshCreditsDelay).toHaveBeenCalledWith(previousActions);
    });

    it("should update the actions file and modify the actions object with new credits and a new id", async () => {
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
      expect(refreshCreditsDelay).toHaveBeenCalledWith(
        currentActionsWithUsedCredits
      );
    });
  });

  describe("hasUsedCredits", () => {
    it("should return true if the number of credits are different", () => {
      // Act
      const result = hasUsedCredits(
        currentActionsWithUsedCredits,
        previousActions
      );

      // Assert
      expect(result).toBe(true);
    });

    it("should return false if the number of credits are the same", () => {
      // Act
      const result = hasUsedCredits(
        currentActionsWithoutUsedCredits,
        previousActions
      );

      // Assert
      expect(result).toBe(false);
    });
  });
});
