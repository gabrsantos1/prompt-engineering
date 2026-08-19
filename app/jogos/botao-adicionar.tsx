"use client";

import { useJogos } from "./jogos-provider";

export function BotaoAdicionar() {
  const { abrirCriacao } = useJogos();

  return (
    <button
      type="button"
      onClick={abrirCriacao}
      className="flex items-center gap-1.5 rounded-full bg-status-jogando px-4 py-2 font-mono text-xs uppercase tracking-wide text-canvas transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
    >
      <span aria-hidden="true">+</span> Adicionar jogo
    </button>
  );
}
