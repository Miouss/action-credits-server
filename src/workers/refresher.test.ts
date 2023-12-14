import { refreshCreditsDelay } from "./refresher";
import { DataProviderFactory } from "../data";
import { ActionName } from "../types/enums";
import { Actions } from "../types/types";
import { resetCredits } from "../services/actions";
import { REFRESH_CREDITS_INTERVAL } from "../config";

jest.mock("../data", () => ({
  DataProviderFactory: jest.fn(),
}));

jest.mock("../services/actions", () => ({
  resetCredits: jest.fn(),
}));

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

describe("refreshCreditsDelay", () => {
  it("should call resetCredits and refreshCreditsDelay after the specified interval", async () => {
    // Arrange
    const originalActions: Actions = {
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

    (DataProviderFactory as jest.Mock).mockReturnValue({
      actions: {
        get: jest.fn().mockResolvedValue(originalActions),
      },
    });

    (resetCredits as jest.Mock).mockResolvedValue(true);

    // Act
    await refreshCreditsDelay();

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(1);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      REFRESH_CREDITS_INTERVAL
    );

    // Act
    await jest.runOnlyPendingTimersAsync();

    // Assert
    expect(setTimeout).toHaveBeenCalledTimes(2);
    expect(setTimeout).toHaveBeenLastCalledWith(
      expect.any(Function),
      REFRESH_CREDITS_INTERVAL
    );
  });
});
