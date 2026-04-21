import { useState, useRef, useCallback, useEffect } from "react";
import superjson from "superjson";
import { postAssistantApiUrl, InputType } from "../endpoints/ai/assistant_POST.schema.js";

export type MessageRole = "user" | "model";

export interface ChatMessage {
  id: string;
  role: MessageRole;
  text: string;
  timestamp: number;
}

interface UseAssistantOptions {
  autoSpeak?: boolean;
}

export function useAssistantChat(options: UseAssistantOptions = { autoSpeak: true }) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  // Initialize Speech Recognition & Synthesis
  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "pt-BR";
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
      }
    }
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!options.autoSpeak || !synthesisRef.current) return;
      synthesisRef.current.cancel(); // Stop any currently speaking audio
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";
      utterance.rate = 1.0;
      synthesisRef.current.speak(utterance);
    },
    [options.autoSpeak]
  );

  const stopSpeaking = useCallback(() => {
    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }
  }, []);

  const startListening = useCallback(
    (onResult: (text: string) => void) => {
      if (!recognitionRef.current) {
        setError("Reconhecimento de voz não suportado neste navegador.");
        return;
      }

      setError(null);
      stopSpeaking();

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognitionRef.current.onerror = (event: any) => {
        setIsListening(false);
        if (event.error !== "no-speech") {
          setError(`Erro no microfone: ${event.error}`);
        }
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };

      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (err) {
        console.error("Speech recognition start error", err);
      }
    },
    [stopSpeaking]
  );

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  }, [isListening]);

  const sendMessage = useCallback(
    async (text: string, imageBase64?: string) => {
      if (!text.trim() && !imageBase64) return;

      stopSpeaking();
      stopListening();

      const userMessage: ChatMessage = {
        id: crypto.randomUUID(),
        role: "user",
        text,
        timestamp: Date.now(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);
      setError(null);

      const modelMessageId = crypto.randomUUID();
      setMessages((prev) => [
        ...prev,
        { id: modelMessageId, role: "model", text: "", timestamp: Date.now() },
      ]);

      try {
        // Exclude the current message we just added from the history
        const conversationHistory = messages.map((m) => ({
          role: m.role,
          text: m.text,
        }));

        const payload: InputType = {
          message: text,
          imageBase64,
          conversationHistory,
        };

        const response = await fetch(postAssistantApiUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: superjson.stringify(payload),
        });

        if (!response.ok) {
          throw new Error("Falha ao comunicar com o servidor.");
        }

        const reader = response.body?.getReader();
        const decoder = new TextDecoder("utf-8");
        let accumulatedText = "";
        let buffer = "";

        if (reader) {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");
            buffer = lines.pop() || ""; // keep incomplete line in buffer

            for (const line of lines) {
              if (line.startsWith("data: ") && line.trim() !== "data:") {
                try {
                  const data = JSON.parse(line.slice(6));
                  const chunkText =
                    data.candidates?.[0]?.content?.parts?.[0]?.text || "";
                  accumulatedText += chunkText;

                  // Update the model message in state
                  setMessages((prev) =>
                    prev.map((msg) =>
                      msg.id === modelMessageId
                        ? { ...msg, text: accumulatedText }
                        : msg
                    )
                  );
                } catch (e) {
                  // ignore parse error on chunks
                }
              }
            }
          }
        }

        // Final speaking after full stream is complete
        speak(accumulatedText);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Erro desconhecido";
        setError(errorMessage);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === modelMessageId
              ? { ...msg, text: "Ocorreu um erro ao gerar a resposta." }
              : msg
          )
        );
      } finally {
        setIsStreaming(false);
      }
    },
    [messages, speak, stopListening, stopSpeaking]
  );

  return {
    messages,
    isStreaming,
    isListening,
    error,
    sendMessage,
    startListening,
    stopListening,
    stopSpeaking,
    hasSpeechRecognition: !!recognitionRef.current,
  };
}