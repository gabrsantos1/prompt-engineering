import type { StatusJogo } from "@/types/jogo";

/**
 * Regra única de requisitos.md ("Regras de negócio"): data_conclusao é
 * obrigatória ao mudar o status de um jogo para "terminado". Compartilhada
 * entre atualizarStatusJogo (botão "mover para") e salvarJogo (formulário
 * de criar/editar) pra não duplicar a mesma checagem em dois lugares que
 * podem divergir com o tempo.
 */
export function erroConclusaoObrigatoria(
  status: StatusJogo,
  dataConclusao: string | undefined
): string | null {
  if (status === "terminado" && !dataConclusao) {
    return "Data de conclusão é obrigatória ao marcar o jogo como terminado.";
  }
  return null;
}
