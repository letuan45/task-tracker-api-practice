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

export type TaskRouteLocals = {
  taskId?: string;
  createTaskInput?: CreateTaskInput;
  updateTaskInput?: UpdateTaskInput;
  updateTaskStatusInput?: UpdateTaskStatusInput;
};
