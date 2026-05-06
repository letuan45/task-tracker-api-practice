import { Router } from "express";
import { taskController } from "./task.controller.js";
import {
  validateCreateTaskBody,
  validateTaskId,
  validateUpdateTaskBody,
  validateUpdateTaskStatusBody,
} from "./task.middlewares.js";

export const taskRoutes = Router();

taskRoutes.get("/", taskController.listTasks);
taskRoutes.get("/:id", validateTaskId, taskController.getTask);
taskRoutes.post("/", validateCreateTaskBody, taskController.createTask);
taskRoutes.put("/:id", validateTaskId, validateUpdateTaskBody, taskController.updateTask);
taskRoutes.delete("/:id", validateTaskId, taskController.deleteTask);
taskRoutes.patch("/:id/status", validateTaskId, validateUpdateTaskStatusBody, taskController.updateTaskStatus);
