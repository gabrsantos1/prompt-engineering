import type { Jogo, StatusJogo } from "@/types/jogo";
import type { ResultadoUpdate } from "./atualizar-status";
import { erroConclusaoObrigatoria } from "./regras";

// Formato que sai do formulário de criar/editar — campos de data/nota
// chegam sempre como string vazia/0 quando ocultos pela UI, não undefined,
// porque são inputs controlados.
export interface DadosJogoForm {
  titulo: string;
  plataforma: string;
  status: StatusJogo;
  dataInicio: string;
  dataConclusao: string;
  nota: number;
}

function validarCamposObrigatorios(
  dados: DadosJogoForm
): { ok: true } | { ok: false; erro: string } {
  if (!dados.titulo.trim()) {
    return { ok: false, erro: "Título é obrigatório." };
  }
  if (!dados.plataforma.trim()) {
    return { ok: false, erro: "Plataforma é obrigatória." };
  }
  const erroConclusao = erroConclusaoObrigatoria(dados.status, dados.dataConclusao);
  if (erroConclusao) {
    return { ok: false, erro: erroConclusao };
  }
  return { ok: true };
}

/**
 * Cria um jogo novo a partir dos dados do formulário. `gerarId` é injetado
 * (em vez de chamar crypto.randomUUID() aqui dentro) pra função continuar
 * pura e testável — quem decide como gerar o id é o chamador.
 */
export function criarJogo(
  dados: DadosJogoForm,
  gerarId: () => string
): ResultadoUpdate {
  const validacao = validarCamposObrigatorios(dados);
  if (!validacao.ok) {
    return validacao;
  }

  const jogo: Jogo = {
    id: gerarId(),
    titulo: dados.titulo.trim(),
    plataforma: dados.plataforma.trim(),
    status: dados.status,
  };

  if (dados.dataInicio) {
    jogo.dataInicio = dados.dataInicio;
  }

  if (dados.status === "terminado") {
    jogo.dataConclusao = dados.dataConclusao;
    if (dados.nota > 0) {
      jogo.nota = dados.nota;
    }
  }

  return { ok: true, jogo };
}

/**
 * Edita um jogo existente.
 *
 * data_inicio é campo livre em qualquer status (o formulário sempre
 * mostra), então o valor enviado sempre substitui o antigo — inclusive
 * limpar o campo no formulário remove a data salva.
 *
 * nota/data_conclusao seguem a mesma regra de atualizarStatusJogo: só são
 * sobrescritas se o formulário mandar status "terminado" — se o usuário
 * mudar pra outro status, o registro preserva os dados antigos (a UI é
 * quem esconde esses dois campos fora de "terminado", não esta função).
 */
export function editarJogo(jogo: Jogo, dados: DadosJogoForm): ResultadoUpdate {
  const validacao = validarCamposObrigatorios(dados);
  if (!validacao.ok) {
    return validacao;
  }

  const jogoEditado: Jogo = {
    ...jogo,
    titulo: dados.titulo.trim(),
    plataforma: dados.plataforma.trim(),
    status: dados.status,
    dataInicio: dados.dataInicio || undefined,
  };

  if (dados.status === "terminado") {
    jogoEditado.dataConclusao = dados.dataConclusao;
    jogoEditado.nota = dados.nota > 0 ? dados.nota : undefined;
  }

  return { ok: true, jogo: jogoEditado };
}
