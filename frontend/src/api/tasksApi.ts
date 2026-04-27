export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";

export type Task = {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskInput = {
  title: string;
  description: string;
};

export type UpdateTaskInput = {
  title: string;
  description: string;
};

type ApiResponse<T> = {
  data: T;
};

type ApiErrorResponse = {
  error?: {
    message?: string;
  };
};

const requestJson = async <T>(
  path: string,
  options: RequestInit = {},
): Promise<T> => {
  const response = await fetch(`/api${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => ({}))) as ApiErrorResponse;
    throw new Error(body.error?.message ?? "Request failed.");
  }

  if (response.status === 204) {
    return undefined as T;
  }

  const body = (await response.json()) as ApiResponse<T>;
  return body.data;
};

export const tasksApi = {
  listTasks: () => requestJson<Task[]>("/tasks"),

  createTask: (input: CreateTaskInput) =>
    requestJson<Task>("/tasks", {
      method: "POST",
      body: JSON.stringify(input),
    }),

  updateTask: (id: string, input: UpdateTaskInput) =>
    requestJson<Task>(`/tasks/${id}`, {
      method: "PUT",
      body: JSON.stringify(input),
    }),

  deleteTask: (id: string) =>
    requestJson<void>(`/tasks/${id}`, {
      method: "DELETE",
    }),

  updateTaskStatus: (id: string, status: TaskStatus) =>
    requestJson<Task>(`/tasks/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
