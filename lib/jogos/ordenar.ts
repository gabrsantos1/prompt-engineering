import type { Jogo } from "@/types/jogo";

export type CriterioOrdenacao =
  | "data_inicio"
  | "data_conclusao"
  | "nota"
  | "alfabetica";

// Compara duas datas "AAAA-MM-DD" (ou undefined), mais recente primeiro.
// Sem data vai sempre pro fim, nos dois lados.
function compararData(
  dataA: string | undefined,
  dataB: string | undefined
): number {
  if (!dataA && !dataB) return 0;
  if (!dataA) return 1;
  if (!dataB) return -1;
  return dataB.localeCompare(dataA);
}

/**
 * Ordena uma lista de jogos por um critério. Função pura, sem I/O — mesmo
 * padrão de atualizarStatusJogo (fácil de testar isolada).
 *
 * "data_inicio" e "data_conclusao" são critérios separados, sem fallback
 * de um pro outro (decisão registrada em requisitos.md, seção
 * "Funcionalidades do MVP"): um jogo sem a data do critério escolhido vai
 * pro fim da lista, mesmo que tenha a outra data preenchida.
 */
export function ordenarJogos(
  jogos: Jogo[],
  criterio: CriterioOrdenacao
): Jogo[] {
  const copia = [...jogos];

  switch (criterio) {
    case "alfabetica":
      return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, "pt-BR"));

    case "nota":
      // Maior nota primeiro; sem nota vai pro fim.
      return copia.sort((a, b) => (b.nota ?? -1) - (a.nota ?? -1));

    case "data_inicio":
      return copia.sort((a, b) => compararData(a.dataInicio, b.dataInicio));

    case "data_conclusao":
      return copia.sort((a, b) =>
        compararData(a.dataConclusao, b.dataConclusao)
      );
  }
}
