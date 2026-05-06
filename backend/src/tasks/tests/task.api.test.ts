import request from "supertest";
import { afterAll, beforeEach, describe, expect, it } from "vitest";
import { app } from "../../app.js";
import { prisma } from "../../lib/prisma.js";

describe("Task API", () => {
  beforeEach(async () => {
    await prisma.task.deleteMany();
  });

  afterAll(async () => {
    await prisma.task.deleteMany();
    await prisma.$disconnect();
  });

  it("creates a task, moves it through allowed statuses, and lists tasks", async () => {
    const createResponse = await request(app)
      .post("/tasks")
      .send({
        title: "Write tests",
        description: "Cover the main task API flow",
      })
      .expect(201);

    expect(createResponse.body.data).toMatchObject({
      title: "Write tests",
      description: "Cover the main task API flow",
      status: "TODO",
    });

    const taskId = createResponse.body.data.id;
    expect(taskId).toEqual(expect.any(String));

    const inProgressResponse = await request(app)
      .patch(`/tasks/${taskId}/status`)
      .send({ status: "IN_PROGRESS" })
      .expect(200);

    expect(inProgressResponse.body.data).toMatchObject({
      id: taskId,
      status: "IN_PROGRESS",
    });

    const doneResponse = await request(app)
      .patch(`/tasks/${taskId}/status`)
      .send({ status: "DONE" })
      .expect(200);

    expect(doneResponse.body.data).toMatchObject({
      id: taskId,
      status: "DONE",
    });

    const listResponse = await request(app).get("/tasks").expect(200);

    expect(listResponse.body).toMatchObject({
      items: [expect.objectContaining({ id: taskId, status: "DONE" })],
      total: 1,
      page: 1,
      limit: 5,
    });
  });
});
