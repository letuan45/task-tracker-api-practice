import "dotenv/config";
import express from "express";
import { errorHandler } from "./lib/error-handler.js";
import { taskRoutes } from "./tasks/task.routes.js";

export const app = express();

app.use(express.json());

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use("/tasks", taskRoutes);

app.use((_req, res) => {
  res.status(404).json({
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "Route not found.",
    },
  });
});

app.use(errorHandler);
