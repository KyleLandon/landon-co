import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

export function useAuth() {
  const { data: user, isLoading, error, refetch } = useQuery<User | null>({
    queryKey: ["/api/auth/user"],
    retry: (failureCount, error) => {
      // Don't retry on 401 or 403 errors
      if (error.message.includes("401") || error.message.includes("403")) {
        return false;
      }
      return failureCount < 2;
    },
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async ({ queryKey }) => {
      try {
        const res = await fetch(queryKey[0] as string, {
          credentials: "include",
        });

        // If 401, return null instead of throwing error
        if (res.status === 401) {
          return null;
        }

        if (!res.ok) {
          const text = await res.text();
          throw new Error(`${res.status}: ${text}`);
        }

        return res.json();
      } catch (err) {
        // Network errors or other issues
        console.warn("Auth check failed:", err);
        throw err;
      }
    },
  });

  // User is authenticated if we have user data
  const isAuthenticated = !!user;
  const hasAuthError = error && !error.message.includes("401");

  return {
    user: user || null,
    isLoading,
    isAuthenticated,
    isAdmin: user?.role === "admin",
    authError: hasAuthError ? error : null,
    refetchAuth: refetch,
  };
}