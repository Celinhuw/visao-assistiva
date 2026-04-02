import React from "react";
import { Helmet } from "react-helmet";
import { 
  Wifi, 
  Battery, 
  Settings, 
  MessageSquare, 
  Zap,
  Info,
  Clock,
  Eye
} from "lucide-react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Skeleton } from "../components/Skeleton";
import { Separator } from "../components/Separator";

import { useInteractionsList } from "../helpers/useInteractions";
import { InteractionType, VisionMode } from "../helpers/schema";
import { useBluetooth } from "../helpers/useBluetooth";
import styles from "./painel.module.css";

export default function Painel() {
  const { data: listData, isLoading: listLoading } = useInteractionsList({ limit: 5, offset: 0 });
  const {
    connectionState,
    batteryLevel,
    visionMode: bluetoothVisionMode,
    error,
    isSupported,
    scan,
    disconnect
  } = useBluetooth();

  const renderModeBadge = (mode: VisionMode) => {
    if (mode === "full") return <Badge className={styles.badgeFull}>Full</Badge>;
    return <Badge variant="success">Smart</Badge>;
  };

  const renderTypeBadge = (type: InteractionType) => {
    switch (type) {
      case "alert": return <Badge variant="destructive">Alerta</Badge>;
      case "question": return <Badge className={styles.badgeQuestion}>Pergunta</Badge>;
      case "command": return <Badge variant="warning">Comando</Badge>;
      case "description": return <Badge variant="secondary">Descrição</Badge>;
    }
  };

  return (
    <div className={styles.container}>
      <Helmet>
        <title>Painel | Vision</title>
      </Helmet>

      <div className={styles.header}>
        <h1 className={styles.pageTitle}>Painel de Controle</h1>
        <p className={styles.pageSubtitle}>Visão geral do sistema e interações recentes.</p>
      </div>

      <div className={styles.dashboardGrid}>
        {/* System Status Card */}
        <section className={styles.card} aria-labelledby="status-title">
          <div className={styles.cardHeader}>
            <h2 id="status-title" className={styles.cardTitle}>Status do Sistema</h2>
            <Settings className={styles.cardIcon} />
          </div>
          <div className={styles.statusList}>
            <div className={styles.statusItem}>
              <div className={styles.statusIconWrapper} data-active={connectionState === 'connected'}>
                <Wifi size={24} />
              </div>
              <div className={styles.statusInfo}>
                <div className={styles.statusHeaderRow}>
                  <span className={styles.statusLabel}>Conexão Óculos</span>
                </div>
                <span className={styles.statusValueText}>
                  {connectionState === 'connected' ? 'Conectado via BLE' : 
                   connectionState === 'connecting' ? 'Conectando...' : 
                   connectionState === 'scanning' ? 'Buscando...' : 'Desconectado'}
                </span>
                <div className={styles.statusActionRow}>
                  {connectionState === 'disconnected' ? (
                    <Button size="sm" variant="outline" onClick={scan} disabled={!isSupported}>
                      Conectar
                    </Button>
                  ) : (
                    <Button size="sm" variant="ghost" onClick={disconnect}>
                      Desconectar
                    </Button>
                  )}
                </div>
              </div>
            </div>
            <Separator />
            <div className={styles.statusItem}>
              <div className={styles.statusIconWrapper} data-active={connectionState === 'connected' && batteryLevel !== null}>
                <Battery size={24} />
              </div>
              <div className={styles.statusInfo}>
                <span className={styles.statusLabel}>Bateria Restante</span>
                <span className={styles.statusValueText}>{batteryLevel !== null ? `${batteryLevel}%` : '—'}</span>
              </div>
            </div>
            <Separator />
            <div className={styles.statusItem}>
              <div className={styles.statusIconWrapper} data-mode={bluetoothVisionMode === 'smart' || bluetoothVisionMode === 'full'}>
                <Eye size={24} />
              </div>
              <div className={styles.statusInfo}>
                <span className={styles.statusLabel}>Modo Atual</span>
                <span className={styles.statusValueText}>
                  {bluetoothVisionMode === 'smart' ? 'Vision Smart' : 
                   bluetoothVisionMode === 'full' ? 'Vision Full' : 'Desligado'}
                </span>
              </div>
            </div>
          </div>
          {!isSupported && (
            <div className={styles.errorText}>Bluetooth não disponível neste dispositivo.</div>
          )}
          {error && (
            <div className={styles.errorText}>{error}</div>
          )}
        </section>

        {/* Recent Interactions List */}
        <section className={`${styles.card} ${styles.colSpanFull}`} aria-labelledby="recent-title">
          <div className={styles.cardHeader}>
            <h2 id="recent-title" className={styles.cardTitle}>Últimas Interações</h2>
            <Clock className={styles.cardIcon} />
          </div>
          <div className={styles.listContainer}>
            {listLoading ? (
              <div className={styles.loadingStack}>
                <Skeleton style={{ height: "4rem" }} />
                <Skeleton style={{ height: "4rem" }} />
                <Skeleton style={{ height: "4rem" }} />
              </div>
            ) : listData?.interactions.length === 0 ? (
              <div className={styles.emptyState}>
                <Info size={32} className={styles.emptyIcon} />
                <p>Nenhuma interação registrada ainda.</p>
              </div>
            ) : (
              <ul className={styles.interactionList}>
                {listData?.interactions.map((interaction) => (
                  <li key={interaction.id} className={styles.interactionItem}>
                    <div className={styles.itemHeader}>
                      <div className={styles.itemBadges}>
                        {renderModeBadge(interaction.mode)}
                        {renderTypeBadge(interaction.type)}
                      </div>
                      <span className={styles.itemTime}>
                        {new Intl.DateTimeFormat("pt-BR", {
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          day: "2-digit",
                          month: "2-digit",
                        }).format(new Date(interaction.createdAt))}
                      </span>
                    </div>
                    {interaction.userInput && (
                      <p className={styles.userInput}>
                        <MessageSquare size={16} />
                        <strong>Você:</strong> "{interaction.userInput}"
                      </p>
                    )}
                    <p className={styles.systemResponse}>
                      <Zap size={16} />
                      <strong>Vision:</strong> {interaction.systemResponse}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <div className={styles.cardFooterActions}>
              <Button asChild variant="outline" className={styles.fullWidthBtn}>
                <a href="/historico">Ver Histórico Completo</a>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}