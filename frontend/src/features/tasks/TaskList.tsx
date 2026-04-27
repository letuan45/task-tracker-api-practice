import { FormEvent, useState } from "react";
import type { Task, TaskStatus, UpdateTaskInput } from "../../api/tasksApi";
import { TaskStatusBadge } from "./TaskStatusBadge";

type TaskListProps = {
  tasks: Task[];
  busyTaskId?: string;
  onDeleteTask: (id: string) => Promise<void>;
  onMoveStatus: (id: string, status: TaskStatus) => Promise<void>;
  onUpdateTask: (id: string, input: UpdateTaskInput) => Promise<void>;
};

const nextStatus = (status: TaskStatus): TaskStatus | null => {
  if (status === "TODO") {
    return "IN_PROGRESS";
  }

  if (status === "IN_PROGRESS") {
    return "DONE";
  }

  return null;
};

const nextStatusLabel = (status: TaskStatus) => {
  if (status === "TODO") {
    return "Move to in progress";
  }

  if (status === "IN_PROGRESS") {
    return "Move to done";
  }

  return "";
};

export function TaskList({
  tasks,
  busyTaskId,
  onDeleteTask,
  onMoveStatus,
  onUpdateTask,
}: TaskListProps) {
  if (tasks.length === 0) {
    return (
      <div className="rounded border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
        No tasks yet.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskListItem
          busy={busyTaskId === task.id}
          key={task.id}
          onDeleteTask={onDeleteTask}
          onMoveStatus={onMoveStatus}
          onUpdateTask={onUpdateTask}
          task={task}
        />
      ))}
    </div>
  );
}

function TaskListItem({
  busy,
  task,
  onDeleteTask,
  onMoveStatus,
  onUpdateTask,
}: {
  busy: boolean;
  task: Task;
  onDeleteTask: TaskListProps["onDeleteTask"];
  onMoveStatus: TaskListProps["onMoveStatus"];
  onUpdateTask: TaskListProps["onUpdateTask"];
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [validationError, setValidationError] = useState("");
  const status = nextStatus(task.status);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      setValidationError("Title and description are required.");
      return;
    }

    setValidationError("");
    await onUpdateTask(task.id, {
      title: title.trim(),
      description: description.trim(),
    });
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <form
        className="space-y-3 rounded border border-slate-200 bg-white p-4"
        onSubmit={handleSubmit}
      >
        <input
          aria-label={`Edit title for ${task.title}`}
          className="w-full rounded border border-slate-300 px-3 py-2 text-sm"
          disabled={busy}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
        />
        <textarea
          aria-label={`Edit description for ${task.title}`}
          className="min-h-20 w-full rounded border border-slate-300 px-3 py-2 text-sm"
          disabled={busy}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
        {validationError ? (
          <p className="text-sm text-red-700" role="alert">
            {validationError}
          </p>
        ) : null}
        <div className="flex flex-wrap gap-2">
          <button
            className="rounded bg-slate-900 px-3 py-2 text-sm font-medium text-white disabled:bg-slate-400"
            disabled={busy}
            type="submit"
          >
            Save
          </button>
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            disabled={busy}
            onClick={() => setIsEditing(false)}
            type="button"
          >
            Cancel
          </button>
        </div>
      </form>
    );
  }

  return (
    <article className="rounded border border-slate-200 bg-white p-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className="text-base font-semibold text-slate-900">{task.title}</h2>
            <TaskStatusBadge status={task.status} />
          </div>
          <p className="text-sm text-slate-600">{task.description}</p>
        </div>
        <div className="flex shrink-0 flex-wrap gap-2">
          {status ? (
            <button
              className="rounded border border-blue-300 px-3 py-2 text-sm text-blue-700 disabled:text-slate-400"
              disabled={busy}
              onClick={() => onMoveStatus(task.id, status)}
              type="button"
            >
              {nextStatusLabel(task.status)}
            </button>
          ) : null}
          <button
            className="rounded border border-slate-300 px-3 py-2 text-sm"
            disabled={busy}
            onClick={() => setIsEditing(true)}
            type="button"
          >
            Edit
          </button>
          <button
            className="rounded border border-red-300 px-3 py-2 text-sm text-red-700 disabled:text-slate-400"
            disabled={busy}
            onClick={() => onDeleteTask(task.id)}
            type="button"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
