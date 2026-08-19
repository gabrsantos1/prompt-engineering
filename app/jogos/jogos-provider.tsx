"use client";

// Fonte única de verdade da lista de jogos durante a sessão do navegador.
// Sem Server Action e sem banco: state 100% client-side (ver decisão
// documentada em requisitos.md, seção "Stack técnica").

import { createContext, useContext, useState, type ReactNode } from "react";
import { jogosMockados } from "@/lib/jogos/mock-store";
import {
  atualizarStatusJogo,
  type DadosConclusao,
  type ResultadoUpdate,
} from "@/lib/jogos/atualizar-status";
import type { Jogo, StatusJogo } from "@/types/jogo";

interface JogosContextValue {
  jogos: Jogo[];
  moverStatus: (
    id: string,
    novoStatus: StatusJogo,
    dadosConclusao?: DadosConclusao
  ) => ResultadoUpdate;
}

const JogosContext = createContext<JogosContextValue | null>(null);

export function JogosProvider({ children }: { children: ReactNode }) {
  const [jogos, setJogos] = useState<Jogo[]>(jogosMockados);

  function moverStatus(
    id: string,
    novoStatus: StatusJogo,
    dadosConclusao?: DadosConclusao
  ): ResultadoUpdate {
    const jogo = jogos.find((j) => j.id === id);

    if (!jogo) {
      return { ok: false, erro: `Jogo com id "${id}" não encontrado.` };
    }

    const resultado = atualizarStatusJogo(jogo, novoStatus, dadosConclusao);

    if (resultado.ok) {
      setJogos((atual) =>
        atual.map((j) => (j.id === id ? resultado.jogo : j))
      );
    }

    return resultado;
  }

  return (
    <JogosContext.Provider value={{ jogos, moverStatus }}>
      {children}
    </JogosContext.Provider>
  );
}

export function useJogos() {
  const contexto = useContext(JogosContext);

  if (!contexto) {
    throw new Error("useJogos precisa ser usado dentro de <JogosProvider>.");
  }

  return contexto;
}
