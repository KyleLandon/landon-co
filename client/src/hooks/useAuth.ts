import { useQuery } from "@tanstack/react-query";

export function useAuth() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ["/api/auth/user"],
    retry: false,
    refetchInterval: false,
    refetchOnWindowFocus: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
    queryFn: async ({ queryKey }) => {
      const res = await fetch(queryKey[0] as string, {
        credentials: "include",
      });

      // If 401, return null instead of throwing error
      if (res.status === 401) {
        return null;
      }

      if (!res.ok) {
        throw new Error(`${res.status}: ${await res.text()}`);
      }

      return res.json();
    },
  });

  // User is authenticated if we have user data
  const isAuthenticated = !!user;

  return {
    user: user || null,
    isLoading,
    isAuthenticated,
    isAdmin: user?.role === "admin",
  };
}