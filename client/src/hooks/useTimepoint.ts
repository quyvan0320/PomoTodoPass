import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { ApiResponse, Balance } from "@/types/Api";
import { useQuery } from "@tanstack/react-query";

export const useBalance = () => {
  return useQuery({
    queryKey: queryKeys.balance,
    queryFn: async () => {
      const res = await api.get<ApiResponse<Balance>>(
        "/api/timepoints/balance",
      );
      return res.data.data;``
    },
  });
};
