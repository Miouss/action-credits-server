import { ActionName, ActionStatus } from "../../types/enums";
import { Queue } from "../../types/types";
import jsonfile from "jsonfile";
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

  (jsonfile.readFile as jest.Mock).mockReturnValue(queue);

  describe("getQueueItemsByActionStatus", () => {
    // Arrange
    const count = 3;

    it("should return the filtered queue items by action status and the correct executedItemsHistory", async () => {
      // Arrange
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

    it(`should return items.executed as undefined when status 'completed' is not in the statuses array and executedItemsHistory as 0`, async () => {
      // Arrange
      const count = 3;
      const statuses = [ActionStatus.PENDING];
      // Act
      const result = await getQueueItemsByActionStatus(count, statuses);

      // Assert
      const expectedResult = {
        items: {
          executed: undefined,
          pending: [ActionName.SEND_MESSAGE],
        },
        executedItemsHistory: 0,
      };

      expect(result).toEqual(expectedResult);
    });

    it(`should return items.pending as undefined when status 'pending' is not in the statuses array`, async () => {
      // Arrange
      const statuses = [ActionStatus.COMPLETED];
      // Act
      const result = await getQueueItemsByActionStatus(count, statuses);

      // Assert
      const expectedResult = {
        items: {
          executed: [ActionName.VISIT, ActionName.INVITE, ActionName.VISIT],
          pending: undefined,
        },
        executedItemsHistory: 4,
      };

      expect(result).toEqual(expectedResult);
    });
  });
  describe("getQueue", () => {
    it(`should call jsonfile.readFile with path ${QUEUE_FILE_PATH} and return the queue`, async () => {
      // Act
      const result = await getQueue();

      // Assert
      expect(jsonfile.readFile).toHaveBeenCalledWith(QUEUE_FILE_PATH);
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
      expect(jsonfile.writeFile).toHaveBeenCalledWith(QUEUE_FILE_PATH, queue);
    });
  });
});
