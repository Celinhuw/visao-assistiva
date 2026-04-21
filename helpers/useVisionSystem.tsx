import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { postVisionAnalyze } from "../endpoints/vision/analyze_POST.schema.js";
import { useSettings } from "./useSettings.js";

export type VisionMode = "full" | "smart" | null;

interface VisionSystemContextType {
  isActive: boolean;
  mode: VisionMode;
  currentDescription: string;
  isProcessing: boolean;
  isSpeaking: boolean;
  error: string | null;
  cameraStream: MediaStream | null;
  frameCount: number;
  startVision: (mode: "full" | "smart") => Promise<void>;
  stopVision: () => void;
}

const VisionSystemContext = createContext<VisionSystemContextType | undefined>(
  undefined
);

export const VisionSystemProvider = ({ children }: { children: ReactNode }) => {
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<VisionMode>(null);
  const [currentDescription, setCurrentDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [frameCount, setFrameCount] = useState(0);

  const { data: settings } = useSettings();

  // Refs for loop and state tracking inside intervals
  const streamRef = useRef<MediaStream | null>(null);
  const intervalRef = useRef<number | null>(null);
  const isProcessingRef = useRef(false);
  const isSpeakingRef = useRef(false);
  const previousContextRef = useRef("");
  const modeRef = useRef<VisionMode>(null);
  const isActiveRef = useRef(false);

  // Web Speech Refs
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const recognitionRef = useRef<any>(null);

  // Hidden video element for capturing frames
  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      synthesisRef.current = window.speechSynthesis;

      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.lang = "pt-BR";
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onresult = (event: any) => {
          const transcript =
            event.results[event.results.length - 1][0].transcript
              .trim()
              .toLowerCase();
          
          if (transcript.includes("vision total ligar")) {
            startVision("full");
          } else if (transcript.includes("vision inteligente ligar")) {
            startVision("smart");
          } else if (transcript.includes("vision desligar")) {
            stopVision();
          }
        };

        recognitionRef.current.onerror = (e: any) => {
          if (e.error !== "no-speech" && e.error !== "aborted") {
            console.warn("Speech recognition error:", e.error);
          }
        };
      }

      hiddenVideoRef.current = document.createElement("video");
      hiddenVideoRef.current.autoplay = true;
      hiddenVideoRef.current.playsInline = true;
      hiddenVideoRef.current.muted = true;
    }

    return () => {
      stopVision();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync state to refs for interval access
  useEffect(() => {
    isProcessingRef.current = isProcessing;
    isSpeakingRef.current = isSpeaking;
    isActiveRef.current = isActive;
    modeRef.current = mode;
  }, [isProcessing, isSpeaking, isActive, mode]);

  // Manage Background Voice Commands
  // Keep recognition running at all times so user can say "Vision desligar" even when active
  useEffect(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        // Ignore if already started
      }
    }
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore
        }
      }
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const speak = useCallback(
    (text: string) => {
      if (!synthesisRef.current) return;
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "pt-BR";

      let rate = 1.0;
      if (settings?.speechRate === "slow") rate = 0.8;
      if (settings?.speechRate === "fast") rate = 1.2;
      utterance.rate = rate;

      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      synthesisRef.current.speak(utterance);
    },
    [settings?.speechRate]
  );

  const captureFrame = useCallback((): string | null => {
    const video = hiddenVideoRef.current;
    if (!video || !video.videoWidth || !video.videoHeight) return null;

    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/jpeg", 0.6);
  }, []);

  const analyzeLoop = useCallback(async () => {
    if (
      !isActiveRef.current ||
      isProcessingRef.current ||
      isSpeakingRef.current ||
      !modeRef.current
    ) {
      return;
    }

    const base64Image = captureFrame();
    if (!base64Image) return;

    setIsProcessing(true);
    setFrameCount((prev) => prev + 1);

    try {
      const result = await postVisionAnalyze({
        imageBase64: base64Image,
        mode: modeRef.current,
        previousContext: previousContextRef.current,
      });

      if (result.hasChange && result.description) {
        setCurrentDescription(result.description);
        previousContextRef.current = result.description;
        speak(result.description);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Erro ao processar imagem";
      console.error(msg);
      setError("Falha na análise da imagem.");
    } finally {
      setIsProcessing(false);
    }
  }, [captureFrame, speak]);

  const startVision = useCallback(
    async (selectedMode: "full" | "smart") => {
      try {
        setError(null);
        if (synthesisRef.current) synthesisRef.current.cancel();
        
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: 640, height: 480 },
        });

        streamRef.current = stream;
        setCameraStream(stream);

        if (hiddenVideoRef.current) {
          hiddenVideoRef.current.srcObject = stream;
        }

        setIsActive(true);
        setMode(selectedMode);
        modeRef.current = selectedMode;
        isActiveRef.current = true;
        setCurrentDescription("");
        previousContextRef.current = "";
        setFrameCount(0);

        const announce = `Modo ${selectedMode === "full" ? "Total" : "Inteligente"} ativado.`;
        speak(announce);

        // Calculate interval
        let intervalTime = 3000;
        if (selectedMode === "full") {
          intervalTime = Math.max(2000, settings?.updateIntervalMs || 3000);
        } else {
          intervalTime = 2000;
        }

        if (intervalRef.current) clearInterval(intervalRef.current);
        intervalRef.current = window.setInterval(analyzeLoop, intervalTime);

      } catch (err) {
        const msg = err instanceof Error ? err.message : "Erro desconhecido";
        setError(`Acesso à câmera negado ou indisponível: ${msg}`);
        setIsActive(false);
        setMode(null);
      }
    },
    [analyzeLoop, settings?.updateIntervalMs, speak]
  );

  const stopVision = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (hiddenVideoRef.current) {
      hiddenVideoRef.current.srcObject = null;
    }

    if (synthesisRef.current) {
      synthesisRef.current.cancel();
    }

    if (isActiveRef.current) {
      speak("Vision desativado.");
    }

    setCameraStream(null);
    setIsActive(false);
    setMode(null);
    setIsProcessing(false);
    setIsSpeaking(false);
    isActiveRef.current = false;
  }, [speak]);

  return (
    <VisionSystemContext.Provider
      value={{
        isActive,
        mode,
        currentDescription,
        isProcessing,
        isSpeaking,
        error,
        cameraStream,
        frameCount,
        startVision,
        stopVision,
      }}
    >
      {children}
    </VisionSystemContext.Provider>
  );
};

export const useVisionSystem = (): VisionSystemContextType => {
  const context = useContext(VisionSystemContext);
  if (context === undefined) {
    throw new Error(
      "useVisionSystem deve ser usado dentro de um VisionSystemProvider"
    );
  }
  return context;
};