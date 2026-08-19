"use client";

import { useState } from "react";
import { useJogos } from "./jogos-provider";
import { Estrelas } from "./estrelas";
import type { Jogo, StatusJogo } from "@/types/jogo";

const LABEL_STATUS: Record<StatusJogo, string> = {
  quero_jogar: "Quero Jogar",
  jogando: "Jogando",
  terminado: "Terminado",
};

const TODOS_STATUS: StatusJogo[] = ["quero_jogar", "jogando", "terminado"];

// Datas ficam salvas como "AAAA-MM-DD" (formato do <input type="date">).
// Formata manualmente por string, sem passar por Date(), pra não correr
// risco de fuso horário deslocar o dia (UTC meia-noite vs. horário local).
function formatarData(iso: string): string {
  const [ano, mes, dia] = iso.split("-");
  return `${dia}/${mes}/${ano}`;
}

export function JogoCard({ jogo }: { jogo: Jogo }) {
  const { moverStatus, abrirEdicao, removerJogo } = useJogos();

  // Estado do formulário inline de conclusão — só existe enquanto o
  // usuário está no meio da transição pra "terminado" (data obrigatória).
  const [formAberto, setFormAberto] = useState(false);
  const [dataConclusao, setDataConclusao] = useState("");
  const [nota, setNota] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

  // Confirmação de remoção — dois passos, inline (mesmo padrão do form
  // de conclusão), em vez de window.confirm() pra manter o mesmo estilo.
  const [confirmandoRemocao, setConfirmandoRemocao] = useState(false);

  const outrosStatus = TODOS_STATUS.filter((status) => status !== jogo.status);

  function moverParaImediato(novoStatus: StatusJogo) {
    setErro(null);
    const resultado = moverStatus(jogo.id, novoStatus);
    if (!resultado.ok) {
      setErro(resultado.erro);
    }
  }

  function abrirFormConclusao() {
    setErro(null);
    setDataConclusao("");
    setNota(0);
    setFormAberto(true);
  }

  function cancelarConclusao() {
    setFormAberto(false);
    setErro(null);
  }

  function confirmarConclusao() {
    // Barreira 1 (UI): evita chamar a função de domínio sem data.
    if (!dataConclusao) {
      setErro("Informe a data de conclusão pra marcar como terminado.");
      return;
    }

    // Barreira 2 (domínio): atualizarStatusJogo valida de novo, mesmo que
    // a barreira 1 acima seja contornada de algum jeito.
    const resultado = moverStatus(jogo.id, "terminado", {
      dataConclusao,
      nota: nota > 0 ? nota : undefined,
    });

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    setFormAberto(false);
    setErro(null);
  }

  return (
    <article className="flex flex-col gap-3 rounded-lg border border-border bg-surface-raised p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display text-base font-medium leading-snug text-ink">
            {jogo.titulo}
          </h3>
          <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
            {jogo.plataforma}
          </p>
        </div>

        {!formAberto && !confirmandoRemocao && (
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => abrirEdicao(jogo)}
              aria-label={`Editar ${jogo.titulo}`}
              className="font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoRemocao(true)}
              aria-label={`Remover ${jogo.titulo}`}
              className="font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-danger focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Remover
            </button>
          </div>
        )}
      </div>

      {(jogo.dataInicio || jogo.dataConclusao) && (
        <div className="flex flex-col gap-0.5 font-mono text-[11px] text-ink-muted">
          {jogo.dataInicio && <span>Início: {formatarData(jogo.dataInicio)}</span>}
          {jogo.dataConclusao && (
            <span>Conclusão: {formatarData(jogo.dataConclusao)}</span>
          )}
        </div>
      )}

      {jogo.status === "terminado" && <Estrelas valor={jogo.nota} />}

      {confirmandoRemocao && (
        <div className="flex flex-col gap-3 rounded-md border border-danger/40 bg-surface p-3">
          <p className="font-mono text-xs text-ink">
            Remover &ldquo;{jogo.titulo}&rdquo;? Essa ação não pode ser
            desfeita.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => removerJogo(jogo.id)}
              className="rounded-full bg-danger px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-canvas transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Confirmar exclusão
            </button>
            <button
              type="button"
              onClick={() => setConfirmandoRemocao(false)}
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {!confirmandoRemocao && !formAberto && (
        <div className="flex flex-wrap gap-2">
          {outrosStatus.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() =>
                status === "terminado"
                  ? abrirFormConclusao()
                  : moverParaImediato(status)
              }
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:border-ink-muted hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Mover para {LABEL_STATUS[status]}
            </button>
          ))}
        </div>
      )}

      {formAberto && (
        <div className="flex flex-col gap-3 rounded-md border border-border bg-surface p-3">
          <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
            Data de conclusão
            <input
              type="date"
              required
              value={dataConclusao}
              onChange={(evento) => setDataConclusao(evento.target.value)}
              className="rounded border border-border bg-canvas px-2 py-1 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            />
          </label>

          <div className="flex flex-col gap-1">
            <span className="font-mono text-xs text-ink-muted">
              Nota (opcional)
            </span>
            <Estrelas valor={nota} onChange={setNota} />
          </div>

          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={confirmarConclusao}
              className="rounded-full bg-status-terminado px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-canvas transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Confirmar
            </button>
            <button
              type="button"
              onClick={cancelarConclusao}
              className="rounded-full border border-border px-3 py-1 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}

      {erro && (
        <p role="alert" className="font-mono text-xs text-danger">
          {erro}
        </p>
      )}
    </article>
  );
}
