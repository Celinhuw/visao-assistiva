import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInteractionsList } from "../endpoints/interactions/list_GET.schema.js";
import { postInteractionsCreate } from "../endpoints/interactions/create_POST.schema.js";
import { getInteractionsStats } from "../endpoints/interactions/stats_GET.schema.js";
export const interactionsKeys = {
    all: ["interactions"],
    lists: () => [...interactionsKeys.all, "list"],
    list: (params) => [...interactionsKeys.lists(), params],
    stats: () => [...interactionsKeys.all, "stats"],
};
export function useInteractionsList(params) {
    return useQuery({
        queryKey: interactionsKeys.list(params),
        queryFn: () => getInteractionsList(params),
    });
}
export function useInteractionsStats() {
    return useQuery({
        queryKey: interactionsKeys.stats(),
        queryFn: () => getInteractionsStats(),
    });
}
export function useInteractionCreate() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data) => postInteractionsCreate(data),
        onSuccess: () => {
            // Invalidate relevant queries to refresh data
            queryClient.invalidateQueries({ queryKey: interactionsKeys.lists() });
            queryClient.invalidateQueries({ queryKey: interactionsKeys.stats() });
        },
    });
}
