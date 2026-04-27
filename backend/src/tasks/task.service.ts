import { TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, conflict, notFound } from "./task.errors.js";

const taskStatuses = Object.values(TaskStatus);

type CreateTaskInput = {
  title?: unknown;
  description?: unknown;
  status?: unknown;
};

type UpdateTaskInput = {
  title?: unknown;
  description?: unknown;
  status?: unknown;
};

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === "string" && taskStatuses.includes(value as TaskStatus);

const requireNonEmptyString = (value: unknown, field: string) => {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest(`${field} is required and must be a non-empty string.`);
  }

  return value.trim();
};

const optionalNonEmptyString = (value: unknown, field: string) => {
  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== "string" || value.trim().length === 0) {
    throw badRequest(`${field} must be a non-empty string when provided.`);
  }

  return value.trim();
};

const parseStatus = (value: unknown) => {
  if (!isTaskStatus(value)) {
    throw badRequest(
      `status must be one of: ${taskStatuses.join(", ")}.`,
      "INVALID_TASK_STATUS",
    );
  }

  return value;
};

export const validateStatusTransition = (from: TaskStatus, to: TaskStatus) => {
  if (from === to) {
    return;
  }

  if (from === TaskStatus.TODO && to === TaskStatus.IN_PROGRESS) {
    return;
  }

  if (from === TaskStatus.IN_PROGRESS && to === TaskStatus.DONE) {
    return;
  }

  if (from === TaskStatus.DONE) {
    throw conflict("DONE is terminal and cannot transition to another status.");
  }

  throw conflict(`Status transition ${from} -> ${to} is not allowed.`);
};

const findTaskOrThrow = async (id: string) => {
  const task = await prisma.task.findUnique({ where: { id } });

  if (!task) {
    throw notFound(`Task with id "${id}" was not found.`, "TASK_NOT_FOUND");
  }

  return task;
};

export const taskService = {
  listTasks: () =>
    prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    }),

  getTask: (id: string) => findTaskOrThrow(id),

  async createTask(input: CreateTaskInput) {
    const title = requireNonEmptyString(input.title, "title");
    const description = requireNonEmptyString(input.description, "description");
    const status =
      input.status === undefined ? TaskStatus.TODO : parseStatus(input.status);

    if (status !== TaskStatus.TODO) {
      throw badRequest("New tasks must start with TODO status.");
    }

    return prisma.task.create({
      data: {
        title,
        description,
        status,
      },
    });
  },

  async updateTask(id: string, input: UpdateTaskInput) {
    const existingTask = await findTaskOrThrow(id);
    const title = optionalNonEmptyString(input.title, "title");
    const description = optionalNonEmptyString(input.description, "description");
    const status =
      input.status === undefined ? undefined : parseStatus(input.status);

    if (status !== undefined) {
      validateStatusTransition(existingTask.status, status);
    }

    if (
      title === undefined &&
      description === undefined &&
      status === undefined
    ) {
      throw badRequest(
        "At least one of title, description, or status must be provided.",
      );
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(title !== undefined ? { title } : {}),
        ...(description !== undefined ? { description } : {}),
        ...(status !== undefined ? { status } : {}),
      },
    });
  },

  async updateTaskStatus(id: string, input: { status?: unknown }) {
    const existingTask = await findTaskOrThrow(id);
    const status = parseStatus(input.status);

    validateStatusTransition(existingTask.status, status);

    return prisma.task.update({
      where: { id },
      data: { status },
    });
  },

  async deleteTask(id: string) {
    await findTaskOrThrow(id);
    await prisma.task.delete({ where: { id } });
  },
};
