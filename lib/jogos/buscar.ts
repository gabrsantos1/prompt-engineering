import type { Jogo } from "@/types/jogo";

// Remove acentos pra busca não depender de digitar exatamente igual
// (ex: "pokemon" encontra "Pokémon"). U+0300-U+036F é a faixa Unicode
// dos diacríticos combinantes que sobram depois do normalize("NFD").
function normalizar(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

/**
 * Filtra jogos pelo título. Função pura, sem I/O — mesmo padrão de
 * ordenarJogos/atualizarStatusJogo, fácil de testar isolada. Termo vazio
 * (ou só espaço) retorna a lista original sem cópia desnecessária.
 */
export function filtrarPorTitulo(jogos: Jogo[], termoBusca: string): Jogo[] {
  const termo = normalizar(termoBusca.trim());
  if (!termo) return jogos;
  return jogos.filter((jogo) => normalizar(jogo.titulo).includes(termo));
}
