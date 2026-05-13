import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { ApiResponse, CreatePassInput, DailyPass } from "@/types/Api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useTodayPass = () => {
  return useQuery({
    queryKey: queryKeys.todayPass,
    queryFn: async () => {
      const res = await api.get<ApiResponse<DailyPass>>("/api/passes/today");
      return res.data.data;
    },
  });
};

export const useCreatePass = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: CreatePassInput) => {
      const res = await api.post<ApiResponse<DailyPass>>("/api/passes", input);
      return res.data.data;
    },
    onSuccess: (data) => {
      qc.setQueryData(queryKeys.todayPass, data);
    },
  });
};
