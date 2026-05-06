import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "../../api/useTasks";
import type { CreateTaskInput, TaskStatus, UpdateTaskInput } from "../../api/tasksApi";
import { LoadingSpinner } from "./LoadingSpinner";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

export function TaskApp() {
  const { data: tasks = [], isPending, error: listError } = useTasksQuery();
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const statusMutation = useUpdateTaskStatusMutation();

  const displayError =
    listError ??
    createMutation.error ??
    updateMutation.error ??
    deleteMutation.error ??
    statusMutation.error;

  const busyTaskId = deleteMutation.isPending
    ? deleteMutation.variables
    : statusMutation.isPending
      ? statusMutation.variables?.id
      : updateMutation.isPending
        ? updateMutation.variables?.id
        : undefined;

  const handleCreate = async (input: CreateTaskInput) => {
    await createMutation.mutateAsync(input);
  };

  const handleUpdate = async (id: string, input: UpdateTaskInput) => {
    await updateMutation.mutateAsync({ id, input });
  };

  const handleUpdateStatus = async (id: string, status: TaskStatus) => {
    await statusMutation.mutateAsync({ id, status });
  };

  const handleDelete = async (id: string) => {
    await deleteMutation.mutateAsync(id);
  };

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900">
      <div className="mx-auto max-w-4xl space-y-6">
        <header>
          <h1 className="text-2xl font-semibold">Task Tracker</h1>
          <p className="mt-1 text-sm text-slate-600">
            Create tasks, edit details, and move work through the allowed status
            flow.
          </p>
        </header>

        {displayError ? (
          <div
            className="rounded border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            role="alert"
          >
            {errorMessage(displayError)}
          </div>
        ) : null}

        <TaskForm disabled={createMutation.isPending} onSubmit={handleCreate} />

        <section aria-label="Tasks">
          {isPending ? (
            <div
              className="flex items-center gap-3 rounded border border-slate-200 bg-white p-4 text-sm text-slate-600"
              role="status"
            >
              <LoadingSpinner className="text-slate-500" />
              <span>Loading tasks...</span>
            </div>
          ) : (
            <TaskList
              busyTaskId={busyTaskId}
              onDeleteTask={handleDelete}
              onMoveStatus={handleUpdateStatus}
              onUpdateTask={handleUpdate}
              tasks={tasks}
            />
          )}
        </section>
      </div>
    </main>
  );
}
