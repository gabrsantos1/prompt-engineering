# Requisitos — GameBacklog

## Visão geral

Sistema web para organizar jogos que o usuário quer jogar, está jogando ou já
terminou. Projeto single-user, sem autenticação, escopo de MVP para o TP1 de
Engenharia de Prompt e Contexto.

## Entidade: Jogo

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `id` | identificador único | sim | gerado pelo sistema |
| `titulo` | texto | sim | |
| `plataforma` | texto | sim | ex: PC, PS5, Switch |
| `status` | enum | sim | `quero_jogar` \| `jogando` \| `terminado` |
| `nota` | número | não | avaliação pessoal (0-5 estrelas) |
| `data_inicio` | data | não | quando começou a jogar |
| `data_conclusao` | data | não | quando terminou |
| `capa` | URL/imagem | não | capa do jogo |

## Status e transições

- Um jogo pertence a exatamente um status por vez.
- Transições permitidas livremente entre `quero_jogar`, `jogando` e
  `terminado`, em qualquer ordem — o usuário pode pular etapa (ex: marcar
  um jogo como `terminado` direto, sem passar por `jogando`).

## Funcionalidades do MVP

- CRUD de jogos (criar, editar, remover, listar).
- Mover jogo entre os três status.
- Busca por nome do jogo.
- Ordenação por: data (início/conclusão), nota, ordem alfabética.
- Estatísticas básicas: total de jogos por status, total concluído.

## Fora do escopo do MVP (não implementar agora)

- Autenticação / múltiplos usuários.
- Integração com APIs externas de jogos (IGDB, Steam, etc.).
- Qualquer chamada de IA em tempo de execução — IA é usada só na construção.

## Stack técnica (proposta)

- **Next.js (App Router) + TypeScript** — front-end e back-end no mesmo
  projeto, reduz complexidade pra um grupo pequeno.
- **Sem banco de dados** — dados mocados (array/JSON em memória ou arquivo
  estático), sem persistência real nesta fase de MVP.
- **Tailwind** para estilização.
- Sem autenticação nesta fase.
- **Estado 100% client-side (`useState`/Context), sem Server Action para
  mutação.** Server Actions rodam em funções serverless no Vercel, sem
  garantia de memória compartilhada entre requisições — mutar o array
  mockado dentro de uma Server Action funcionaria em dev local, mas
  resetaria/quebraria em produção. Como o projeto já não tem persistência
  real neste MVP, o estado fica no navegador durante a sessão (reseta ao
  dar F5, não sincroniza entre abas) — troca aceita conscientemente, não
  uma limitação escondida.

*Justificativa: escolha otimizada para simplicidade de setup e para o
caminho de deploy via Vercel que o grupo já vai seguir no final do projeto.
Dados mocados evitam a complexidade de configurar e manter um banco só
para demonstrar o MVP.*

## Regras de negócio

- Campo `nota` só é editável quando `status = terminado`; nos demais status
  fica desabilitado/oculto na interface.
- Campo `data_conclusao` é **obrigatório** ao mudar o status de um jogo
  para `terminado`.