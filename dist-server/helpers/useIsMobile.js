import { useMediaQuery } from "./useMediaQuery.js";
export const useIsMobile = () => {
    return useMediaQuery("(max-width: 767px)");
};
