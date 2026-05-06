import { TaskStatus } from "@prisma/client";
import type { RequestHandler } from "express";
import { badRequest } from "../lib/app-error.js";
import { PAGINATION, TASK_ERROR_CODES, TASK_STATUSES } from "./task.const.js";
import type {
  CreateTaskInput,
  ListTasksParams,
  TaskRouteLocals,
  UpdateTaskInput,
  UpdateTaskStatusInput,
} from "./task.types.js";

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const isTaskStatus = (value: unknown): value is TaskStatus =>
  typeof value === "string" && TASK_STATUSES.includes(value as TaskStatus);

const requireBody = (body: unknown) => {
  if (!isRecord(body)) {
    throw badRequest("Request body must be a JSON object.");
  }

  return body;
};

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

const optionalTaskStatus = (value: unknown) => {
  if (value === undefined) {
    return undefined;
  }

  return requireTaskStatus(value);
};

const requireTaskStatus = (value: unknown) => {
  if (!isTaskStatus(value)) {
    throw badRequest(
      `status must be one of: ${TASK_STATUSES.join(", ")}.`,
      TASK_ERROR_CODES.INVALID_TASK_STATUS,
    );
  }

  return value;
};

export const validateTaskId: RequestHandler<
  { id: string },
  unknown,
  unknown,
  unknown,
  TaskRouteLocals
> = (req, res, next) => {
  const id = req.params.id;

  if (typeof id !== "string" || id.trim().length === 0) {
    next(badRequest("Task id is required.", TASK_ERROR_CODES.INVALID_TASK_ID));
    return;
  }

  res.locals.taskId = id;
  next();
};

export const validateCreateTaskBody: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown,
  TaskRouteLocals
> = (req, res, next) => {
  const body = requireBody(req.body);
  const status = optionalTaskStatus(body.status) ?? TaskStatus.TODO;

  const input: CreateTaskInput = {
    title: requireNonEmptyString(body.title, "title"),
    description: requireNonEmptyString(body.description, "description"),
    status,
  };

  res.locals.createTaskInput = input;
  next();
};

export const validateUpdateTaskBody: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown,
  TaskRouteLocals
> = (req, res, next) => {
  const body = requireBody(req.body);
  const input: UpdateTaskInput = {
    title: optionalNonEmptyString(body.title, "title"),
    description: optionalNonEmptyString(body.description, "description"),
    status: optionalTaskStatus(body.status),
  };

  if (
    input.title === undefined &&
    input.description === undefined &&
    input.status === undefined
  ) {
    throw badRequest(
      "At least one of title, description, or status must be provided.",
    );
  }

  res.locals.updateTaskInput = input;
  next();
};

export const validateUpdateTaskStatusBody: RequestHandler<
  unknown,
  unknown,
  unknown,
  unknown,
  TaskRouteLocals
> = (req, res, next) => {
  const body = requireBody(req.body);
  const input: UpdateTaskStatusInput = {
    status: requireTaskStatus(body.status),
  };

  res.locals.updateTaskStatusInput = input;
  next();
};

const parsePositiveInt = (value: unknown, field: string, fallback: number) => {
  if (value === undefined) {
    return fallback;
  }

  const n = Number(value);
  if (!Number.isInteger(n) || n < 1) {
    throw badRequest(`${field} must be a positive integer.`);
  }

  return n;
};

export const validateListTasksQuery: RequestHandler<
  unknown,
  unknown,
  unknown,
  Record<string, unknown>,
  TaskRouteLocals
> = (req, res, next) => {
  const query = req.query;
  const page = parsePositiveInt(query.page, "page", PAGINATION.DEFAULT_PAGE);
  const limit = parsePositiveInt(query.limit, "limit", PAGINATION.DEFAULT_LIMIT);

  if (limit > PAGINATION.MAX_LIMIT) {
    throw badRequest(`limit must not exceed ${PAGINATION.MAX_LIMIT}.`);
  }

  const search = typeof query.search === "string" && query.search.length > 0
    ? query.search
    : undefined;

  const params: ListTasksParams = { page, limit, search };

  res.locals.listTasksParams = params;
  next();
};
