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

type ApiResponse<T> = {
  data: T;
};

const http = axios.create({
  baseURL: "/api",
});

export const tasksApi = {
  listTasks: async () => {
    const res = await http.get<ApiResponse<Task[]>>("/tasks");
    return res.data.data;
  },

  createTask: async (input: CreateTaskInput) => {
    const res = await http.post<ApiResponse<Task>>("/tasks", input);
    return res.data.data;
  },

  updateTask: async (id: string, input: UpdateTaskInput) => {
    const res = await http.put<ApiResponse<Task>>(`/tasks/${id}`, input);
    return res.data.data;
  },

  deleteTask: async (id: string) => {
    await http.delete(`/tasks/${id}`);
  },

  updateTaskStatus: async (id: string, status: TaskStatus) => {
    const res = await http.patch<ApiResponse<Task>>(`/tasks/${id}/status`, {
      status,
    });
    return res.data.data;
  },
};
