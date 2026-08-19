"use client";

import { useState } from "react";
import { useJogos, type EstadoFormulario } from "./jogos-provider";
import { Estrelas } from "./estrelas";
import type { DadosJogoForm } from "@/lib/jogos/salvar-jogo";
import type { StatusJogo } from "@/types/jogo";

const LABEL_STATUS: Record<StatusJogo, string> = {
  quero_jogar: "Quero Jogar",
  jogando: "Jogando",
  terminado: "Terminado",
};

const TODOS_STATUS: StatusJogo[] = ["quero_jogar", "jogando", "terminado"];

const FORM_VAZIO: DadosJogoForm = {
  titulo: "",
  plataforma: "",
  status: "quero_jogar",
  dataInicio: "",
  dataConclusao: "",
  nota: 0,
};

function dadosIniciais(estado: Exclude<EstadoFormulario, null>): DadosJogoForm {
  if (estado.modo === "criar") return FORM_VAZIO;

  const jogo = estado.jogo;
  return {
    titulo: jogo.titulo,
    plataforma: jogo.plataforma,
    status: jogo.status,
    dataInicio: jogo.dataInicio ?? "",
    dataConclusao: jogo.dataConclusao ?? "",
    nota: jogo.nota ?? 0,
  };
}

/**
 * Modal único de criar/editar — montado uma vez em PaginaInicial, aberto
 * via useJogos().abrirCriacao()/abrirEdicao(jogo). Um só componente evita
 * duplicar o formulário entre o botão "+ Adicionar jogo" (topo) e o botão
 * "Editar" de cada card.
 */
export function FormularioJogo() {
  const { estadoFormulario } = useJogos();

  if (!estadoFormulario) return null;

  // key remonta o conteúdo a cada abertura — o useState de dentro já
  // nasce com o valor certo (criar = vazio, editar = dados do jogo), sem
  // precisar de useEffect só pra sincronizar estado a partir de prop.
  const key =
    estadoFormulario.modo === "criar" ? "criar" : estadoFormulario.jogo.id;

  return <FormularioJogoConteudo key={key} estadoFormulario={estadoFormulario} />;
}

function FormularioJogoConteudo({
  estadoFormulario,
}: {
  estadoFormulario: Exclude<EstadoFormulario, null>;
}) {
  const { fecharFormulario, criarJogo, editarJogo } = useJogos();
  const [dados, setDados] = useState<DadosJogoForm>(() =>
    dadosIniciais(estadoFormulario)
  );
  const [erro, setErro] = useState<string | null>(null);

  const titulo =
    estadoFormulario.modo === "criar" ? "Adicionar jogo" : "Editar jogo";

  function handleSubmit(evento: React.FormEvent) {
    evento.preventDefault();

    const resultado =
      estadoFormulario.modo === "criar"
        ? criarJogo(dados)
        : editarJogo(estadoFormulario.jogo.id, dados);

    if (!resultado.ok) {
      setErro(resultado.erro);
      return;
    }

    fecharFormulario();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 p-4"
      onClick={(evento) => {
        if (evento.target === evento.currentTarget) fecharFormulario();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="titulo-formulario-jogo"
        className="flex w-full max-w-md flex-col gap-4 rounded-lg border border-border bg-surface-raised p-6"
      >
        <h2
          id="titulo-formulario-jogo"
          className="font-display text-xl font-semibold text-ink"
        >
          {titulo}
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
            Título
            <input
              type="text"
              required
              value={dados.titulo}
              onChange={(e) => setDados({ ...dados, titulo: e.target.value })}
              className="rounded border border-border bg-canvas px-2 py-1.5 font-body text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            />
          </label>

          <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
            Plataforma
            <input
              type="text"
              required
              value={dados.plataforma}
              onChange={(e) =>
                setDados({ ...dados, plataforma: e.target.value })
              }
              placeholder="Ex: PC, PS5, Switch"
              className="rounded border border-border bg-canvas px-2 py-1.5 font-body text-sm text-ink placeholder:text-ink-muted focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            />
          </label>

          <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
            Status
            <select
              value={dados.status}
              onChange={(e) =>
                setDados({ ...dados, status: e.target.value as StatusJogo })
              }
              className="rounded border border-border bg-canvas px-2 py-1.5 font-body text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              {TODOS_STATUS.map((status) => (
                <option key={status} value={status} className="bg-canvas">
                  {LABEL_STATUS[status]}
                </option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
            Data de início (opcional)
            <input
              type="date"
              value={dados.dataInicio}
              onChange={(e) =>
                setDados({ ...dados, dataInicio: e.target.value })
              }
              className="rounded border border-border bg-canvas px-2 py-1.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            />
          </label>

          {dados.status === "terminado" && (
            <>
              <label className="flex flex-col gap-1 font-mono text-xs text-ink-muted">
                Data de conclusão
                <input
                  type="date"
                  value={dados.dataConclusao}
                  onChange={(e) =>
                    setDados({ ...dados, dataConclusao: e.target.value })
                  }
                  className="rounded border border-border bg-canvas px-2 py-1.5 font-mono text-sm text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
                />
              </label>

              <div className="flex flex-col gap-1">
                <span className="font-mono text-xs text-ink-muted">
                  Nota (opcional)
                </span>
                <Estrelas
                  valor={dados.nota}
                  onChange={(nota) => setDados({ ...dados, nota })}
                />
              </div>
            </>
          )}

          {erro && (
            <p role="alert" className="font-mono text-xs text-danger">
              {erro}
            </p>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={fecharFormulario}
              className="rounded-full border border-border px-4 py-1.5 font-mono text-[11px] uppercase tracking-wide text-ink-muted transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-status-jogando"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-full bg-status-jogando px-4 py-1.5 font-mono text-[11px] uppercase tracking-wide text-canvas transition-opacity hover:opacity-90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ink"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
