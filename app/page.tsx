import { JogosProvider } from "./jogos/jogos-provider";
import { ColunaStatus } from "./jogos/coluna-status";
import { BuscaJogos } from "./jogos/busca-jogos";
import { OrdenacaoJogos } from "./jogos/ordenacao-jogos";
import { EstatisticasJogos } from "./jogos/estatisticas-jogos";
import { BotaoAdicionar } from "./jogos/botao-adicionar";
import { FormularioJogo } from "./jogos/formulario-jogo";

export default function PaginaInicial() {
  return (
    <JogosProvider>
      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 px-6 py-10 sm:px-10">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div className="flex flex-col gap-1">
            <p className="font-mono text-xs uppercase tracking-[0.2em] text-ink-muted">
              GameBacklog
            </p>
            <h1 className="font-display text-3xl font-semibold text-ink sm:text-4xl">
              Sua estante de jogos
            </h1>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
            <BuscaJogos />
            <OrdenacaoJogos />
            <BotaoAdicionar />
          </div>
        </header>

        <EstatisticasJogos />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <ColunaStatus status="quero_jogar" />
          <ColunaStatus status="jogando" />
          <ColunaStatus status="terminado" />
        </div>
      </main>

      <FormularioJogo />
    </JogosProvider>
  );
}
