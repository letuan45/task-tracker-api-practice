import { useState } from "react";
import {
  useCreateTaskMutation,
  useDeleteTaskMutation,
  useTasksQuery,
  useUpdateTaskMutation,
  useUpdateTaskStatusMutation,
} from "../../api/useTasks";
import type {
  CreateTaskInput,
  TaskStatus,
  UpdateTaskInput,
} from "../../api/tasksApi";
import { LoadingSpinner } from "./LoadingSpinner";
import { TaskForm } from "./TaskForm";
import { TaskList } from "./TaskList";

const errorMessage = (error: unknown) =>
  error instanceof Error ? error.message : "Something went wrong.";

function readQueryParams() {
  const params = new URLSearchParams(window.location.search);
  return {
    page: Math.max(1, Number(params.get("page")) || 1),
    search: params.get("search") ?? "",
  };
}

function writeQueryParams(page: number, search: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set("page", String(page));
  if (search) params.set("search", search);
  const qs = params.toString();
  const url = qs
    ? `${window.location.pathname}?${qs}`
    : window.location.pathname;
  window.history.replaceState(null, "", url);
}

export function TaskApp() {
  const [{ page, search }, setState] = useState(readQueryParams);

  const setPage = (newPage: number) => {
    setState((prev) => {
      const next = { ...prev, page: newPage };
      writeQueryParams(next.page, next.search);
      return next;
    });
  };

  const setSearch = (newSearch: string) => {
    setState(() => {
      const next = { page: 1, search: newSearch };
      writeQueryParams(next.page, next.search);
      return next;
    });
  };

  const handleSubmitSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    setSearch((formData.get("search") as string) ?? "");
  };

  const {
    data: result,
    isPending,
    error: listError,
  } = useTasksQuery(page, search);
  const createMutation = useCreateTaskMutation();
  const updateMutation = useUpdateTaskMutation();
  const deleteMutation = useDeleteTaskMutation();
  const statusMutation = useUpdateTaskStatusMutation();

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

  const tasks = result?.items ?? [];
  const total = result?.total ?? 0;
  const limit = result?.limit ?? 5;
  const totalPages = Math.max(1, Math.ceil(total / limit));

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

        <form className="flex gap-2" onSubmit={handleSubmitSearch}>
          <input
            aria-label="Search tasks"
            className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
            defaultValue={search}
            key={`${search}-${page}`}
            name="search"
            placeholder="Search by title..."
            type="search"
          />
          <button
            className="rounded bg-slate-900 px-4 py-2 text-sm font-medium text-white"
            type="submit"
          >
            Search
          </button>
        </form>

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
            <>
              <TaskList
                busyTaskId={busyTaskId}
                onDeleteTask={handleDelete}
                onMoveStatus={handleUpdateStatus}
                onUpdateTask={handleUpdate}
                tasks={tasks}
              />
              {totalPages > 1 ? (
                <nav
                  aria-label="Pagination"
                  className="flex items-center justify-center gap-2 pt-2"
                >
                  <button
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
                    disabled={page <= 1}
                    onClick={() => setPage(page - 1)}
                    type="button"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (p) => (
                      <button
                        className={`rounded border px-3 py-2 text-sm ${
                          p === page
                            ? "border-slate-900 bg-slate-900 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                        key={p}
                        onClick={() => setPage(p)}
                        type="button"
                      >
                        {p}
                      </button>
                    ),
                  )}
                  <button
                    className="rounded border border-slate-300 bg-white px-3 py-2 text-sm disabled:opacity-40"
                    disabled={page >= totalPages}
                    onClick={() => setPage(page + 1)}
                    type="button"
                  >
                    Next
                  </button>
                </nav>
              ) : null}
            </>
          )}
        </section>
      </div>
    </main>
  );
}
