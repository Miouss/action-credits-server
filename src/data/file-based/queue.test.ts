import { ActionName, ActionStatus } from "../../types/enums";
import { Queue } from "../../types/types";
import mockJsonfile from "jsonfile";
import {
  getQueueItemsByActionStatus,
  QUEUE_FILE_PATH,
  getQueue,
  updateQueue,
} from "./queue";

jest.mock("jsonfile");

describe("queue", () => {
  const queue: Queue = {
    items: [
      { name: ActionName.INVITE, status: ActionStatus.COMPLETED },
      { name: ActionName.INVITE, status: ActionStatus.COMPLETED },
      { name: ActionName.INVITE, status: ActionStatus.COMPLETED },
      { name: ActionName.VISIT, status: ActionStatus.COMPLETED },
      { name: ActionName.VISIT, status: ActionStatus.COMPLETED },
      { name: ActionName.INVITE, status: ActionStatus.COMPLETED },
      { name: ActionName.SEND_MESSAGE, status: ActionStatus.PENDING },
      { name: ActionName.VISIT, status: ActionStatus.COMPLETED },
    ],
    nextActionIndex: 6,
  };

  (mockJsonfile.readFile as jest.Mock).mockReturnValue(queue);

  describe("getQueueItemsByActionStatus", () => {
    it("should return the filtered queue items by action status", async () => {
      // Arrange
      const count = 3;
      const statuses = [ActionStatus.COMPLETED, ActionStatus.PENDING];

      // Act
      const result = await getQueueItemsByActionStatus(count, statuses);

      // Assert
      const expectedResult = {
        items: {
          executed: [ActionName.VISIT, ActionName.INVITE, ActionName.VISIT],
          pending: [ActionName.SEND_MESSAGE],
        },
        executedItemsHistory: 4,
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getQueue", () => {
    it(`should call jsonfile.readFile with path ${QUEUE_FILE_PATH}`, async () => {
      // Act
      const result = await getQueue();

      // Assert
      expect(result).toEqual(queue);
    });
  });
  describe("updateQueue", () => {
    it(`should call jsonfile.writeFile with path ${QUEUE_FILE_PATH}`, async () => {
      // Arrange
      const queue: Queue = {
        items: [
          { name: ActionName.INVITE, status: ActionStatus.PENDING },
          { name: ActionName.SEND_MESSAGE, status: ActionStatus.COMPLETED },
        ],
        nextActionIndex: 1,
      };

      // Act
      await updateQueue(queue);

      // Assert
      expect(mockJsonfile.writeFile).toHaveBeenCalledWith(
        QUEUE_FILE_PATH,
        queue
      );
    });
  });
});
