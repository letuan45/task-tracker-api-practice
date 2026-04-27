import { Router } from "express";
import { asyncHandler } from "../lib/async-handler.js";
import { taskController } from "./task.controller.js";
import {
  validateCreateTaskBody,
  validateTaskId,
  validateUpdateTaskBody,
  validateUpdateTaskStatusBody,
} from "./task.middlewares.js";

export const taskRoutes = Router();

taskRoutes.get("/", asyncHandler(taskController.listTasks));
taskRoutes.get("/:id", validateTaskId, asyncHandler(taskController.getTask));
taskRoutes.post(
  "/",
  validateCreateTaskBody,
  asyncHandler(taskController.createTask),
);
taskRoutes.put(
  "/:id",
  validateTaskId,
  validateUpdateTaskBody,
  asyncHandler(taskController.updateTask),
);
taskRoutes.delete(
  "/:id",
  validateTaskId,
  asyncHandler(taskController.deleteTask),
);
taskRoutes.patch(
  "/:id/status",
  validateTaskId,
  validateUpdateTaskStatusBody,
  asyncHandler(taskController.updateTaskStatus),
);
