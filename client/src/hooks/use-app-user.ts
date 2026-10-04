import { useClerk, useUser } from "@clerk/react";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@/types";

// Clerk owns identity; this query overlays the app's locally stored role.
export function useAppUser() {
  const { user: clerkUser, isLoaded, isSignedIn } = useUser();
  const { signOut, openUserProfile } = useClerk();
  const { data, isLoading, error, refetch } = useQuery<Pick<User, "id" | "role">>({
    queryKey: ["/api/me"],
    enabled: isLoaded && !!isSignedIn,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });
  const user = clerkUser && data ? {
    ...data,
    id: clerkUser.externalId ?? clerkUser.id,
    firstName: clerkUser.firstName ?? undefined,
    lastName: clerkUser.lastName ?? undefined,
    email: clerkUser.primaryEmailAddress?.emailAddress ?? "",
    profileImageUrl: clerkUser.imageUrl,
    createdAt: clerkUser.createdAt ?? new Date(),
    updatedAt: clerkUser.updatedAt ?? new Date(),
  } : null;
  return {
    user,
    isLoading: !isLoaded || (!!isSignedIn && isLoading),
    isAuthenticated: !!isSignedIn,
    isAdmin: data?.role === "admin",
    authError: isSignedIn ? error : null,
    refetchAuth: refetch,
    logout: () => signOut({ redirectUrl: import.meta.env.BASE_URL }),
    updateProfile: async (updates: { firstName: string; lastName: string; email: string }) => {
      if (!clerkUser) throw new Error("Sign in to update your profile");
      await clerkUser.update({ firstName: updates.firstName, lastName: updates.lastName });
      if (updates.email !== clerkUser.primaryEmailAddress?.emailAddress) {
        openUserProfile();
        throw new Error("Your name was saved. Use the account settings window to add and verify your new email address.");
      }
    },
  };
}