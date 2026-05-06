import type { TaskStatus } from "@prisma/client";

export type CreateTaskInput = {
  title: string;
  description: string;
  status: TaskStatus;
};

export type UpdateTaskInput = {
  title?: string;
  description?: string;
  status?: TaskStatus;
};

export type UpdateTaskStatusInput = {
  status: TaskStatus;
};

export type ListTasksParams = {
  page: number;
  limit: number;
  search?: string;
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
};

export type TaskRouteLocals = {
  taskId?: string;
  createTaskInput?: CreateTaskInput;
  updateTaskInput?: UpdateTaskInput;
  updateTaskStatusInput?: UpdateTaskStatusInput;
  listTasksParams?: ListTasksParams;
};
