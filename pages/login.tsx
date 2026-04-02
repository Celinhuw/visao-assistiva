import React from "react";
import { Navigate } from "react-router-dom";
import { Eye } from "lucide-react";
import { PasswordLoginForm } from "../components/PasswordLoginForm";
import { PasswordRegisterForm } from "../components/PasswordRegisterForm";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../components/Tabs";
import { useAuth } from "../helpers/useAuth";
import { Helmet } from "react-helmet";
import styles from "./login.module.css";

export default function LoginPage() {
  const { authState } = useAuth();

  // Declarative redirect if user is already authenticated
  if (authState.type === "authenticated") {
    return <Navigate to="/painel" replace />;
  }

  return (
    <div className={styles.pageContainer}>
      <Helmet>
        <title>Vision - Entrar</title>
      </Helmet>

      <div className={styles.card}>
        <div className={styles.brandHeader}>
          <div className={styles.logoContainer}>
            <Eye className={styles.logoIcon} aria-hidden="true" />
          </div>
          <h1 className={styles.brandTitle}>Vision</h1>
          <p className={styles.brandSubtitle}>Sistema de Visão Assistiva</p>
        </div>

        <Tabs defaultValue="login" className={styles.tabsContainer}>
          <TabsList className={styles.tabsList} data-variant="pill">
            <TabsTrigger value="login" className={styles.tabTrigger}>
              Entrar
            </TabsTrigger>
            <TabsTrigger value="register" className={styles.tabTrigger}>
              Registrar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login" className={styles.tabContent}>
            <PasswordLoginForm />
          </TabsContent>

          <TabsContent value="register" className={styles.tabContent}>
            <PasswordRegisterForm />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}