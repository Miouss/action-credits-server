import { ActionName, ActionStatus } from "../../types/enums";
import { Queue, QueueByStatusWithExecutedHistory } from "../../types/types";
import jsonfile from "jsonfile";
import {
  getQueueByStatus,
  QUEUE_FILE_PATH,
  getQueue,
  updateQueue,
} from "./queue";

jest.mock("jsonfile");

describe("queue", () => {
  const queue: Queue = {
    executed: [
      ActionName.INVITE,
      ActionName.INVITE,
      ActionName.INVITE,
      ActionName.VISIT,
      ActionName.VISIT,
      ActionName.INVITE,
      ActionName.VISIT,
    ],
    pending: [ActionName.SEND_MESSAGE],
  };

  (jsonfile.readFile as jest.Mock).mockReturnValue(queue);

  describe("getQueueItemsByActionStatus", () => {
    // Arrange
    const count = 3;

    it("should return the correct filtered queue and the correct executedItemsHistory", async () => {
      // Arrange
      const statuses = [ActionStatus.EXECUTED, ActionStatus.PENDING];

      // Act
      const result = await getQueueByStatus(count, statuses);

      // Assert
      const expectedResult: QueueByStatusWithExecutedHistory = {
        items: {
          executed: [ActionName.VISIT, ActionName.INVITE, ActionName.VISIT],
          pending: [ActionName.SEND_MESSAGE],
        },
        executedItemsHistory: 4,
      };

      expect(result).toEqual(expectedResult);
    });

    it(`should return items.executed as undefined when status 'executed' is not in the statuses array`, async () => {
      // Arrange
      const count = 3;
      const statuses = [ActionStatus.PENDING];
      // Act
      const result = await getQueueByStatus(count, statuses);

      // Assert
      const expectedResult: QueueByStatusWithExecutedHistory = {
        items: {
          executed: undefined,
          pending: [ActionName.SEND_MESSAGE],
        },
        executedItemsHistory: 4,
      };

      expect(result).toEqual(expectedResult);
    });

    it(`should return items.pending as undefined when status 'pending' is not in the statuses array`, async () => {
      // Arrange
      const statuses = [ActionStatus.EXECUTED];
      // Act
      const result = await getQueueByStatus(count, statuses);

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
        pending: [ActionName.INVITE],
        executed: [ActionName.SEND_MESSAGE],
      };

      // Act
      await updateQueue(queue);

      // Assert
      expect(jsonfile.writeFile).toHaveBeenCalledWith(QUEUE_FILE_PATH, queue);
    });
  });
});
