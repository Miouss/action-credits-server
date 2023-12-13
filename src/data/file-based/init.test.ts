import { seedData } from "./init";
import { FileTypes, defaultContent } from "./config";
import { DataProviderFactory } from "..";
import { FileValidatorFactoryProvider } from ".";

jest.mock(".", () => ({
  ...jest.requireActual("."),
  FileValidatorFactoryProvider: jest.fn(),
}));

jest.mock("..", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("init", () => {
  const testData = [[FileTypes.ACTIONS], [FileTypes.QUEUE]];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it.each(testData)(
    "should call the function to create a new file '%s' if the file is invalid",
    async (type) => {
      // Arrange
      (FileValidatorFactoryProvider as jest.Mock).mockReturnValue({
        [type]: jest.fn(() => Promise.reject()),
      });

      (DataProviderFactory as jest.Mock).mockReturnValue({
        [type]: {
          update: jest.fn(() => Promise.resolve()),
        },
      });

      // Act
      await seedData(type);

      // Assert
      expect(DataProviderFactory()[type].update).toHaveBeenCalledWith(
        defaultContent[type]
      );
    }
  );
  it.each(testData)(
    "should not call the function to create a new file '%s' if the file is valid",
    async (type) => {
      // Arrange
      (FileValidatorFactoryProvider as jest.Mock).mockReturnValue({
        [type]: jest.fn(() => Promise.resolve()),
      });

      (DataProviderFactory as jest.Mock).mockReturnValue({
        [type]: {
          update: jest.fn(),
        },
      });

      // Act
      await seedData(type);

      // Assert
      expect(DataProviderFactory()[type].update).not.toHaveBeenCalled();
    }
  );
});
