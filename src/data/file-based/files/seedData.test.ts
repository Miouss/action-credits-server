import { DataProviderFactory } from "../..";
import { FileTypes, defaultContent } from "./config";
import { FileValidatorFactoryProvider } from "./fileValidator";
import { seedData } from "./seedData";

jest.mock("./fileValidator", () => ({
  ...jest.requireActual("./fileValidator"),
  FileValidatorFactoryProvider: jest.fn(),
}));

jest.mock("../../", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("fileValidationHandler", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([[FileTypes.QUEUE], [FileTypes.ACTIONS]])(
    "should call the update function that create a new file with the correct default content if the file is invalid",
    async (type) => {
      // Arrange
      (FileValidatorFactoryProvider as jest.Mock).mockReturnValue({
        [type]: jest.fn().mockRejectedValue(""),
      });

      (DataProviderFactory as jest.Mock).mockReturnValue({
        [type]: {
          update: jest.fn(),
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

  it.each([[FileTypes.QUEUE], [FileTypes.ACTIONS]])(
    "should not call the update function that create a new file if the file is valid",
    async (type) => {
      // Arrange
      (FileValidatorFactoryProvider as jest.Mock).mockReturnValue({
        [type]: jest.fn(),
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
