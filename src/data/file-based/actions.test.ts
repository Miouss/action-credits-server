import jsonfile from "jsonfile";
import { ACTIONS_FILE_PATH, getActions, updateActions } from "./actions";
import { ActionName } from "../../types/enums";

jest.mock("jsonfile");

describe("actions", () => {
  describe("getActions", () => {
    it(`should call jsonfile.readFile with path ${ACTIONS_FILE_PATH}`, async () => {
      // Act
      await getActions();

      // Assert
      expect(jsonfile.readFile).toHaveBeenCalledWith(ACTIONS_FILE_PATH);
    });
  });
  describe("updateActions", () => {
    it(`should call jsonfile.writeFile with path ${ACTIONS_FILE_PATH}`, async () => {
      // Arrange
      const actions = {
        items: [
          { name: ActionName.INVITE, credits: 10 },
          { name: ActionName.SEND_MESSAGE, credits: 2 },
        ],
        id: "123",
      };

      // Act
      await updateActions(actions);

      // Assert
      expect(jsonfile.writeFile).toHaveBeenCalledWith(
        ACTIONS_FILE_PATH,
        actions
      );
    });
  });
});
