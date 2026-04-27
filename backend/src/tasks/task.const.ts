import { TaskStatus } from "@prisma/client";

export const TASK_STATUSES = Object.values(TaskStatus);

export const TASK_ERROR_CODES = {
  INVALID_TASK_ID: "INVALID_TASK_ID",
  INVALID_TASK_STATUS: "INVALID_TASK_STATUS",
  TASK_NOT_FOUND: "TASK_NOT_FOUND",
} as const;
