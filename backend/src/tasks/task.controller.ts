import type { Request, Response } from "express";
import { AppError, badRequest } from "./task.errors.js";
import { taskService } from "./task.service.js";

const sendError = (res: Response, error: unknown) => {
  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: {
        code: error.code,
        message: error.message,
      },
    });
  }

  console.error(error);

  return res.status(500).json({
    error: {
      code: "INTERNAL_SERVER_ERROR",
      message: "An unexpected error occurred.",
    },
  });
};

const idFromParams = (req: Request) => {
  const id = req.params.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    throw badRequest("Task id is required.", "INVALID_TASK_ID");
  }

  return id;
};

export const taskController = {
  async listTasks(_req: Request, res: Response) {
    try {
      const tasks = await taskService.listTasks();
      return res.status(200).json({ data: tasks });
    } catch (error) {
      return sendError(res, error);
    }
  },

  async getTask(req: Request, res: Response) {
    try {
      const task = await taskService.getTask(idFromParams(req));
      return res.status(200).json({ data: task });
    } catch (error) {
      return sendError(res, error);
    }
  },

  async createTask(req: Request, res: Response) {
    try {
      const task = await taskService.createTask(req.body);
      return res.status(201).json({ data: task });
    } catch (error) {
      return sendError(res, error);
    }
  },

  async updateTask(req: Request, res: Response) {
    try {
      const task = await taskService.updateTask(idFromParams(req), req.body);
      return res.status(200).json({ data: task });
    } catch (error) {
      return sendError(res, error);
    }
  },

  async deleteTask(req: Request, res: Response) {
    try {
      await taskService.deleteTask(idFromParams(req));
      return res.status(204).send();
    } catch (error) {
      return sendError(res, error);
    }
  },

  async updateTaskStatus(req: Request, res: Response) {
    try {
      const task = await taskService.updateTaskStatus(idFromParams(req), req.body);
      return res.status(200).json({ data: task });
    } catch (error) {
      return sendError(res, error);
    }
  },
};
