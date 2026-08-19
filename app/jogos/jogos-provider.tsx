"use client";

// Fonte única de verdade da lista de jogos durante a sessão do navegador.
// Sem Server Action e sem banco: state 100% client-side (ver decisão
// documentada em requisitos.md, seção "Stack técnica").

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { jogosMockados } from "@/lib/jogos/mock-store";
import {
  atualizarStatusJogo,
  type DadosConclusao,
  type ResultadoUpdate,
} from "@/lib/jogos/atualizar-status";
import {
  criarJogo as criarJogoDominio,
  editarJogo as editarJogoDominio,
  type DadosJogoForm,
} from "@/lib/jogos/salvar-jogo";
import { ordenarJogos, type CriterioOrdenacao } from "@/lib/jogos/ordenar";
import type { Jogo, StatusJogo } from "@/types/jogo";

// Remove acentos pra busca não depender de digitar exatamente igual
// (ex: "pokemon" encontra "Pokémon"). U+0300-U+036F é a faixa Unicode
// dos diacríticos combinantes que sobram depois do normalize("NFD").
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Estado do formulário modal de criar/editar — centralizado aqui pra um
// único componente <FormularioJogoModal> servir tanto o botão "+
// Adicionar jogo" (topo da página) quanto o botão "Editar" de cada card.
export type EstadoFormulario =
  | { modo: "criar" }
  | { modo: "editar"; jogo: Jogo }
  | null;

interface JogosContextValue {
  jogos: Jogo[]; // lista completa, sem filtro nem ordenação — base pras estatísticas
  jogosFiltrados: Jogo[]; // após busca + ordenação — base pras colunas
  termoBusca: string;
  setTermoBusca: (valor: string) => void;
  criterioOrdenacao: CriterioOrdenacao;
  setCriterioOrdenacao: (valor: CriterioOrdenacao) => void;
  moverStatus: (
    id: string,
    novoStatus: StatusJogo,
    dadosConclusao?: DadosConclusao
  ) => ResultadoUpdate;
  criarJogo: (dados: DadosJogoForm) => ResultadoUpdate;
  editarJogo: (id: string, dados: DadosJogoForm) => ResultadoUpdate;
  removerJogo: (id: string) => void;
  estadoFormulario: EstadoFormulario;
  abrirCriacao: () => void;
  abrirEdicao: (jogo: Jogo) => void;
  fecharFormulario: () => void;
}

const JogosContext = createContext<JogosContextValue | null>(null);

export function JogosProvider({ children }: { children: ReactNode }) {
  const [jogos, setJogos] = useState<Jogo[]>(jogosMockados);
  const [termoBusca, setTermoBusca] = useState("");
  const [criterioOrdenacao, setCriterioOrdenacao] =
    useState<CriterioOrdenacao>("alfabetica");
  const [estadoFormulario, setEstadoFormulario] =
    useState<EstadoFormulario>(null);

  const jogosFiltrados = useMemo(() => {
    const termo = normalizar(termoBusca.trim());
    const filtrados = termo
      ? jogos.filter((jogo) => normalizar(jogo.titulo).includes(termo))
      : jogos;
    return ordenarJogos(filtrados, criterioOrdenacao);
  }, [jogos, termoBusca, criterioOrdenacao]);

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

  function criarJogo(dados: DadosJogoForm): ResultadoUpdate {
    const resultado = criarJogoDominio(dados, () => crypto.randomUUID());

    if (resultado.ok) {
      setJogos((atual) => [...atual, resultado.jogo]);
    }

    return resultado;
  }

  function editarJogo(id: string, dados: DadosJogoForm): ResultadoUpdate {
    const jogo = jogos.find((j) => j.id === id);

    if (!jogo) {
      return { ok: false, erro: `Jogo com id "${id}" não encontrado.` };
    }

    const resultado = editarJogoDominio(jogo, dados);

    if (resultado.ok) {
      setJogos((atual) =>
        atual.map((j) => (j.id === id ? resultado.jogo : j))
      );
    }

    return resultado;
  }

  function removerJogo(id: string) {
    setJogos((atual) => atual.filter((j) => j.id !== id));
  }

  return (
    <JogosContext.Provider
      value={{
        jogos,
        jogosFiltrados,
        termoBusca,
        setTermoBusca,
        criterioOrdenacao,
        setCriterioOrdenacao,
        moverStatus,
        criarJogo,
        editarJogo,
        removerJogo,
        estadoFormulario,
        abrirCriacao: () => setEstadoFormulario({ modo: "criar" }),
        abrirEdicao: (jogo) => setEstadoFormulario({ modo: "editar", jogo }),
        fecharFormulario: () => setEstadoFormulario(null),
      }}
    >
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
