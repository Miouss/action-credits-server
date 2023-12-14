import jsonfile from "jsonfile";
import { ACTIONS_FILE_PATH, getActions, updateActions } from "./actions";
import { ActionName } from "../../types/enums";
import { Actions } from "../../types/types";

jest.mock("jsonfile");

describe("actions", () => {
  const actions: Actions = {
    items: [
      { name: ActionName.INVITE, credits: 10 },
      { name: ActionName.SEND_MESSAGE, credits: 2 },
    ],
    id: "123",
  };

  (jsonfile.readFile as jest.Mock).mockReturnValue(actions);

  describe("getActions", () => {
    it(`should call jsonfile.readFile with path ${ACTIONS_FILE_PATH} and return the actions`, async () => {
      // Act
      const result = await getActions();

      // Assert
      expect(jsonfile.readFile).toHaveBeenCalledWith(ACTIONS_FILE_PATH);
      expect(result).toBe(actions);
    });
  });
  describe("updateActions", () => {
    it(`should call jsonfile.writeFile with path ${ACTIONS_FILE_PATH}`, async () => {
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
