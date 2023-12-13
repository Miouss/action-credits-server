import jsonfile from "jsonfile";
import { ACTIONS_FILE_PATH, getActions, updateActions } from "./actions";
import { ActionName, ActionStatus } from "../../types/enums";
import { Queue } from "../../types/types";

jest.mock("jsonfile");

describe("actions", () => {
  const queue: Queue = {
    items: [
      { name: ActionName.INVITE, status: ActionStatus.COMPLETED },
      { name: ActionName.SEND_MESSAGE, status: ActionStatus.PENDING },
    ],
    nextActionIndex: 1,
  };

  (jsonfile.readFile as jest.Mock).mockReturnValue(queue);

  describe("getActions", () => {
    it(`should call jsonfile.readFile with path ${ACTIONS_FILE_PATH} and return the queue`, async () => {
      // Act
      const result = await getActions();

      // Assert
      expect(jsonfile.readFile).toHaveBeenCalledWith(ACTIONS_FILE_PATH);
      expect(result).toBe(queue);
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
