import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type {
  ApiResponse,
  CompleteTaskResponse,
  DailyPass,
  StartTaskResponse,
  Task,
} from "@/types/Api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useStartTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      durationMinutes = 50,
    }: {
      taskId: string;
      durationMinutes?: number;
    }) => {
      const res = await api.patch<ApiResponse<StartTaskResponse>>(
        `/api/tasks/${taskId}/start`,
        { durationMinutes },
      );
      return res.data.data;
    },
    onSuccess: ({ task }) => {
      qc.setQueryData<DailyPass | null>(queryKeys.todayPass, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) => (t.id === task.id ? task : t)),
        };
      });
    },
  });
};

export const useCompleteTask = () => {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      sessionId,
      actualMinutes,
    }: {
      taskId: string;
      sessionId: string;
      actualMinutes: number;
    }) => {
      const res = await api.patch<ApiResponse<CompleteTaskResponse>>(
        `/api/tasks/${taskId}/complete`,
        { sessionId, actualMinutes },
      );
      return res.data.data;
    },
    onSuccess: (result, { taskId }) => {
      qc.setQueryData<DailyPass | null>(queryKeys.todayPass, (old) => {
        if (!old) return old;
        return {
          ...old,
          completionRate: result.completionRate,
          tasks: old.tasks.map((t) =>
            t.id === taskId
              ? {
                  ...t,
                  status: "DONE" as const,
                  completedAt: new Date().toISOString(),
                }
              : t,
          ),
        };
      });
      qc.invalidateQueries({ queryKey: queryKeys.balance });
      qc.invalidateQueries({ queryKey: queryKeys.overview });
    },
  });
};

export function useUpdateTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async ({
      taskId,
      ...body
    }: {
      taskId: string;
      title?: string;
      difficulty?: "EASY" | "MEDIUM" | "HARD";
      order?: number;
    }) => {
      const res = await api.patch<ApiResponse<Task>>(
        `/api/tasks/${taskId}`,
        body,
      );
      return res.data.data;
    },
    onSuccess: (updated) => {
      qc.setQueryData<DailyPass | null>(queryKeys.todayPass, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.map((t) => (t.id === updated.id ? updated : t)),
        };
      });
    },
  });
}

export function useDeleteTask() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: async (taskId: string) => {
      await api.delete(`/api/tasks/${taskId}`);
      return taskId;
    },
    onSuccess: (taskId) => {
      qc.setQueryData<DailyPass | null>(queryKeys.todayPass, (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: old.tasks.filter((t) => t.id !== taskId),
        };
      });
    },
  });
}
