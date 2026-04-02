import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSettings } from "../endpoints/settings_GET.schema";
import { postUpdateSettings, InputType as UpdateSettingsInput } from "../endpoints/settings/update_POST.schema";

export const SETTINGS_QUERY_KEY = ["settings"];

export function useSettings() {
  return useQuery({
    queryKey: SETTINGS_QUERY_KEY,
    queryFn: () => getSettings(),
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateSettingsInput) => postUpdateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: SETTINGS_QUERY_KEY });
    },
  });
}