import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  tasksApi,
  type CreateTaskInput,
  type Task,
  type TaskStatus,
  type UpdateTaskInput,
} from "./tasksApi";

const tasksKey = ["tasks"] as const;

export function useTasksQuery() {
  return useQuery({
    queryKey: tasksKey,
    queryFn: tasksApi.listTasks,
  });
}

export function useCreateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateTaskInput) => tasksApi.createTask(input),
    onSuccess: (newTask) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old) => [
        newTask,
        ...(old ?? []),
      ]);
    },
  });
}

export function useUpdateTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateTaskInput }) =>
      tasksApi.updateTask(id, input),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old) =>
        old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    },
  });
}

export function useDeleteTaskMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => tasksApi.deleteTask(id),
    onSuccess: (_data, deletedId) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old) =>
        old?.filter((t) => t.id !== deletedId),
      );
    },
  });
}

export function useUpdateTaskStatusMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: TaskStatus }) =>
      tasksApi.updateTaskStatus(id, status),
    onSuccess: (updatedTask) => {
      queryClient.setQueryData<Task[]>(tasksKey, (old) =>
        old?.map((t) => (t.id === updatedTask.id ? updatedTask : t)),
      );
    },
  });
}
