import { useMediaQuery } from "./useMediaQuery.js";

export const useIsMobile = (): boolean => {
  return useMediaQuery("(max-width: 767px)");
};
