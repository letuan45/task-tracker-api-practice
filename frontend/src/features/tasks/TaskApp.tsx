import { useEffect, useState } from "react";
import {
  type CreateTaskInput,
  type Task,
  type TaskStatus,
  type UpdateTaskInput,
  tasksApi,
} from "../../api/tasksApi";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

export function TaskApp() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [busyTaskId, setBusyTaskId] = useState<string>();
  const [isCreating, setIsCreating] = useState(false);

  const loadTasks = async () => {
    setIsLoading(true);
    setError("");

    try {
      setTasks(await tasksApi.listTasks());
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadTasks();
  }, []);

  const createTask = async (input: CreateTaskInput) => {
    setIsCreating(true);
    setError("");

    try {
      const task = await tasksApi.createTask(input);
      setTasks((currentTasks) => [task, ...currentTasks]);
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setIsCreating(false);
    }
  };

  const updateTask = async (id: string, input: UpdateTaskInput) => {
    await runTaskAction(id, async () => tasksApi.updateTask(id, input));
  };

  const updateTaskStatus = async (id: string, status: TaskStatus) => {
    await runTaskAction(id, async () => tasksApi.updateTaskStatus(id, status));
  };

  const deleteTask = async (id: string) => {
    setBusyTaskId(id);
    setError("");

    try {
      await tasksApi.deleteTask(id);
      setTasks((currentTasks) => currentTasks.filter((task) => task.id !== id));
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setBusyTaskId(undefined);
    }
  };

  const runTaskAction = async (
    id: string,
    action: () => Promise<Task>,
  ) => {
    setBusyTaskId(id);
    setError("");

    try {
      const updatedTask = await action();
      setTasks((currentTasks) =>
        currentTasks.map((task) => (task.id === id ? updatedTask : task)),
      );
    } catch (caughtError) {
      setError(errorMessage(caughtError));
    } finally {
      setBusyTaskId(undefined);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Task Tracker</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create tasks, edit details, and move work through the allowed status flow.
          </p>
        </header>

        {error ? (
          <div className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700" role="alert">
            {error}
          </div>
        ) : null}

        <TaskForm disabled={isCreating} onSubmit={createTask} />

        <section aria-label="Tasks">
          {isLoading ? (
            <p className="rounded border border-slate-200 bg-white p-4 text-sm text-slate-600">
              Loading tasks...
            </p>
          ) : (
            <TaskList
              busyTaskId={busyTaskId}
              onDeleteTask={deleteTask}
              onMoveStatus={updateTaskStatus}
              onUpdateTask={updateTask}
              tasks={tasks}
            />
          )}
        </section>
      </div>
    </main>
  );
}

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";
