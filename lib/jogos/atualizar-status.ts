import type { Jogo, StatusJogo } from "@/types/jogo";
import { erroConclusaoObrigatoria } from "./regras";

// Dados que só fazem sentido informar quando o novo status é "terminado"
export interface DadosConclusao {
  dataConclusao: string;
  nota?: number;
}

export type ResultadoUpdate =
  | { ok: true; jogo: Jogo }
  | { ok: false; erro: string };

/**
 * Atualiza o status de um jogo, aplicando as regras de negócio de
 * requisitos.md (seção "Regras de negócio"):
 * - ao mudar PARA "terminado", data_conclusao é obrigatória.
 * - nota só é aceita/persistida quando o status final é "terminado".
 * - ao SAIR de "terminado" para outro status, nota e data_conclusao são
 *   preservados no registro (não apagados) — quem oculta/desabilita o
 *   campo nota fora do status "terminado" é a UI, não esta função.
 *
 * Retorna { ok, ... } em vez de lançar exceção: decisão já validada no
 * teste de curadoria de contexto, pra evitar try/catch espalhado e forçar
 * o tratamento do erro no formulário que chama a Server Action.
 */
export function atualizarStatusJogo(
  jogo: Jogo,
  novoStatus: StatusJogo,
  dadosConclusao?: DadosConclusao
): ResultadoUpdate {
  if (novoStatus === "terminado") {
    const erro = erroConclusaoObrigatoria(novoStatus, dadosConclusao?.dataConclusao);
    if (erro) {
      return { ok: false, erro };
    }

    // erroConclusaoObrigatoria só retorna null quando dataConclusao existe,
    // então dadosConclusao necessariamente está definido aqui.
    return {
      ok: true,
      jogo: {
        ...jogo,
        status: novoStatus,
        dataConclusao: dadosConclusao!.dataConclusao,
        nota: dadosConclusao!.nota ?? jogo.nota,
      },
    };
  }

  return {
    ok: true,
    jogo: { ...jogo, status: novoStatus },
  };
}
