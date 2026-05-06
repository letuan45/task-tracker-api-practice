import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { TaskApp } from "../TaskApp";
import type { Task } from "../../../api/tasksApi";
import { tasksApi } from "../../../api/tasksApi";

vi.mock("../../../api/tasksApi", async () => {
  const actual = await vi.importActual<typeof import("../../../api/tasksApi")>(
    "../../../api/tasksApi",
  );

  return {
    ...actual,
    tasksApi: {
      listTasks: vi.fn(),
      createTask: vi.fn(),
      updateTask: vi.fn(),
      deleteTask: vi.fn(),
      updateTaskStatus: vi.fn(),
    },
  };
});

const mockTasksApi = vi.mocked(tasksApi);

const task = (overrides: Partial<Task> = {}): Task => ({
  id: "task-1",
  title: "Plan API",
  description: "Write the backend endpoints",
  status: "TODO",
  createdAt: "2026-04-27T00:00:00.000Z",
  updatedAt: "2026-04-27T00:00:00.000Z",
  ...overrides,
});

const paginated = (items: Task[], total = items.length) => ({
  items,
  total,
  page: 1,
  limit: 5,
});

function renderApp() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={queryClient}>
      <TaskApp />
    </QueryClientProvider>,
  );
}

describe("TaskApp", () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it("shows loading state and renders listed tasks with status actions", async () => {
    mockTasksApi.listTasks.mockResolvedValue(
      paginated([
        task(),
        task({
          id: "task-2",
          title: "Build UI",
          description: "Create React components",
          status: "IN_PROGRESS",
        }),
        task({
          id: "task-3",
          title: "Ship",
          description: "Finish the practice app",
          status: "DONE",
        }),
      ]),
    );

    renderApp();

    expect(screen.getByText("Loading tasks...")).toBeInTheDocument();
    expect(await screen.findByText("Plan API")).toBeInTheDocument();
    expect(screen.getByText("Move to in progress")).toBeInTheDocument();
    expect(screen.getByText("Move to done")).toBeInTheDocument();
    expect(screen.queryByText("No tasks yet.")).not.toBeInTheDocument();
  });

  it("validates create form before calling the API", async () => {
    const user = userEvent.setup();
    mockTasksApi.listTasks.mockResolvedValue(paginated([]));

    renderApp();

    await screen.findByText("No tasks yet.");
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(
      screen.getByText("Title and description are required."),
    ).toBeInTheDocument();
    expect(mockTasksApi.createTask).not.toHaveBeenCalled();
  });

  it("creates, edits, moves, and deletes a task through the main UI", async () => {
    const user = userEvent.setup();
    let store: Task[] = [];

    mockTasksApi.listTasks.mockImplementation(async () =>
      paginated(store),
    );
    mockTasksApi.createTask.mockImplementation(async (input) => {
      const newTask = task({ ...input });
      store = [newTask];
      return newTask;
    });
    mockTasksApi.updateTask.mockImplementation(async (id, input) => {
      const updated = { ...store[0], ...input };
      store = [updated];
      return updated;
    });
    mockTasksApi.updateTaskStatus.mockImplementation(async (id, status) => {
      const updated = { ...store[0], status };
      store = [updated];
      return updated;
    });
    mockTasksApi.deleteTask.mockImplementation(async () => {
      store = [];
    });

    renderApp();

    await screen.findByText("No tasks yet.");
    await user.type(screen.getByLabelText("Title"), "Plan API");
    await user.type(
      screen.getByLabelText("Description"),
      "Write the backend endpoints",
    );
    await user.click(screen.getByRole("button", { name: "Create task" }));

    expect(await screen.findByText("Plan API")).toBeInTheDocument();
    expect(mockTasksApi.createTask).toHaveBeenCalledWith({
      title: "Plan API",
      description: "Write the backend endpoints",
    });

    await user.click(screen.getByRole("button", { name: "Edit" }));
    await user.clear(screen.getByLabelText("Edit title for Plan API"));
    await user.type(
      screen.getByLabelText("Edit title for Plan API"),
      "Plan task API",
    );
    await user.clear(screen.getByLabelText("Edit description for Plan API"));
    await user.type(
      screen.getByLabelText("Edit description for Plan API"),
      "Update the endpoint design",
    );
    await user.click(screen.getByRole("button", { name: "Save" }));

    expect(await screen.findByText("Plan task API")).toBeInTheDocument();
    expect(mockTasksApi.updateTask).toHaveBeenCalledWith("task-1", {
      title: "Plan task API",
      description: "Update the endpoint design",
    });

    await user.click(
      screen.getByRole("button", { name: "Move to in progress" }),
    );

    await waitFor(() => {
      expect(mockTasksApi.updateTaskStatus).toHaveBeenCalledWith(
        "task-1",
        "IN_PROGRESS",
      );
    });
    expect(await screen.findByText("In progress")).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Delete" }));

    await waitFor(() => {
      expect(mockTasksApi.deleteTask).toHaveBeenCalledWith("task-1");
    });
    expect(screen.getByText("No tasks yet.")).toBeInTheDocument();
  });
});
