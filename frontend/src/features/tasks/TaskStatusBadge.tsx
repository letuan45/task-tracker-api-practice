import type { TaskStatus } from "../../api/tasksApi";

const statusStyles: Record<TaskStatus, string> = {
  TODO: "border-slate-300 bg-slate-100 text-slate-700",
  IN_PROGRESS: "border-blue-300 bg-blue-50 text-blue-700",
  DONE: "border-emerald-300 bg-emerald-50 text-emerald-700",
};

const statusLabels: Record<TaskStatus, string> = {
  TODO: "Todo",
  IN_PROGRESS: "In progress",
  DONE: "Done",
};

export function TaskStatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded border px-2 py-1 text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
    </span>
  );
}
