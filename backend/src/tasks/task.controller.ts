import type { Request, Response } from "express";
import { taskService } from "./task.service.js";
import { AppError } from "../lib/app-error.js";
import type { TaskRouteLocals } from "./task.types.js";

const requireLocal = <T>(value: T | undefined, name: string) => {
  if (value === undefined) {
    throw new AppError(500, "INTERNAL_ERROR", `Missing validated ${name}.`);
  }

  return value;
};

type TaskResponse = Response<unknown, TaskRouteLocals>;

export const taskController = {
  async listTasks(_req: Request, res: TaskResponse) {
    const result = await taskService.listTasks(
      requireLocal(res.locals.listTasksParams, "list tasks params"),
    );
    return res.status(200).json(result);
  },

  async getTask(_req: Request, res: TaskResponse) {
    const task = await taskService.getTask(
      requireLocal(res.locals.taskId, "task id"),
    );
    return res.status(200).json({ data: task });
  },

  async createTask(_req: Request, res: TaskResponse) {
    const task = await taskService.createTask(
      requireLocal(res.locals.createTaskInput, "create task input"),
    );
    return res.status(201).json({ data: task });
  },

  async updateTask(_req: Request, res: TaskResponse) {
    const task = await taskService.updateTask(
      requireLocal(res.locals.taskId, "task id"),
      requireLocal(res.locals.updateTaskInput, "update task input"),
    );
    return res.status(200).json({ data: task });
  },

  async deleteTask(_req: Request, res: TaskResponse) {
    await taskService.deleteTask(requireLocal(res.locals.taskId, "task id"));
    return res.status(204).send();
  },

  async updateTaskStatus(_req: Request, res: TaskResponse) {
    const task = await taskService.updateTaskStatus(
      requireLocal(res.locals.taskId, "task id"),
      requireLocal(res.locals.updateTaskStatusInput, "update status input"),
    );
    return res.status(200).json({ data: task });
  },
};
