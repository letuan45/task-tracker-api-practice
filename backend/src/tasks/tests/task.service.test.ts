import { TaskStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { AppError } from "../../lib/app-error.js";
import { validateStatusTransition } from "../task.service.js";

describe("validateStatusTransition", () => {
  it("allows TODO -> IN_PROGRESS", () => {
    expect(() =>
      validateStatusTransition(TaskStatus.TODO, TaskStatus.IN_PROGRESS),
    ).not.toThrow();
  });

  it("allows IN_PROGRESS -> DONE", () => {
    expect(() =>
      validateStatusTransition(TaskStatus.IN_PROGRESS, TaskStatus.DONE),
    ).not.toThrow();
  });

  it("blocks TODO -> DONE directly", () => {
    expect(() =>
      validateStatusTransition(TaskStatus.TODO, TaskStatus.DONE),
    ).toThrow(AppError);
  });

  it("blocks transitions out of DONE", () => {
    expect(() =>
      validateStatusTransition(TaskStatus.DONE, TaskStatus.TODO),
    ).toThrow("DONE is terminal");

    expect(() =>
      validateStatusTransition(TaskStatus.DONE, TaskStatus.IN_PROGRESS),
    ).toThrow("DONE is terminal");
  });
});
