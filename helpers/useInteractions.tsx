import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getInteractionsList, InputType as ListInputType } from "../endpoints/interactions/list_GET.schema";
import { postInteractionsCreate, InputType as CreateInputType } from "../endpoints/interactions/create_POST.schema";
import { getInteractionsStats } from "../endpoints/interactions/stats_GET.schema";

export const interactionsKeys = {
  all: ["interactions"] as const,
  lists: () => [...interactionsKeys.all, "list"] as const,
  list: (params: ListInputType) => [...interactionsKeys.lists(), params] as const,
  stats: () => [...interactionsKeys.all, "stats"] as const,
};

export function useInteractionsList(params: ListInputType) {
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
    mutationFn: (data: CreateInputType) => postInteractionsCreate(data),
    onSuccess: () => {
      // Invalidate relevant queries to refresh data
      queryClient.invalidateQueries({ queryKey: interactionsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: interactionsKeys.stats() });
    },
  });
}