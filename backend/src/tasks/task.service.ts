import { TaskStatus } from "@prisma/client";
import { prisma } from "../lib/prisma.js";
import { badRequest, conflict, notFound } from "./task.errors.js";
import { TASK_ERROR_CODES } from "./task.const.js";
import type {
  CreateTaskInput,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "./task.types.js";

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
    throw notFound(
      `Task with id "${id}" was not found.`,
      TASK_ERROR_CODES.TASK_NOT_FOUND,
    );
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
    if (input.status !== TaskStatus.TODO) {
      throw badRequest("New tasks must start with TODO status.");
    }

    return prisma.task.create({
      data: {
        title: input.title,
        description: input.description,
        status: input.status,
      },
    });
  },

  async updateTask(id: string, input: UpdateTaskInput) {
    const existingTask = await findTaskOrThrow(id);

    if (input.status !== undefined) {
      validateStatusTransition(existingTask.status, input.status);
    }

    if (
      input.title === undefined &&
      input.description === undefined &&
      input.status === undefined
    ) {
      throw badRequest(
        "At least one of title, description, or status must be provided.",
      );
    }

    return prisma.task.update({
      where: { id },
      data: {
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
      },
    });
  },

  async updateTaskStatus(id: string, input: UpdateTaskStatusInput) {
    const existingTask = await findTaskOrThrow(id);

    validateStatusTransition(existingTask.status, input.status);

    return prisma.task.update({
      where: { id },
      data: { status: input.status },
    });
  },

  async deleteTask(id: string) {
    await findTaskOrThrow(id);
    await prisma.task.delete({ where: { id } });
  },
};
