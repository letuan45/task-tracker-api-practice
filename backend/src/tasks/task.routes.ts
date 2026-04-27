import { Router } from "express";
import { taskController } from "./task.controller.js";

export const taskRoutes = Router();

taskRoutes.get("/", taskController.listTasks);
taskRoutes.get("/:id", taskController.getTask);
taskRoutes.post("/", taskController.createTask);
taskRoutes.put("/:id", taskController.updateTask);
taskRoutes.delete("/:id", taskController.deleteTask);
taskRoutes.patch("/:id/status", taskController.updateTaskStatus);
