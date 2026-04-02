import React, { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet";
import { Mic, Send, Volume2, VolumeX, Image as ImageIcon, X, Headset } from "lucide-react";
import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { Spinner } from "../components/Spinner";
import { Badge } from "../components/Badge";
import { useAssistantChat } from "../helpers/useAssistant";
import { useVoiceAssistant } from "../helpers/useVoiceAssistant";
import styles from "./assistente.module.css";

export default function AssistentePage() {
  const [inputText, setInputText] = useState("");
  const [autoSpeak, setAutoSpeak] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    messages,
    isStreaming,
    isListening,
    error,
    sendMessage,
    startListening,
    stopListening,
    hasSpeechRecognition,
  } = useAssistantChat({ autoSpeak });

  const {
    isEnabled: voiceEnabled,
    phase: voicePhase,
    lastUserInput,
    lastResponse,
    conversationHistory,
    error: voiceError,
    enable: enableVoice,
    disable: disableVoice,
    clearHistory: clearVoiceHistory,
  } = useVoiceAssistant();

  const renderVoicePhaseBadge = () => {
    switch (voicePhase) {
      case "idle":
        return <Badge variant="secondary">Desativado</Badge>;
      case "listening_wake":
        return <Badge variant="primary" className={styles.pulseBadge}>Aguardando "Olá Vision"...</Badge>;
      case "awake":
        return <Badge variant="success">Detectado!</Badge>;
      case "listening_command":
        return <Badge variant="warning" className={styles.pulseBadge}>Ouvindo seu comando...</Badge>;
      case "processing":
        return (
          <Badge variant="secondary" className={styles.processingBadge}>
            <Spinner size="sm" /> Processando...
          </Badge>
        );
      case "speaking":
        return (
          <Badge variant="success" className={styles.speakingBadge}>
            <Volume2 size={14} /> Respondendo...
          </Badge>
        );
      default:
        return null;
    }
  };

  const truncatedVoiceResponse =
    lastResponse.length > 200 ? lastResponse.slice(0, 200) + "..." : lastResponse;

  // Auto-scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isStreaming]);

  const handleSend = () => {
    if ((!inputText.trim() && !selectedImage) || isStreaming) return;
    sendMessage(inputText, selectedImage || undefined);
    setInputText("");
    setSelectedImage(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening((text) => {
        setInputText(text);
        // Automatically send when voice recognition yields a result
        sendMessage(text, selectedImage || undefined);
        setSelectedImage(null);
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Assistente Inteligente - Vision</title>
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.title}>Assistente Vision</h1>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setAutoSpeak(!autoSpeak)}
          className={styles.speakerToggle}
          aria-label={autoSpeak ? "Desativar áudio automático" : "Ativar áudio automático"}
          title={autoSpeak ? "Desativar áudio automático" : "Ativar áudio automático"}
        >
          {autoSpeak ? <Volume2 size={18} /> : <VolumeX size={18} />}
          <span className={styles.speakerToggleText}>
            {autoSpeak ? "Áudio Ligado" : "Áudio Desligado"}
          </span>
        </Button>
      </div>

      <div className={`${styles.handsFreeCard} ${voiceEnabled ? styles.handsFreeActive : ""}`}>
        <div className={styles.handsFreeHeader}>
          <div className={styles.handsFreeTitleRow}>
            <Headset size={28} className={styles.handsFreeIcon} />
            <h2 className={styles.handsFreeTitle}>Modo Mãos Livres</h2>
          </div>
          <Button
            variant={voiceEnabled ? "destructive" : "primary"}
            onClick={voiceEnabled ? disableVoice : enableVoice}
            aria-pressed={voiceEnabled}
          >
            {voiceEnabled ? "Desativar Mãos Livres" : "Ativar Mãos Livres"}
          </Button>
        </div>
        <p className={styles.handsFreeDesc}>
          Diga "Olá Vision" para ativar o assistente por voz.
        </p>

        <div className={styles.handsFreeStatus}>
          <span className={styles.statusLabel}>Status:</span>
          {renderVoicePhaseBadge()}
        </div>

        {voiceError && <div className={styles.voiceError}>{voiceError}</div>}

        {(lastUserInput || lastResponse) && voiceEnabled && (
          <div className={styles.handsFreeLastInteraction}>
            {lastUserInput && (
              <p className={styles.lastInput}>
                <strong>Você disse:</strong> {lastUserInput}
              </p>
            )}
            {lastResponse && (
              <p className={styles.lastResponse}>
                <strong>Resposta:</strong> {truncatedVoiceResponse}
              </p>
            )}
          </div>
        )}

        {conversationHistory.length > 0 && voiceEnabled && (
          <div className={styles.handsFreeActions}>
            <Button variant="outline" size="sm" onClick={clearVoiceHistory}>
              Limpar Histórico
            </Button>
          </div>
        )}
      </div>

      <div className={styles.chatArea}>
        {messages.length === 0 ? (
          <div className={styles.emptyState}>
            <p className={styles.emptyStateText}>
              Olá! Eu sou o Vision. Como posso ajudar você a ver o mundo hoje?
            </p>
          </div>
        ) : (
          <div className={styles.messagesList} role="log" aria-live="polite">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`${styles.messageWrapper} ${
                  msg.role === "user" ? styles.messageUser : styles.messageModel
                }`}
              >
                <div className={styles.messageBubble}>
                  <p className={styles.messageText}>{msg.text}</p>
                  {msg.role === "model" &&
                    isStreaming &&
                    msg.id === messages[messages.length - 1].id &&
                    !msg.text && (
                      <div className={styles.typingIndicator}>
                        <Spinner size="sm" />
                        <span className="sr-only">Pensando...</span>
                      </div>
                    )}
                </div>
              </div>
            ))}
            {error && (
              <div className={styles.errorMessageWrapper}>
                <div className={styles.errorMessage}>
                  <span>Erro: {error}</span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}
      </div>

      <div className={styles.inputArea}>
        {selectedImage && (
          <div className={styles.imagePreviewArea}>
            <div className={styles.imagePreviewContainer}>
              <img src={selectedImage} alt="Imagem selecionada" className={styles.imagePreview} />
              <button
                className={styles.removeImageButton}
                onClick={() => setSelectedImage(null)}
                aria-label="Remover imagem"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        )}

        <div className={styles.inputControls}>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            className={styles.hiddenFileInput}
            onChange={handleImageChange}
          />
          <Button
            variant="outline"
            size="icon-lg"
            onClick={() => fileInputRef.current?.click()}
            aria-label="Anexar imagem"
            disabled={isStreaming}
            className={styles.attachButton}
          >
            <ImageIcon size={24} />
          </Button>

          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Pergunte ao Vision..."
            className={styles.textInput}
            disabled={isStreaming}
            aria-label="Mensagem de texto"
          />

          {hasSpeechRecognition && (
            <Button
              variant={isListening ? "destructive" : "outline"}
              size="icon-lg"
              onClick={toggleListening}
              className={`${styles.micButton} ${isListening ? styles.micActive : ""}`}
              aria-label={isListening ? "Parar de ouvir" : "Iniciar gravação de voz"}
              disabled={isStreaming}
            >
              <Mic size={24} />
            </Button>
          )}

          <Button
            variant="primary"
            size="icon-lg"
            onClick={handleSend}
            disabled={(!inputText.trim() && !selectedImage) || isStreaming}
            aria-label="Enviar mensagem"
            className={styles.sendButton}
          >
            <Send size={24} />
          </Button>
        </div>
      </div>
    </div>
  );
}