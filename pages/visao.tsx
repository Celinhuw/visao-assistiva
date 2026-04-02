import React, { useEffect, useRef } from "react";
import { Helmet } from "react-helmet";
import { useVisionSystem } from "../helpers/useVisionSystem";
import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Eye, Power, Zap, Activity, AlertCircle, PlaySquare } from "lucide-react";
import styles from "./visao.module.css";

export default function Visao() {
  const {
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
  } = useVisionSystem();

  const previewVideoRef = useRef<HTMLVideoElement | null>(null);

  // Bind the camera stream to the visual video element for sighted caregivers
  useEffect(() => {
    if (previewVideoRef.current) {
      previewVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Sistema Vision | Assistente Visual</title>
      </Helmet>

      <header className={styles.header}>
        <div className={styles.titleRow}>
          <h1 className={styles.pageTitle}>Sistema Vision</h1>
          {isActive ? (
            <Badge variant="success" className={styles.statusBadge}>
              <Activity size={16} /> Ativo
            </Badge>
          ) : (
            <Badge variant="secondary" className={styles.statusBadge}>
              <Power size={16} /> Inativo
            </Badge>
          )}
        </div>
        <p className={styles.pageSubtitle}>
          Análise ambiental e navegação assistida por inteligência artificial.
        </p>
      </header>

      {error && (
        <div className={styles.errorAlert} role="alert">
          <AlertCircle size={24} />
          <span>{error}</span>
        </div>
      )}

      <div className={styles.mainGrid}>
        {/* Visual Preview for Caregivers */}
        <section className={styles.previewSection} aria-hidden="true">
          <div className={styles.videoContainer}>
            {isActive ? (
              <video
                ref={previewVideoRef}
                autoPlay
                playsInline
                muted
                className={styles.videoPreview}
              />
            ) : (
              <div className={styles.videoPlaceholder}>
                <Eye size={48} className={styles.placeholderIcon} />
                <p>Câmera Desativada</p>
              </div>
            )}
            
            {/* Overlay Status Bar */}
            {isActive && (
              <div className={styles.previewStatusBar}>
                <span className={styles.statusItem}>
                  Modo: <strong>{mode === "full" ? "Total" : "Inteligente"}</strong>
                </span>
                <span className={styles.statusItem}>
                  Quadros: <strong>{frameCount}</strong>
                </span>
                {isProcessing && (
                  <span className={styles.statusItemProcessing}>
                    <Zap size={14} className={styles.pulseIcon} /> Processando
                  </span>
                )}
                {isSpeaking && (
                  <span className={styles.statusItemSpeaking}>
                    <PlaySquare size={14} /> Falando
                  </span>
                )}
              </div>
            )}
          </div>
        </section>

        {/* Current Description / AI Output Area */}
        <section 
          className={styles.descriptionSection} 
          aria-live="polite"
          aria-atomic="true"
        >
          <h2 className="sr-only">Descrição Atual do Ambiente</h2>
          <div className={`${styles.descriptionBox} ${isActive ? styles.activeBox : ''}`}>
            {!isActive ? (
              <p className={styles.placeholderText}>
                Inicie o sistema para começar a ouvir as descrições do ambiente.
              </p>
            ) : currentDescription ? (
              <p className={styles.descriptionText}>{currentDescription}</p>
            ) : (
              <p className={styles.waitingText}>Analisando o ambiente...</p>
            )}
          </div>
        </section>

        {/* Controls */}
        <section className={styles.controlsSection} aria-label="Controles do Vision">
          {!isActive ? (
            <div className={styles.startActions}>
              <Button
                size="lg"
                variant="primary"
                className={styles.actionButton}
                onClick={() => startVision("full")}
                aria-label="Ligar Modo Vision Total. Descreve o ambiente continuamente."
              >
                <Eye size={24} />
                Vision Full - Ligar
              </Button>
              <Button
                size="lg"
                variant="outline"
                className={styles.actionButton}
                onClick={() => startVision("smart")}
                aria-label="Ligar Modo Vision Inteligente. Descreve apenas mudanças e perigos."
              >
                <Zap size={24} />
                Vision Smart - Ligar
              </Button>
            </div>
          ) : (
            <div className={styles.stopActions}>
              <Button
                size="lg"
                variant="destructive"
                className={styles.actionButton}
                onClick={stopVision}
                aria-label="Desligar sistema Vision"
              >
                <Power size={24} />
                Desligar Vision
              </Button>
            </div>
          )}
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoCard}>
            <h3>Sobre os Modos</h3>
            <ul>
              <li>
                <strong>Vision Full:</strong> Analisa o ambiente continuamente e fornece descrições detalhadas o tempo todo. Ideal para exploração ativa de ambientes desconhecidos.
              </li>
              <li>
                <strong>Vision Smart:</strong> Analisa continuamente, mas só fala quando ocorrem mudanças significativas na cena ou surgem novos perigos. Reduz a sobrecarga de informações.
              </li>
            </ul>
            <p className={styles.voiceCommandHint}>
              <em>Dica: Diga "Vision inteligente ligar" a qualquer momento para ativar por voz.</em>
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}