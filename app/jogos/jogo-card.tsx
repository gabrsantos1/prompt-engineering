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

export function JogoCard({ jogo }: { jogo: Jogo }) {
  const { moverStatus } = useJogos();

  // Estado do formulário inline de conclusão — só existe enquanto o
  // usuário está no meio da transição pra "terminado" (data obrigatória).
  const [formAberto, setFormAberto] = useState(false);
  const [dataConclusao, setDataConclusao] = useState("");
  const [nota, setNota] = useState(0);
  const [erro, setErro] = useState<string | null>(null);

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
      <div>
        <h3 className="font-display text-base font-medium leading-snug text-ink">
          {jogo.titulo}
        </h3>
        <p className="mt-0.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted">
          {jogo.plataforma}
        </p>
      </div>

      {jogo.status === "terminado" && <Estrelas valor={jogo.nota} />}

      {!formAberto && (
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
