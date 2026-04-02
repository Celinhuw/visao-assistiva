import React, { useState } from "react";
import { 
  Download, 
  CheckCircle2, 
  Clock, 
  HardDrive, 
  ChevronDown, 
  ChevronUp, 
  AlertCircle 
} from "lucide-react";
import { toast } from "sonner";

import { Badge } from "../components/Badge";
import { Button } from "../components/Button";
import { Progress } from "../components/Progress";
import { Skeleton } from "../components/Skeleton";

import { useFirmwareList, useInstallFirmware } from "../helpers/useFirmware";
import { useBluetooth } from "../helpers/useBluetooth";
import type { Selectable } from "kysely";
import type { FirmwareVersions } from "../helpers/schema";

import styles from "./firmware.module.css";

const formatDate = (date: Date | string | null | undefined) => {
  if (!date) return "Data desconhecida";
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
};

const formatSize = (sizeMb: number) => {
  const num = new Intl.NumberFormat("pt-BR", { 
    maximumFractionDigits: 1 
  }).format(sizeMb);
  return `${num} MB`;
};

// Subcomponente de item de histórico para lidar com seu próprio estado de colapso
const HistoryItem = ({ 
  version, 
  isCurrent 
}: { 
  version: Selectable<FirmwareVersions>; 
  isCurrent: boolean;
}) => {
  const [isChangelogOpen, setIsChangelogOpen] = useState(false);

  return (
    <div className={styles.historyItem}>
      <div className={styles.historyHeader}>
        <div className={styles.historyMeta}>
          <div className={styles.versionTitleRow}>
            <h3 className={styles.historyVersion}>{version.version}</h3>
            {isCurrent && <Badge variant="success">Atual</Badge>}
          </div>
          <div className={styles.historyMetaRow}>
            <span className={styles.metaItem}>
              <Clock size={16} aria-hidden="true" />
              Lançamento: {formatDate(version.releaseDate)}
            </span>
            {version.installedAt && (
              <span className={styles.metaItem}>
                <CheckCircle2 size={16} aria-hidden="true" />
                Instalado em: {formatDate(version.installedAt)}
              </span>
            )}
            <span className={styles.metaItem}>
              <HardDrive size={16} aria-hidden="true" />
              Tamanho: {formatSize(version.sizeMb)}
            </span>
          </div>
        </div>
      </div>

      <div className={styles.historyActions}>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsChangelogOpen(!isChangelogOpen)}
          aria-expanded={isChangelogOpen}
        >
          {isChangelogOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          {isChangelogOpen ? "Ocultar changelog" : "Ver changelog"}
        </Button>
      </div>

      {isChangelogOpen && (
        <div className={styles.changelogBox}>
          {version.changelog}
        </div>
      )}
    </div>
  );
};

