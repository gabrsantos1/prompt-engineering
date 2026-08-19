"use client";

import { useJogos } from "./jogos-provider";

// Busca client-side pura: filtra o array já carregado em memória
// (useState + filter dentro de JogosProvider), sem chamada nenhuma.
export function BuscaJogos() {
  const { termoBusca, setTermoBusca } = useJogos();

  return (
    <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 sm:max-w-xs">
      <span className="font-mono text-xs text-ink-muted" aria-hidden="true">
        ⌕
      </span>
      <input
        type="search"
        value={termoBusca}
        onChange={(evento) => setTermoBusca(evento.target.value)}
        placeholder="Buscar por título…"
        aria-label="Buscar jogo por título"
        className="w-full bg-transparent font-body text-sm text-ink placeholder:text-ink-muted focus:outline-none"
      />
    </div>
  );
}
