import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Eye, Activity, History, LogOut, HardDrive, Bot, BluetoothOff, Battery, Bluetooth, AlertCircle } from "lucide-react";
import { useAuth } from "../helpers/useAuth";
import { useBluetooth } from "../helpers/useBluetooth";
import { Button } from "./Button";
import { Badge } from "./Badge";
import { Spinner } from "./Spinner";
import styles from "./DashboardLayout.module.css";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState, logout } = useAuth();
  const {
    connectionState,
    deviceName,
    batteryLevel,
    visionMode: btVisionMode,
    error: btError,
    isSupported: isBtSupported,
    scan: scanBt,
    disconnect: disconnectBt,
  } = useBluetooth();
  
  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault();
    await logout();
    navigate("/login");
  };

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <Link to="/painel" className={styles.brand}>
            <Eye className={styles.brandIcon} aria-hidden="true" />
            <span className={styles.brandText}>Vision</span>
          </Link>

          <nav className={styles.nav}>
            <Button
              asChild
              variant={location.pathname === "/painel" ? "primary" : "ghost"}
              className={styles.navLink}
            >
              <Link to="/painel">
                <Activity size={18} />
                Painel
              </Link>
            </Button>
            <Button
              asChild
              variant={location.pathname === "/visao" ? "primary" : "ghost"}
              className={styles.navLink}
            >
              <Link to="/visao">
                <Eye size={18} />
                Visão
              </Link>
            </Button>
            <Button
              asChild
              variant={location.pathname === "/assistente" ? "primary" : "ghost"}
              className={styles.navLink}
            >
              <Link to="/assistente">
                <Bot size={18} />
                Assistente IA
              </Link>
            </Button>
            <Button
              asChild
              variant={location.pathname === "/historico" ? "primary" : "ghost"}
              className={styles.navLink}
            >
              <Link to="/historico">
                <History size={18} />
                Histórico
              </Link>
            </Button>
            
            <Button
              asChild
              variant={location.pathname === "/firmware" ? "primary" : "ghost"}
              className={styles.navLink}
            >
              <Link to="/firmware">
                <HardDrive size={18} />
                Firmware
              </Link>
            </Button>
          </nav>

          <div className={styles.headerActions}>
            {authState.type === "authenticated" && (
              <span className={styles.userName}>{authState.user.displayName}</span>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut size={16} />
              Sair
            </Button>
          </div>
        </div>
      </header>

      <div className={styles.btBarWrapper}>
        {!isBtSupported ? (
          <div className={`${styles.btBar} ${styles.btError}`}>
            <BluetoothOff size={16} />
            <span>Bluetooth não disponível neste dispositivo</span>
          </div>
        ) : connectionState === 'connected' ? (
          <div className={`${styles.btBar} ${styles.btSuccess}`}>
            <div className={styles.btStatusLeft}>
              <div className={styles.btGreenDot} />
              <span className={styles.btDeviceName}>{deviceName || "Óculos Vision"}</span>
              {batteryLevel !== null && (
                <span className={styles.btBattery}>
                  <Battery size={14} /> {batteryLevel}%
                </span>
              )}
              {btVisionMode && (
                <Badge variant="outline" className={styles.btModeBadge}>
                  {btVisionMode === 'full' ? 'Total' : btVisionMode === 'smart' ? 'Smart' : 'Desligado'}
                </Badge>
              )}
            </div>
            <Button size="sm" variant="outline" onClick={disconnectBt} className={styles.btDisconnectBtn}>
              Desconectar
            </Button>
          </div>
        ) : (
          <div className={`${styles.btBar} ${styles.btDisconnected}`}>
            <div className={styles.btStatusLeft}>
              <Bluetooth size={16} className={styles.btIcon} />
              <span>Óculos não conectados</span>
              {btError && (
                <span className={styles.btErrorText}>
                  <AlertCircle size={14} /> {btError}
                </span>
              )}
            </div>
            <Button
              size="sm"
              variant="primary"
              onClick={scanBt}
              disabled={connectionState === 'scanning' || connectionState === 'connecting'}
            >
              {connectionState === 'scanning' || connectionState === 'connecting' ? (
                <>
                  <Spinner size="sm" />
                  {connectionState === 'scanning' ? "Buscando..." : "Conectando..."}
                </>
              ) : (
                "Conectar"
              )}
            </Button>
          </div>
        )}
      </div>

      <main className={styles.main}>{children}</main>
    </div>
  );
}