export default function FirmwarePage() {
  const { data, isLoading, isError } = useFirmwareList();
  const installMutation = useInstallFirmware();
  const { connectionState, deviceName, batteryLevel, scan } = useBluetooth();

  const [installingId, setInstallingId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);

  const handleInstall = (firmwareId: string) => {
    if (installingId) return;

    setInstallingId(firmwareId);
    setProgress(0);

    const startTime = Date.now();
    const duration = 3000; // 3 seconds simulation

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min((elapsed / duration) * 100, 100);
      setProgress(currentProgress);

      if (currentProgress >= 100) {
        clearInterval(interval);
        installMutation.mutate(firmwareId, {
          onSuccess: () => {
            toast.success("Firmware atualizado com sucesso!");
            setInstallingId(null);
            setProgress(0);
          },
          onError: (err) => {
            toast.error(
              err instanceof Error ? err.message : "Erro ao atualizar o firmware."
            );
            setInstallingId(null);
            setProgress(0);
          },
        });
      }
    }, 50);
  };

  if (isError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <AlertCircle size={48} className={styles.errorIcon} />
          <h2 className={styles.errorTitle}>Erro ao carregar dados</h2>
          <p className={styles.errorText}>
            Não foi possível carregar as informações de firmware no momento. Tente
            novamente mais tarde.
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Skeleton style={{ width: "300px", height: "3rem" }} />
          <Skeleton style={{ width: "400px", height: "1.5rem" }} />
        </header>
        <section className={styles.section}>
          <Skeleton style={{ width: "200px", height: "2rem" }} />
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.versionGroup}>
                <Skeleton style={{ width: "120px", height: "2.5rem" }} />
                <div className={styles.metaList}>
                  <Skeleton style={{ width: "100px", height: "1.2rem" }} />
                  <Skeleton style={{ width: "80px", height: "1.2rem" }} />
                </div>
              </div>
              <Skeleton style={{ width: "150px", height: "2.5rem", borderRadius: "99px" }} />
            </div>
          </div>
        </section>
        <section className={styles.section}>
          <Skeleton style={{ width: "250px", height: "2rem" }} />
          <div className={styles.historyList}>
            <Skeleton style={{ width: "100%", height: "100px", borderRadius: "12px" }} />
            <Skeleton style={{ width: "100%", height: "100px", borderRadius: "12px" }} />
          </div>
        </section>
      </div>
    );
  }

  const currentVersion = data?.currentVersion;
  const availableVersion = data?.versions.find((v) => v.status === "available");
  const installedHistory = data?.versions.filter((v) => v.status === "installed") || [];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Atualização de Firmware</h1>
        <p className={styles.subtitle}>
          Gerencie as versões de firmware dos seus óculos Vision.
        </p>
      </header>

      {/* Banner de Conexão */}
      <section className={styles.bannerSection}>
        {connectionState === 'connected' ? (
          <div className={styles.bannerSuccess}>
            <div className={styles.bannerContent}>
              <CheckCircle2 size={24} />
              <div>
                <strong>Conectado:</strong> {deviceName || "Óculos Vision"}
                {batteryLevel !== null && ` (${batteryLevel}% bateria)`}
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.bannerWarning}>
            <div className={styles.bannerContent}>
              <AlertCircle size={24} />
              <div>
                <strong>Atenção:</strong> Os óculos devem estar conectados para gerenciar o firmware.
              </div>
            </div>
            <Button 
              variant="secondary" 
              size="sm" 
              onClick={scan} 
              disabled={connectionState !== 'disconnected'}
            >
              {connectionState === 'connecting' ? "Conectando..." : 
               connectionState === 'scanning' ? "Buscando..." : "Conectar Óculos"}
            </Button>
          </div>
        )}
      </section>

      {/* Versão Atual */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Versão Atual</h2>
        {currentVersion ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <div className={styles.versionGroup}>
                <div className={styles.versionTitleRow}>
                  <p className={styles.versionNumber}>{currentVersion.version}</p>
                  <Badge variant="success">Instalado</Badge>
                </div>
                <div className={styles.metaList}>
                  <span className={styles.metaItem}>
                    <Clock size={16} aria-hidden="true" />
                    {formatDate(currentVersion.releaseDate)}
                  </span>
                  <span className={styles.metaItem}>
                    <HardDrive size={16} aria-hidden="true" />
                    {formatSize(currentVersion.sizeMb)}
                  </span>
                </div>
              </div>
              <div className={styles.deviceInfo}>
                <HardDrive size={18} aria-hidden="true" />
                Óculos Vision Pro
              </div>
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Nenhuma versão de firmware instalada no momento.</p>
          </div>
        )}
      </section>

      {/* Atualização Disponível */}
      {availableVersion && (
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Atualização Disponível</h2>
          <div className={`${styles.card} ${styles.cardHighlight}`}>
            <div className={styles.cardHeader}>
              <div className={styles.versionGroup}>
                <div className={styles.versionTitleRow}>
                  <p className={styles.versionNumber}>{availableVersion.version}</p>
                  <Badge variant="primary">Nova versão</Badge>
                </div>
                <div className={styles.metaList}>
                  <span className={styles.metaItem}>
                    <Clock size={16} aria-hidden="true" />
                    Lançado em: {formatDate(availableVersion.releaseDate)}
                  </span>
                  <span className={styles.metaItem}>
                    <HardDrive size={16} aria-hidden="true" />
                    {formatSize(availableVersion.sizeMb)}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.changelogBox}>
              {availableVersion.changelog}
            </div>

            <div className={styles.actionArea}>
              <Button
                size="lg"
                className={styles.installButton}
                onClick={() => handleInstall(availableVersion.id)}
                disabled={!!installingId || connectionState !== 'connected'}
                title={connectionState !== 'connected' ? "Conecte os óculos primeiro" : ""}
              >
                <Download size={20} aria-hidden="true" />
                {installingId === availableVersion.id ? "Instalando..." : "Instalar Atualização"}
              </Button>

              {installingId === availableVersion.id && (
                <div className={styles.progressContainer}>
                  <Progress value={progress} aria-label="Progresso da instalação" />
                  <span className={styles.progressText}>{Math.round(progress)}%</span>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Histórico de Versões */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Histórico de Versões</h2>
        {installedHistory.length > 0 ? (
          <div className={styles.historyList}>
            {installedHistory.map((version) => (
              <HistoryItem
                key={version.id}
                version={version}
                isCurrent={currentVersion?.id === version.id}
              />
            ))}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Nenhum histórico de instalação encontrado.</p>
          </div>
        )}
      </section>
    </div>
  );
}