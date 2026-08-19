"use client";

import { useJogos } from "./jogos-provider";
import type { CriterioOrdenacao } from "@/lib/jogos/ordenar";

const OPCOES: { valor: CriterioOrdenacao; label: string }[] = [
  { valor: "alfabetica", label: "Ordem alfabética" },
  { valor: "data_inicio", label: "Data de início (mais recente)" },
  { valor: "data_conclusao", label: "Data de conclusão (mais recente)" },
  { valor: "nota", label: "Nota (maior primeiro)" },
];

export function OrdenacaoJogos() {
  const { criterioOrdenacao, setCriterioOrdenacao } = useJogos();

  return (
    <label className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-xs text-ink-muted sm:w-56">
      <span className="sr-only">Ordenar por</span>
      <select
        value={criterioOrdenacao}
        onChange={(evento) =>
          setCriterioOrdenacao(evento.target.value as CriterioOrdenacao)
        }
        className="w-full cursor-pointer bg-transparent text-ink focus:outline-none"
      >
        {OPCOES.map((opcao) => (
          <option key={opcao.valor} value={opcao.valor} className="bg-surface">
            {opcao.label}
          </option>
        ))}
      </select>
    </label>
  );
}
