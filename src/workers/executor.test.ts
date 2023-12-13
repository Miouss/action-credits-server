import { executeAction } from "./executor";
import { DataProviderFactory } from "../data";
import { Actions, Queue } from "../types/types";
import { ActionName } from "../types/enums";

jest.mock("../data", () => ({
  DataProviderFactory: jest.fn(),
}));

describe("executor", () => {
  const queueWithPendingAction: Queue = {
    pending: [ActionName.INVITE, ActionName.SEND_MESSAGE, ActionName.VISIT],
    executed: [],
  };

  const actionsAllExecutable: Actions = {
    items: [
      {
        name: ActionName.INVITE,
        credits: 10,
      },
      {
        name: ActionName.SEND_MESSAGE,
        credits: 20,
      },
      {
        name: ActionName.VISIT,
        credits: 30,
      },
    ],
    id: "123",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should update the actions and queue file with the correct data after an execution without blocked action in the queue", async () => {
    // Arrange

    const queueBeforeExecution: Queue = deepCopy(queueWithPendingAction);

    const queueAfterExecution: Queue = {
      pending: [ActionName.SEND_MESSAGE, ActionName.VISIT],
      executed: [ActionName.INVITE],
    };

    mockDataProviderFactory(actionsAllExecutable, queueBeforeExecution);

    const actionsAfterExecution = deepCopy(actionsAllExecutable);

    actionsAfterExecution.items[0].credits--;

    // Act
    await executeAction();

    // Assert
    expect(DataProviderFactory().actions.update).toHaveBeenCalledWith(
      actionsAfterExecution
    );
    expect(DataProviderFactory().queue.update).toHaveBeenCalledWith(
      queueAfterExecution
    );
  });

  it("should update the actions and queue file with the correct data after an execution with a blocked action in the queue", async () => {
    // Arrange
    const actionsWithBlockingAction: Actions = {
      items: [
        {
          name: ActionName.INVITE,
          credits: 0,
        },
        {
          name: ActionName.SEND_MESSAGE,
          credits: 20,
        },
        {
          name: ActionName.VISIT,
          credits: 30,
        },
      ],
      id: "123",
    };

    const queueBeforeExecution: Queue = deepCopy(queueWithPendingAction);
    const queueAfterExecution: Queue = {
      pending: [ActionName.INVITE, ActionName.VISIT],
      executed: [ActionName.SEND_MESSAGE],
    };

    mockDataProviderFactory(actionsWithBlockingAction, queueBeforeExecution);

    // Act
    await executeAction();

    // Assert
    expect(DataProviderFactory().actions.update).toHaveBeenCalledWith(
      actionsWithBlockingAction
    );
    expect(DataProviderFactory().queue.update).toHaveBeenCalledWith(
      queueAfterExecution
    );
  });

  it("should not update neither actions or queue file when there is no action to execute", async () => {
    // Arrange
    const queueWithoutPendingActions: Queue = {
      pending: [],
      executed: [ActionName.INVITE, ActionName.SEND_MESSAGE, ActionName.VISIT],
    };

      mockDataProviderFactory(actionsAllExecutable, queueWithoutPendingActions);
      
      // Act
      await executeAction();
      
      // Assert
      expect(DataProviderFactory().actions.update).not.toHaveBeenCalled();
      expect(DataProviderFactory().queue.update).not.toHaveBeenCalled();
  });
});

function mockDataProviderFactory(returnActions: Actions, returnQueue: Queue) {
  (DataProviderFactory as jest.Mock).mockReturnValue({
    actions: {
      get: jest.fn(() => Promise.resolve(returnActions)),
      update: jest.fn(),
    },
    queue: {
      get: jest.fn(() => Promise.resolve(returnQueue)),
      update: jest.fn(),
    },
  });
}

function deepCopy<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
