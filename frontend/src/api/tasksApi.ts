import axios from "axios";

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

export type PaginatedTasksResponse = {
  items: Task[];
  total: number;
  page: number;
  limit: number;
};

export type ListTasksParams = {
  page?: number;
  limit?: number;
  search?: string;
};

const http = axios.create({
  baseURL: "/api",
});

export const tasksApi = {
  listTasks: async (params?: ListTasksParams) => {
    const query: Record<string, string | number> = {};
    if (params?.page) query.page = params.page;
    if (params?.limit) query.limit = params.limit;
    if (params?.search) query.search = params.search;
    const res = await http.get<PaginatedTasksResponse>("/tasks", {
      params: query,
    });
    return res.data;
  },

  createTask: async (input: CreateTaskInput) => {
    const res = await http.post<{ data: Task }>("/tasks", input);
    return res.data.data;
  },

  updateTask: async (id: string, input: UpdateTaskInput) => {
    const res = await http.put<{ data: Task }>(`/tasks/${id}`, input);
    return res.data.data;
  },

  deleteTask: async (id: string) => {
    await http.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    const res = await http.patch<{ data: Task }>(`/tasks/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};
