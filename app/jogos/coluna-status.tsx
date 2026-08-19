"use client";

import { useJogos } from "./jogos-provider";
import { JogoCard } from "./jogo-card";
import type { StatusJogo } from "@/types/jogo";

// Classes escritas por extenso (não interpoladas) de propósito: o
// scanner do Tailwind precisa achar o nome completo da classe no texto
// do arquivo, uma string tipo `bg-${accent}` não seria detectada.
const CONFIG_STATUS: Record<StatusJogo, { titulo: string; dot: string }> = {
  quero_jogar: { titulo: "Quero Jogar", dot: "bg-status-quero" },
  jogando: { titulo: "Jogando", dot: "bg-status-jogando" },
  terminado: { titulo: "Terminado", dot: "bg-status-terminado" },
};

export function ColunaStatus({ status }: { status: StatusJogo }) {
  const { jogos } = useJogos();
  const jogosDaColuna = jogos.filter((jogo) => jogo.status === status);
  const { titulo, dot } = CONFIG_STATUS[status];

  return (
    <section className="flex min-w-0 flex-col gap-4">
      <header className="flex items-center gap-2 border-b border-border pb-3">
        <span className={`h-2.5 w-2.5 rounded-full ${dot}`} aria-hidden="true" />
        <h2 className="font-mono text-xs uppercase tracking-[0.18em] text-ink-muted">
          {titulo}
        </h2>
        <span className="ml-auto rounded-full border border-border bg-surface px-2 py-0.5 font-mono text-xs text-ink-muted">
          {jogosDaColuna.length}
        </span>
      </header>

      <div className="flex flex-col gap-3">
        {jogosDaColuna.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border px-4 py-6 text-center font-mono text-xs text-ink-muted">
            Nenhum jogo aqui ainda.
          </p>
        ) : (
          jogosDaColuna.map((jogo) => <JogoCard key={jogo.id} jogo={jogo} />)
        )}
      </div>
    </section>
  );
}
