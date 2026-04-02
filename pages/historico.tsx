import React, { useState } from "react";
import { Helmet } from "react-helmet";
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  MessageSquare, 
  Zap,
  Info
} from "lucide-react";
import { Button } from "../components/Button";
import { Badge } from "../components/Badge";
import { Skeleton } from "../components/Skeleton";
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "../components/Select";

import { useInteractionsList } from "../helpers/useInteractions";
import { InteractionType, VisionMode } from "../helpers/schema";
import styles from "./historico.module.css";

const ITEMS_PER_PAGE = 10;

export default function Historico() {
  const [page, setPage] = useState(0);
  const [filterMode, setFilterMode] = useState<VisionMode | "all">("all");
  const [filterType, setFilterType] = useState<InteractionType | "all">("all");

  const queryParams = {
    limit: ITEMS_PER_PAGE,
    offset: page * ITEMS_PER_PAGE,
    mode: filterMode === "all" ? undefined : filterMode,
    type: filterType === "all" ? undefined : filterType,
  };

  const { data, isLoading, isFetching } = useInteractionsList(queryParams);

  const totalPages = data ? Math.ceil(data.total / ITEMS_PER_PAGE) : 0;

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
        <title>Histórico de Eventos | Vision</title>
      </Helmet>

      <div className={styles.header}>
        <div>
          <h1 className={styles.pageTitle}>Histórico de Eventos</h1>
          <p className={styles.pageSubtitle}>Registro completo de todas as descrições e interações processadas.</p>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.filtersSection}>
          <div className={styles.filterHeader}>
            <Filter size={20} className={styles.filterIcon} />
            <h2 className={styles.filterTitle}>Filtrar Resultados</h2>
          </div>
          <div className={styles.filtersControls}>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Modo de Visão</label>
              <Select 
                value={filterMode} 
                onValueChange={(val) => {
                  setFilterMode(val as VisionMode | "all");
                  setPage(0);
                }}
              >
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue placeholder="Todos os modos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos os modos</SelectItem>
                    <SelectItem value="smart">Vision Smart</SelectItem>
                    <SelectItem value="full">Vision Full</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
            <div className={styles.filterGroup}>
              <label className={styles.filterLabel}>Tipo de Evento</label>
              <Select 
                value={filterType} 
                onValueChange={(val) => {
                  setFilterType(val as InteractionType | "all");
                  setPage(0);
                }}
              >
                <SelectTrigger className={styles.filterSelect}>
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="all">Todos os tipos</SelectItem>
                    <SelectItem value="description">Descrição</SelectItem>
                    <SelectItem value="alert">Alerta</SelectItem>
                    <SelectItem value="question">Pergunta</SelectItem>
                    <SelectItem value="command">Comando</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead className={styles.tableHead}>
              <tr>
                <th className={styles.th}>Data/Hora</th>
                <th className={styles.th}>Modo</th>
                <th className={styles.th}>Tipo</th>
                <th className={styles.th}>Interação</th>
                <th className={styles.th}>Confiança</th>
              </tr>
            </thead>
            <tbody className={styles.tableBody}>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className={styles.tr}>
                    <td className={styles.td}><Skeleton style={{ height: "1.5rem", width: "100px" }} /></td>
                    <td className={styles.td}><Skeleton style={{ height: "1.5rem", width: "60px" }} /></td>
                    <td className={styles.td}><Skeleton style={{ height: "1.5rem", width: "80px" }} /></td>
                    <td className={styles.td}><Skeleton style={{ height: "2.5rem" }} /></td>
                    <td className={styles.td}><Skeleton style={{ height: "1.5rem", width: "50px" }} /></td>
                  </tr>
                ))
              ) : data?.interactions.length === 0 ? (
                <tr className={styles.tr}>
                  <td colSpan={5} className={styles.emptyState}>
                    <Info size={32} className={styles.emptyIcon} />
                    Nenhum registro encontrado para os filtros selecionados.
                  </td>
                </tr>
              ) : (
                data?.interactions.map((item) => (
                  <tr key={item.id} className={styles.tr}>
                    <td className={styles.td}>
                      <span className={styles.timeText}>
                        {new Intl.DateTimeFormat("pt-BR", {
                          day: "2-digit", month: "2-digit", year: "numeric",
                          hour: "2-digit", minute: "2-digit", second: "2-digit"
                        }).format(new Date(item.createdAt))}
                      </span>
                    </td>
                    <td className={styles.td}>
                      {renderModeBadge(item.mode)}
                    </td>
                    <td className={styles.td}>
                      {renderTypeBadge(item.type)}
                    </td>
                    <td className={styles.td}>
                      <div className={styles.interactionContent}>
                        {item.userInput && (
                          <div className={styles.bubbleUser}>
                            <MessageSquare size={14} className={styles.bubbleIcon} />
                            <span>{item.userInput}</span>
                          </div>
                        )}
                        <div className={styles.bubbleSystem}>
                          <Zap size={14} className={styles.bubbleIcon} />
                          <span>{item.systemResponse}</span>
                        </div>
                      </div>
                    </td>
                    <td className={styles.td}>
                      <span className={styles.confidenceText}>
                        {item.confidence ? `${(item.confidence * 100).toFixed(1)}%` : "-"}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            {data ? (
              <span>
                Mostrando {data.interactions.length > 0 ? page * ITEMS_PER_PAGE + 1 : 0} a {Math.min((page + 1) * ITEMS_PER_PAGE, data.total)} de {data.total} registros
              </span>
            ) : (
              <Skeleton style={{ width: "200px", height: "1rem" }} />
            )}
            {isFetching && !isLoading && <span className={styles.updatingText}>(Atualizando...)</span>}
          </div>
          
          <div className={styles.paginationActions}>
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.max(0, p - 1))}
              disabled={page === 0 || isLoading}
            >
              <ChevronLeft size={16} /> Anterior
            </Button>
            <span className={styles.pageIndicator}>
              Página {page + 1} de {Math.max(1, totalPages)}
            </span>
            <Button 
              variant="outline" 
              onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1 || isLoading}
            >
              Próxima <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}