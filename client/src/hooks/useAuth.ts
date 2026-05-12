import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { queryKeys } from "@/lib/queryKeys";
import type { ApiResponse, User } from "@/types/Api";
import { useQuery } from "@tanstack/react-query";

export const useMe = () => {
  const { user: firebaseUser } = useAuth();

  return useQuery({
    queryKey: queryKeys.me,
    queryFn: async () => {
      const res = await api.get<ApiResponse<User>>("/api/auth/me");
      return res.data.data;
    },
    enabled: !!firebaseUser,
  });
};
