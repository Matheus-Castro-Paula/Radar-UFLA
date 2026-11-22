# Autoavaliação das Entregas — Radar UFLA

> Atualizado na Sprint 8 | Responsável: Tech Lead (`@BernarDEVthomaz`), revisado pelo grupo

Avaliação do próprio grupo sobre cada sprint, segundo as quatro dimensões da seção 7.5 do regulamento: artefato central (0,75), incremento da aplicação (0,75), Scrum e gestão (0,50) e GitHub, documentação e rastreabilidade (0,50). A coluna **Pontos fracos** registra o que o grupo reconhece como ponto fraco de cada entrega.

## 1. Sprints

| Sprint | Tag | Artefato central | Incremento | Scrum e gestão | GitHub e rastreabilidade | Pontos fracos |
| --- | --- | --- | --- | --- | --- | --- |
| 1 | [`sprint-01`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-01) | Atendido: visão geral, README e backlog com mais de 10 itens | Atendido: estrutura inicial do front-end | Atendido: Project com estados | Atendido | Backlog inicial com critérios de aceitação curtos |
| 2 | [`sprint-02`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-02) | Atendido: RF, RNF, histórias e fora do escopo | Atendido: cadastro e login com JWT | Atendido | Atendido | `RF-03` e `RF-10` marcados como concluídos sem implementação; corrigido só na Sprint 8 |
| 3 | [`sprint-03`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-03) | Atendido: modelos comportamentais e estruturais com matriz | Atendido: fluxo de autenticação coerente com o modelo | Atendido | Atendido | Diagramas só em Mermaid no próprio `.md`, sem a pasta `docs/modelagem/imagens/` do Apêndice A |
| 4 | [`sprint-04`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-04) | Atendido: ADR-01 a ADR-03, análise de coesão e acoplamento | Atendido: `AnuncioService` com antes e depois | Atendido | Atendido | `AuthService` (M-01) identificado e nunca feito |
| 5 | [`sprint-05`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-05) | Atendido: Chain of Responsibility com alternativas e custos | Atendido: refatoração com 12 cenários iguais antes e depois | Atendido | Parcial: commits do PR #38 citam a Issue errada | Sem testes automatizados dos handlers nesta sprint |
| 6 | [`sprint-06`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-06) | Atendido: contexto, contêineres, componentes, RNF × decisões | Atendido: Docker, volume e upload com Multer | Atendido | Atendido | Débitos M-15, M-16 e M-18 entraram junto com o upload |
| 7 | [`sprint-07`](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-07) | Atendido: plano com 13 casos, riscos e critérios | Atendido: 31 testes automatizados e roteiro manual | Atendido | Atendido | Testes sem o prefixo `CT-xx` no nome; CT-13 não executado |
| 8 | `sprint-08` | Atendido: [`evidencias-testes.md`](../docs/testes/evidencias-testes.md) e [`uso-de-ia.md`](../docs/uso-de-ia.md) | Ver seção 2 | Ver seção 2 | Ver seção 2 | Concentração de merges no fim da sprint |

## 2. Sprint 8 em detalhe

| Exigência do regulamento (seção 9.9) | Onde está | Situação |
| --- | --- | --- |
| Relatório de testes com aprovados, reprovados e não executados | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seção 2 | Atendido |
| Análise de defeitos e correções | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seção 3 | Atendido |
| Requisitos atendidos, parciais e não atendidos | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seção 4 | Atendido |
| Limitações e trabalhos futuros | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seção 5 | Atendido |
| Síntese das oito sprints | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seção 6 | Atendido |
| Registro do uso de IA | [`uso-de-ia.md`](../docs/uso-de-ia.md) | Responsável: PO |
| Requisitos, modelos, projeto, padrões e arquitetura alinhados ao código | [`requisitos.md`](../docs/requisitos/requisitos.md), [`modelagem.md`](../docs/modelagem/modelagem.md), [`decisoes-de-projeto.md`](../docs/projeto/decisoes-de-projeto.md), [`padroes-de-projeto.md`](../docs/padroes/padroes-de-projeto.md), [`arquitetura.md`](../docs/arquitetura/arquitetura.md) | Atendido |
| Plano de testes e matriz atualizados | [`plano-de-testes.md`](../docs/testes/plano-de-testes.md) | Atendido |
| Backlog com a situação final de cada item | [`backlog-produto.md`](../docs/backlog-produto.md) | Responsável: PO |
| README final com imagens e instruções | [`README.md`](../README.md) | Responsável: Front-end |
| Correção dos defeitos críticos | PR [#66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) (M-11, M-17) e PR de back-end (M-05, M-10, M-13, M-16) | M-11 e M-17 corrigidos; demais em revisão |
| Suíte de testes executável | `npm run test:docker` em `API/Back-End` | Atendido: 31 de 31 |
| Issues encerradas ou justificadas | GitHub Project | Responsável: PO |
| Tag `sprint-08` e preparação da `versao-final` | Repositório | Criada pelo Tech Lead após o merge dos PRs |

## 3. Entrega final (preparação)

| Item da seção 12.1 | Situação |
| --- | --- |
| README com problema, solução, integrantes, tecnologias e execução | Em atualização na Sprint 8 |
| Código-fonte da aplicação web | Presente em `API/` |
| Documentação de requisitos, modelagem, projeto, padrões, arquitetura e testes | Presente e alinhada na Sprint 8 |
| Backlog final e documentação das 8 sprints | `sprint-01.md` a `sprint-08.md` |
| Evidências de testes | [`docs/testes/evidencias/`](../docs/testes/evidencias/) |
| Registro do uso de IA | [`docs/uso-de-ia.md`](../docs/uso-de-ia.md) |
| Slides em `docs/apresentacao/` | A fazer até 30/11/2026 |
| Link do vídeo no README | A fazer até 30/11/2026 |
| Limitações e pendências | [`evidencias-testes.md`](../docs/testes/evidencias-testes.md), seções 4.3 e 5 |
