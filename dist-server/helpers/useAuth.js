import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useCallback, } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "../endpoints/auth/session_GET.schema.js";
import { postLogout } from "../endpoints/auth/logout_POST.schema.js";
// React Query key for auth session. Make sure to optimistically update user infos using this.
export const AUTH_QUERY_KEY = ["auth", "session"];
const AuthContext = createContext(undefined);
// Add this to components/_globalContextProviders but not any pageLayout files.
// Make sure it's within the QueryClientProvider
export const AuthProvider = ({ children, }) => {
    const queryClient = useQueryClient();
    const { data, error, status, refetch } = useQuery({
        queryKey: AUTH_QUERY_KEY,
        queryFn: async () => {
            const result = await getSession();
            if ("error" in result) {
                throw new Error(result.error);
            }
            return result.user;
        },
        retry: 1,
        enabled: true,
        staleTime: Infinity,
    });
    const authState = status === "pending"
        ? { type: "loading" }
        : status === "error"
            ? {
                type: "unauthenticated",
                errorMessage: error instanceof Error ? error.message : "Session check failed",
            }
            : data
                ? { type: "authenticated", user: data }
                : { type: "unauthenticated" };
    const logout = useCallback(async () => {
        // Optimistically update UI
        queryClient.setQueryData(AUTH_QUERY_KEY, null);
        // Make the actual API call
        await postLogout();
        // Invalidate all queries after login so previous user's state don't corrupt new user state.
        queryClient.resetQueries();
    }, [queryClient]);
    // This should only be used for login. For user profile changes, create separate endpoints and react query hooks
    // and update the data linked to AUTH_QUERY_KEY.
    const onLogin = useCallback((user) => {
        queryClient.setQueryData(AUTH_QUERY_KEY, user);
    }, [queryClient]);
    return (_jsx(AuthContext.Provider, { value: { authState, logout, onLogin }, children: children }));
};
// Prefer using protectedRoutes instead of this hook unless the route doesn't need to be protected (e.g. login/register)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within a AuthProvider");
    }
    return context;
};
