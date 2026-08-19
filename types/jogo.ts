// Tipos da entidade Jogo — fonte única, usada por mock-store, funções de
// domínio e Server Actions (ver requisitos.md, seção "Entidade: Jogo").

export type StatusJogo = "quero_jogar" | "jogando" | "terminado";

export interface Jogo {
  id: string;
  titulo: string;
  plataforma: string;
  status: StatusJogo;
  nota?: number; // 0 a 5 estrelas — só faz sentido quando status é "terminado"
  dataInicio?: string;
  dataConclusao?: string;
  capa?: string;
}
