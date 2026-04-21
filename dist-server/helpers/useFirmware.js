import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getFirmwareList } from "../endpoints/firmware/list_GET.schema.js";
import { postFirmwareInstall } from "../endpoints/firmware/install_POST.schema.js";
export const FIRMWARE_QUERY_KEY = ["firmwareList"];
export const useFirmwareList = () => {
    return useQuery({
        queryKey: FIRMWARE_QUERY_KEY,
        queryFn: () => getFirmwareList(),
    });
};
export const useInstallFirmware = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (firmwareId) => postFirmwareInstall({ firmwareId }),
        onSuccess: () => {
            // Invalidate the firmware list query to force a refetch so UI updates to show the installed version correctly
            queryClient.invalidateQueries({ queryKey: FIRMWARE_QUERY_KEY });
        },
    });
};
