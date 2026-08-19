"use client";

import { useJogos } from "./jogos-provider";
import type { StatusJogo } from "@/types/jogo";

// Mesmas classes/paleta categórica dos indicadores de coluna — a cor
// segue a entidade "status" de forma consistente em toda a tela.
const CONFIG_STATUS: Record<StatusJogo, { titulo: string; dot: string }> = {
  quero_jogar: { titulo: "Quero jogar", dot: "bg-status-quero" },
  jogando: { titulo: "Jogando", dot: "bg-status-jogando" },
  terminado: { titulo: "Terminado", dot: "bg-status-terminado" },
};

const ORDEM_STATUS: StatusJogo[] = ["quero_jogar", "jogando", "terminado"];

export function EstatisticasJogos() {
  // Lista completa (sem filtro de busca) de propósito: as estatísticas
  // descrevem o backlog inteiro, não devem oscilar enquanto alguém digita
  // na busca — decisão registrada quando a busca foi implementada.
  const { jogos } = useJogos();

  const totalPorStatus = ORDEM_STATUS.map((status) => ({
    status,
    total: jogos.filter((jogo) => jogo.status === status).length,
  }));

  const totalConcluido = totalPorStatus.find(
    (item) => item.status === "terminado"
  )!.total;
  const totalGeral = jogos.length;

  return (
    <section
      aria-label="Estatísticas do backlog"
      className="grid grid-cols-2 gap-3 sm:grid-cols-4"
    >
      {totalPorStatus.map(({ status, total }) => (
        <div
          key={status}
          className="flex flex-col gap-2 rounded-lg border border-border bg-surface-raised p-4"
        >
          <div className="flex items-center gap-2">
            <span
              className={`h-2 w-2 rounded-full ${CONFIG_STATUS[status].dot}`}
              aria-hidden="true"
            />
            <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
              {CONFIG_STATUS[status].titulo}
            </span>
          </div>
          <span className="font-display text-3xl font-semibold text-ink">
            {total}
          </span>
        </div>
      ))}

      <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-raised p-4">
        <span className="font-mono text-xs uppercase tracking-wide text-ink-muted">
          Total concluído
        </span>
        <span className="font-display text-3xl font-semibold text-ink">
          {totalConcluido}
          <span className="ml-1 text-base font-normal text-ink-muted">
            de {totalGeral}
          </span>
        </span>
      </div>
    </section>
  );
}
