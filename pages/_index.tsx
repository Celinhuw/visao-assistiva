import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import { Eye, Brain, Volume2, AlertTriangle, CheckCircle, Zap, Shield, WifiOff } from "lucide-react";
import { Button } from "../components/Button";
import styles from "./_index.module.css";

export default function LandingPage() {
  return (
    <div className={styles.container}>
      <Helmet>
        <title>Vision | Visão Assistiva Inteligente</title>
        <meta
          name="description"
          content="Enxergue o mundo com inteligência artificial. Óculos inteligentes para pessoas cegas com descrição contínua e inteligente do ambiente."
        />
      </Helmet>

      {/* Navigation */}
      <header className={styles.nav}>
        <div className={styles.navContent}>
          <div className={styles.logo}>
            <Eye className={styles.logoIcon} aria-hidden="true" />
            <span className={styles.logoText}>Vision</span>
          </div>
          <nav className={styles.navLinks}>
            <a href="#recursos" className={styles.navLink}>
              Recursos
            </a>
            <a href="#como-funciona" className={styles.navLink}>
              Como Funciona
            </a>
          </nav>
          <div className={styles.navActions}>
            <Button asChild size="md" className={styles.ctaButton}>
              <Link to="/login">Acessar Painel</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Enxergue o mundo com <span className={styles.highlight}>inteligência artificial</span>
            </h1>
            <p className={styles.heroSubtitle}>
              O Sistema Vision integra óculos inteligentes e uma IA avançada para narrar o mundo ao seu redor em tempo real. Autonomia, segurança e independência para pessoas com deficiência visual.
            </p>
            <div className={styles.heroActions}>
              <Button asChild size="lg" className={styles.primaryAction}>
                <Link to="/login">Experimentar Agora</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#como-funciona">Entender a Tecnologia</a>
              </Button>
            </div>
          </div>
          <div className={styles.heroImageWrapper}>
            <img
              src="https://assets.floot.app/376ad7a6-96ac-4c79-bded-454197cf63d7/1aed09e7-d9cb-47b8-be6c-51cfb5d08d13.png"
              alt="Pessoa sorrindo utilizando os óculos inteligentes Vision em um ambiente urbano"
              className={styles.heroImage}
            />
            <div className={styles.heroImageOverlay} aria-hidden="true" />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="recursos" className={styles.features}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Modos de Operação Adaptativos</h2>
          <p className={styles.sectionSubtitle}>
            Desenvolvido para diferentes contextos, o Vision se ajusta à sua necessidade para não sobrecarregar sua audição.
          </p>
        </div>
        
        <div className={styles.featuresGrid}>
          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} data-color="blue">
              <Eye className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Vision Full</h3>
            <p className={styles.featureDesc}>
              Descrição contínua e detalhada do ambiente. Ideal para reconhecimento inicial de novos locais e mapeamento de obstáculos.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} data-color="green">
              <Brain className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Vision Smart</h3>
            <p className={styles.featureDesc}>
              Análise inteligente focada em mudanças. O sistema fala apenas quando uma alteração significativa ou novo objeto aparece no seu campo de visão.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} data-color="purple">
              <Volume2 className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Assistente de Voz</h3>
            <p className={styles.featureDesc}>
              Interaja naturalmente. Pergunte "O que tem na minha frente?" ou "Qual a cor desta camisa?" e receba respostas instantâneas.
            </p>
          </div>

          <div className={styles.featureCard}>
            <div className={styles.featureIconWrapper} data-color="red">
              <AlertTriangle className={styles.featureIcon} />
            </div>
            <h3 className={styles.featureTitle}>Detecção de Alertas</h3>
            <p className={styles.featureDesc}>
              Monitoramento passivo de perigos iminentes. Avisos prioritários sobre degraus, galhos na altura do rosto ou veículos se aproximando.
            </p>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="como-funciona" className={styles.howItWorks}>
        <div className={styles.howItWorksContent}>
          <div className={styles.howItWorksImageWrapper}>
            <img
              src="https://assets.floot.app/376ad7a6-96ac-4c79-bded-454197cf63d7/33543cbb-8771-49c3-ae54-d4e5bbdc3be5.png"
              alt="Design detalhado dos óculos inteligentes Vision com câmera compacta"
              className={styles.howItWorksImage}
            />
          </div>
          <div className={styles.howItWorksText}>
            <h2 className={styles.sectionTitle}>Conexão Invisível. <br/>Ação Imediata.</h2>
            <div className={styles.steps}>
              <div className={styles.step}>
                <div className={styles.stepNumber}>1</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Captura Contínua</h4>
                  <p className={styles.stepDesc}>Os óculos utilizam uma câmera ultracompacta e sensores de movimento (IMU) para varrer o ambiente ao seu redor silenciosamente.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>2</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Processamento Neural</h4>
                  <p className={styles.stepDesc}>O aplicativo no seu smartphone processa as imagens e dados espaciais utilizando modelos quantizados, reduzindo latência e consumo de bateria.</p>
                </div>
              </div>
              <div className={styles.step}>
                <div className={styles.stepNumber}>3</div>
                <div className={styles.stepContent}>
                  <h4 className={styles.stepTitle}>Síntese de Voz Espacial</h4>
                  <p className={styles.stepDesc}>O motor de decisão converte o contexto em áudio claro, entregue via alto-falantes de condução óssea, mantendo seus ouvidos livres para os sons da rua.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.statsGrid}>
          <div className={styles.statItem}>
            <Zap className={styles.statIcon} />
            <span className={styles.statValue}>&lt; 1s</span>
            <span className={styles.statLabel}>Tempo de Resposta</span>
          </div>
          <div className={styles.statItem}>
            <WifiOff className={styles.statIcon} />
            <span className={styles.statValue}>100%</span>
            <span className={styles.statLabel}>Operação Offline</span>
          </div>
          <div className={styles.statItem}>
            <Shield className={styles.statIcon} />
            <span className={styles.statValue}>Privado</span>
            <span className={styles.statLabel}>Dados Locais</span>
          </div>
          <div className={styles.statItem}>
            <CheckCircle className={styles.statIcon} />
            <span className={styles.statValue}>2</span>
            <span className={styles.statLabel}>Modos Inteligentes</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <div className={styles.footerBrand}>
            <Eye className={styles.footerLogo} />
            <span className={styles.footerText}>Vision</span>
          </div>
          <p className={styles.footerDesc}>
            Plataforma de Visão Assistiva para Pessoas Cegas. Promovendo autonomia com tecnologia inclusiva.
          </p>
          <div className={styles.footerLinks}>
            <Link to="/login" className={styles.footerLink}>Acessar Painel</Link>
            <a href="#" className={styles.footerLink}>Acessibilidade</a>
            <a href="#" className={styles.footerLink}>Privacidade</a>
          </div>
        </div>
      </footer>
    </div>
  );
}