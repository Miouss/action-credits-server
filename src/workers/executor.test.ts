import { executeActionDelay } from "./executor";
import { executeAction } from "../services/actions";
import { EXECUTION_INTERVAL } from "../config";

jest.useFakeTimers();
jest.spyOn(global, "setTimeout");

jest.mock("../services/actions", () => ({
  executeAction: jest.fn(),
}));

describe("executor", () => {
  describe("executeActionDelay", () => {
    it("should call executeAction and executeActionDelay after the specified interval", async () => {
      // Arrange
      (executeAction as jest.Mock).mockResolvedValue(true);

      // Act
      executeActionDelay();

      // Assert
      expect(setTimeout).toHaveBeenCalledTimes(1);
      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        EXECUTION_INTERVAL
      );

      // Act
      await jest.runOnlyPendingTimersAsync();

      // Assert
      expect(setTimeout).toHaveBeenCalledTimes(2);
      expect(setTimeout).toHaveBeenLastCalledWith(
        expect.any(Function),
        EXECUTION_INTERVAL
      );
    });
  });
});
