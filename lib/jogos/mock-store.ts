// Dados mocados de jogos — sem banco de dados nesta fase de MVP
// (ver requisitos.md, seção "Stack técnica").
//
// Versão zero-shot, escolhida pelo grupo como definitiva após o teste de
// curadoria de contexto/comparação com a versão few-shot.

import type { Jogo } from "@/types/jogo";

export const jogosMockados: Jogo[] = [
  {
    id: "1",
    titulo: "Counter-Strike 2",
    plataforma: "PC",
    status: "jogando",
    dataInicio: "2025-01-10",
  },
  {
    id: "2",
    titulo: "Rocket League",
    plataforma: "PC",
    status: "terminado",
    nota: 4,
    dataInicio: "2025-02-01",
    dataConclusao: "2025-02-20",
  },
  {
    id: "3",
    titulo: "League of Legends",
    plataforma: "PC",
    status: "jogando",
    dataInicio: "2024-11-05",
  },
  {
    id: "4",
    titulo: "Valorant",
    plataforma: "PC",
    status: "quero_jogar",
  },
  {
    id: "5",
    titulo: "Rainbow Six Siege",
    plataforma: "PC",
    status: "terminado",
    nota: 5,
    dataInicio: "2024-06-15",
    dataConclusao: "2024-09-30",
  },
  {
    id: "6",
    titulo: "EA SPORTS FC 2026",
    plataforma: "PS5",
    status: "jogando",
    dataInicio: "2026-07-01",
  },
  {
    id: "7",
    titulo: "Forza Horizon 5",
    plataforma: "PC",
    status: "quero_jogar",
  },
];
