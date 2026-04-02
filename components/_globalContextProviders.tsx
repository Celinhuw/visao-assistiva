import { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeModeProvider } from "../helpers/themeMode";
import { AuthProvider } from "../helpers/useAuth";
import { BluetoothProvider } from "../helpers/useBluetooth";
import { VisionSystemProvider } from "../helpers/useVisionSystem";
import { VoiceAssistantProvider } from "../helpers/useVoiceAssistant";
import { TooltipProvider } from "./Tooltip";
import { SonnerToaster } from "./SonnerToaster";
import { ScrollToHashElement } from "./ScrollToHashElement";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute “fresh” window
    },
  },
});

export const GlobalContextProviders = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeModeProvider>
        <VisionSystemProvider>
        <BluetoothProvider>
          <VoiceAssistantProvider>
            <ScrollToHashElement />
            <TooltipProvider>
              {children}
              <SonnerToaster />
            </TooltipProvider>
          </VoiceAssistantProvider>
        </BluetoothProvider>
        </VisionSystemProvider>
        </ThemeModeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};
