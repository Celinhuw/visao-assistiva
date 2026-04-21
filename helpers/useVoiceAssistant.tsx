import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import superjson from "superjson";
import { postAssistantApiUrl } from "../endpoints/ai/assistant_POST.schema.js";
import { useSettings } from "./useSettings.js";

export type VoiceAssistantPhase =
  | "idle"
  | "listening_wake"
  | "awake"
  | "listening_command"
  | "processing"
  | "speaking";

export type ChatMessage = {
  role: "user" | "model";
  text: string;
};

interface VoiceAssistantContextType {
  isEnabled: boolean;
  phase: VoiceAssistantPhase;
  lastUserInput: string;
  lastResponse: string;
  conversationHistory: ChatMessage[];
  error: string | null;
  enable: () => void;
  disable: () => void;
  clearHistory: () => void;
}

const VoiceAssistantContext = createContext<
  VoiceAssistantContextType | undefined
>(undefined);

// NOTE: When VoiceAssistant is enabled, the useVisionSystem's internal voice commands 
// should ideally be disabled to avoid conflicts. This assistant handles the "olá vision" 
// wake word exclusively and orchestrates the conversational interaction.
export const VoiceAssistantProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [phase, setPhase] = useState<VoiceAssistantPhase>("idle");
  const [lastUserInput, setLastUserInput] = useState("");
  const [lastResponse, setLastResponse] = useState("");
  const [conversationHistory, setConversationHistory] = useState<ChatMessage[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  const { data: settings } = useSettings();

  // Refs for state that's accessed inside async callbacks and event listeners
  const isEnabledRef = useRef(isEnabled);
  const phaseRef = useRef(phase);
  const historyRef = useRef(conversationHistory);
  const speechRateRef = useRef(1.0);

  // APIs refs
  const SpeechRecognitionCtorRef = useRef<any>(null);
  const wakeRecRef = useRef<any>(null);
  const commandRecRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const commandTimeoutRef = useRef<number | null>(null);

  // Keep refs in sync with state
  useEffect(() => {
    isEnabledRef.current = isEnabled;
    phaseRef.current = phase;
    historyRef.current = conversationHistory;
  }, [isEnabled, phase, conversationHistory]);

  // Keep speech rate in sync with settings
  useEffect(() => {
    if (settings?.speechRate === "slow") speechRateRef.current = 0.8;
    else if (settings?.speechRate === "fast") speechRateRef.current = 1.2;
    else speechRateRef.current = 1.0;
  }, [settings?.speechRate]);

  // Update phase helper
  const changePhase = useCallback((newPhase: VoiceAssistantPhase) => {
    setPhase(newPhase);
    phaseRef.current = newPhase;
  }, []);

  // Initialize browser speech APIs
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        SpeechRecognitionCtorRef.current = SpeechRecognition;
      } else {
        setError("Reconhecimento de voz não suportado neste navegador.");
      }
    }

    return () => {
      // Cleanup on unmount
      if (wakeRecRef.current) wakeRecRef.current.stop();
      if (commandRecRef.current) commandRecRef.current.stop();
      if (synthesisRef.current) synthesisRef.current.cancel();
      if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
    };
  }, []);

  // Centralized Text-to-Speech execution
  const speakText = useCallback(
    (text: string, onEndCallback: () => void) => {
      if (!synthesisRef.current || !isEnabledRef.current) {
        onEndCallback();
        return;
      }
      synthesisRef.current.cancel(); // Stop any current speech
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = speechRateRef.current;

      utterance.onend = () => {
        if (isEnabledRef.current) onEndCallback();
      };
      utterance.onerror = (e) => {
        console.error("Speech synthesis error", e);
        if (isEnabledRef.current) onEndCallback();
      };

      synthesisRef.current.speak(utterance);
    },
    []
  );

  // ---------------------------------------------------------------------------
  // Phase Transitions & Handlers
  // ---------------------------------------------------------------------------

  const goToListeningWake = useCallback(() => {
    if (!isEnabledRef.current) return;
    changePhase("listening_wake");

    if (commandRecRef.current) commandRecRef.current.stop();
    if (synthesisRef.current) synthesisRef.current.cancel();

    if (!wakeRecRef.current && SpeechRecognitionCtorRef.current) {
      const rec = new SpeechRecognitionCtorRef.current();
      rec.continuous = true;
      rec.interimResults = false;
      rec.lang = "pt-BR";

      rec.onresult = (event: any) => {
        if (phaseRef.current !== "listening_wake") return;
        const transcript =
          event.results[event.results.length - 1][0].transcript.toLowerCase();
        
        if (
          transcript.includes("olá vision") ||
          transcript.includes("ola vision")
        ) {
          rec.stop();
          goToAwake();
        }
      };

      rec.onend = () => {
        // Restart continuous listening if it drops and we are still in wake phase
        if (isEnabledRef.current && phaseRef.current === "listening_wake") {
          try {
            rec.start();
          } catch (e) {
            // ignore already started errors
          }
        }
      };

      rec.onerror = (e: any) => {
        if (e.error !== "no-speech" && e.error !== "aborted") {
          console.warn("Wake recognition error:", e.error);
        }
      };

      wakeRecRef.current = rec;
    }

    try {
      if (wakeRecRef.current) wakeRecRef.current.start();
    } catch (e) {
      // already started
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePhase]);

  const goToAwake = useCallback(() => {
    if (!isEnabledRef.current) return;
    changePhase("awake");
    if (wakeRecRef.current) wakeRecRef.current.stop();

    speakText("Estou ouvindo", () => {
      goToListeningCommand();
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePhase, speakText]);

  const goToListeningCommand = useCallback(() => {
    if (!isEnabledRef.current) return;
    changePhase("listening_command");

    const fallbackNoSpeech = () => {
      speakText("Não ouvi nada.", () => {
        goToListeningWake();
      });
    };

    if (!commandRecRef.current && SpeechRecognitionCtorRef.current) {
      const rec = new SpeechRecognitionCtorRef.current();
      rec.continuous = false; // Capture single command
      rec.interimResults = false;
      rec.lang = "pt-BR";

      rec.onresult = (event: any) => {
        if (phaseRef.current !== "listening_command") return;
        if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
        
        const transcript = event.results[0][0].transcript;
        goToProcessing(transcript);
      };

      rec.onerror = (event: any) => {
        if (phaseRef.current !== "listening_command") return;
        if (event.error === "no-speech") {
          if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
          fallbackNoSpeech();
        }
      };

      rec.onend = () => {
        if (phaseRef.current === "listening_command") {
          // If onend fires without a result triggering goToProcessing
          if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
          fallbackNoSpeech();
        }
      };

      commandRecRef.current = rec;
    }

    // Set 8-second timeout for silence
    if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
    commandTimeoutRef.current = window.setTimeout(() => {
      if (phaseRef.current === "listening_command") {
        if (commandRecRef.current) commandRecRef.current.stop();
        fallbackNoSpeech();
      }
    }, 8000);

    try {
      if (commandRecRef.current) commandRecRef.current.start();
    } catch (e) {
      // already started
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [changePhase, speakText, goToListeningWake]);

  const goToProcessing = useCallback(
    async (text: string) => {
      if (!isEnabledRef.current) return;
      changePhase("processing");
      setLastUserInput(text);

      try {
        const payload = {
          message: text,
          conversationHistory: historyRef.current,
        };

        const response = await fetch(postAssistantApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: superjson.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Falha ao comunicar com o servidor de IA.");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";
        let buffer = "";

        if (reader) {
          while (true) {
            if (!isEnabledRef.current) {
              reader.cancel();
              return;
            }
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || "";

            for (const line of lines) {
              if (line.startsWith("data: ") && line.trim() !== "data:") {
                try {
                  const data = JSON.parse(line.slice(6));
                  const chunkText =
                    data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  accumulatedText += chunkText;
                } catch (e) {
                  // ignore JSON parse error on chunks
                }
              }
            }
          }
        }

        if (!isEnabledRef.current) return;

        // Update history (max 20 items)
        const updatedHistory = [
          ...historyRef.current,
          { role: "user" as const, text },
          { role: "model" as const, text: accumulatedText },
        ].slice(-20);

        setConversationHistory(updatedHistory);
        historyRef.current = updatedHistory;
        setLastResponse(accumulatedText);

        goToSpeaking(accumulatedText);
      } catch (err) {
        if (!isEnabledRef.current) return;
        console.error(err);
        setError("Erro ao processar o comando.");
        speakText("Ocorreu um erro de conexão.", () => {
          goToListeningWake();
        });
      }
    },
    [changePhase, speakText, goToListeningWake]
  );

  const goToSpeaking = useCallback(
    (text: string) => {
      if (!isEnabledRef.current) return;
      changePhase("speaking");
      speakText(text, () => {
        goToListeningWake();
      });
    },
    [changePhase, speakText, goToListeningWake]
  );

  // ---------------------------------------------------------------------------
  // Public Methods
  // ---------------------------------------------------------------------------

  const enable = useCallback(() => {
    setIsEnabled(true);
    isEnabledRef.current = true;
    setError(null);
    goToListeningWake();
  }, [goToListeningWake]);

  const disable = useCallback(() => {
    setIsEnabled(false);
    isEnabledRef.current = false;
    changePhase("idle");

    if (wakeRecRef.current) wakeRecRef.current.stop();
    if (commandRecRef.current) commandRecRef.current.stop();
    if (synthesisRef.current) synthesisRef.current.cancel();
    if (commandTimeoutRef.current) clearTimeout(commandTimeoutRef.current);
  }, [changePhase]);

  const clearHistory = useCallback(() => {
    setConversationHistory([]);
    historyRef.current = [];
  }, []);

  return (
    <VoiceAssistantContext.Provider
      value={{
        isEnabled,
        phase,
        lastUserInput,
        lastResponse,
        conversationHistory,
        error,
        enable,
        disable,
        clearHistory,
      }}
    >
      {children}
    </VoiceAssistantContext.Provider>
  );
};

export const useVoiceAssistant = (): VoiceAssistantContextType => {
  const context = useContext(VoiceAssistantContext);
  if (context === undefined) {
    throw new Error(
      "useVoiceAssistant deve ser usado dentro de um VoiceAssistantProvider"
    );
  }
  return context;
};