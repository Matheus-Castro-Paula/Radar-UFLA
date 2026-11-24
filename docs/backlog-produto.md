# Product Backlog

## 1. Link do GitHub Project

[Project](https://github.com/Matheus-Castro-Paula/Radar-UFLA/projects/2)

## 2. Campos obrigatórios no Project

Cada item deve possuir, no mínimo:

- título claro;

- tipo (`funcionalidade`, `requisito`, `documentação`, `tarefa técnica`, `teste`, `defeito`);

- prioridade (Alta/Média/Baixa);

- responsável;

- sprint;

- status (A fazer, Em andamento, Em revisão, Concluído);

- critério de aceitação ou conclusão;

- requisito relacionado, quando aplicável.

## 3. Estratégia de priorização

A priorização considerou três critérios principais:

1. **Dependência técnica**: itens que são pré-requisito para outros (ex: estruturação do repositório, modelagem de dados e ambiente Docker) foram tratados como prioridade **Alta**, por bloquearem o andamento das tarefas seguintes;

2. **Valor para o núcleo do produto**: funcionalidades que representam o objetivo central do Radar UFLA — publicação de itens achados/perdidos, cadastro/login e estrutura inicial do front-end — foram tratados como prioridade **Alta**;

3. **Complexidade e complementaridade**: funcionalidades que agregam valor mas dependem do núcleo já estar funcionando (busca, categoria de documentos pessoais, upload de imagens, gestão de anúncios próprios e estabilização/testes) foram tratadas como prioridade **Média**.

## 4. Visão resumida do backlog

| ID | Link da Issue / PR | Tipo | Descrição curta | Prioridade | Requisito | Sprint | Estado final |
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- |
| T-01 | [#1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/1) | Documentação | Estruturar repositório e documentação inicial | Alta | — | 1 | Concluído |
| T-02 | [#2](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/2) | Requisito / Tarefa técnica | Modelar entidades iniciais do banco de dados | Alta | `RNF-06` | 2 | Concluído |
| T-03 | [#3](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/3) | Tarefa técnica | Configurar banco de dados MySQL via Docker | Alta | `RNF-06` | 2 | Concluído |
| US-01 | [#4](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/4) | Funcionalidade | Cadastro e login de usuário (autenticação JWT) | Alta | `RF-01`, `RF-02` | 2 | Concluído (RBAC parcial) |
| US-02 | [#5](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/5) | Funcionalidade | Estrutura inicial do front-end com layout do feed | Alta | `RF-04`, `RNF-01` | 1 | Concluído |
| US-03 | [#6](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/6) | Funcionalidade | Publicação de item na aba "Achados" | Alta | `RF-07` | 2 | Concluído |
| US-04 | [#7](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/7) | Funcionalidade | Publicação de item na aba "Perdidos" | Alta | `RF-07` | 2 | Concluído |
| US-05 | [#8](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/8) | Funcionalidade | Busca/pesquisa nos feeds | Média | `RF-05`, `RF-06` | 2 | Concluído (parcial) |
| US-06 | [#9](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/9) | Requisito / Funcionalidade | Categoria "Documentos pessoais" (sem foto do documento) | Média | `RF-07`, `RN-04` | 2 | Concluído |
| T-04 | [#10](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/10) | Tarefa técnica | Configurar upload local de mídias (Multer + volume Docker) | Média | `RF-08` | 2 | Concluído (ADR-08) |
| US-07 | [#11](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/11) | Funcionalidade / Tarefa técnica | Integrar tela/formulário de publicação ao back-end | Alta | `RF-07` | 2 | Concluído |
| T-05 | [#12](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/12) | Documentação | Instruções de instalação e execução do projeto | Média | `RNF-06` | 2 | Concluído |
| T-06 | [#14](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/14) | Documentação / PO | Atualizar documentação e artefatos da Sprint 2 | Média | — | 2 | Concluído |
| T-07 | [#15](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/15) | Documentação / Gestão | Finalizar relatório da Sprint 2 e gerar Tag Git | Média | — | 2 | Concluído |
| DT-01 | [#24](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/24) | Tarefa técnica / Refatoração | Extração da camada `AnuncioService` do `anuncioController` | Alta | — | 4 | Concluído |
| DT-02 | [#25](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/25) | Requisito / Segurança | Isolar regra da LGPD (Documentos Pessoais) no AnuncioService | Alta | `RN-04` | 4 | Concluído |
| DT-03 | [#26](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/26) | Documentação / Arquitetura | Documento de decisões locais de projeto (ADRs, coesão/acoplamento) | Média | — | 4 | Concluído |
| T-08 | [#27](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/27) | Documentação / PO | Atualizar relatório da Sprint 4 e Backlog de Débitos Técnicos | Média | — | 4 | Concluído |
| DT-04 | — | Tarefa técnica / Segurança | Mover `JWT_SECRET` para variáveis de ambiente (`.env`) | Alta | `RNF-06` | 4 | Concluído |
| DT-05 | — | Tarefa técnica / Refatoração | Centralizar chave de autenticação JWT duplicada | Média | — | 4 | Concluído |
| DT-06 | [#29](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/29) / [PR #38](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/38) | Tarefa técnica / Refatoração | Refatoração de validações utilizando o padrão *Chain of Responsibility* | Alta | `RN-04`, `RF-07` | 5 | Concluído |
| T-09 | [PR #37](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/37) | Documentação / Arquitetura | Documentação da ADR-04, atualização dos diagramas UML e diretrizes em `.harness` | Média | — | 5 | Concluído |
| T-10 | — | Teste / Evidência | Execução dos relatórios de testes de validação de anúncios (antes/depois) | Média | — | 5 | Concluído |
| T-11 | — | Documentação / PO | Consolidação do backlog e elaboração do relatório final da Sprint 5 | Média | — | 5 | Concluído |
| T-12 | [PR #45](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/45) | Documentação / Arquitetura | Elaboração da arquitetura C4, ADR-05 a ADR-08 e atualização de requisitos/README | Alta | `RNF-06` | 6 | Concluído |
| T-13 | [PR #41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/41) | Tarefa técnica / Back-end | Upload local de mídias via Multer e validação no AnuncioController | Alta | `RF-08`, `RN-04` | 6 | Concluído |
| T-14 | [PR #42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/42) | Tarefa técnica / Infraestrutura | Mapeamento do volume Docker `uploads_data` (`/uploads`) e healthcheck do MySQL | Alta | `RNF-06` | 6 | Concluído |
| T-15 | [PR #43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/43) | Funcionalidade / Front-end | Integração do formulário e exibição de mídias armazenadas no volume local | Alta | `RF-08` | 6 | Concluído |
| M-08 | — | Débito técnico / Segurança | Configuração de HTTPS/TLS na comunicação da API | Média | `RNF-03` | — | Não implementado (trabalho futuro) |
| M-09 | — | Débito técnico / Auditoria | Implementação de Audit Log para registro de operações críticas | Média | `RNF-04` | — | Não implementado (trabalho futuro) |
| M-10 | [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Débito técnico / Segurança | Parametrização e restrição de política de CORS (`CORS_ORIGINS`) e porta (`PORT`) | Média | `RNF-03` | 8 | Concluído |
| M-11 | [PR #66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Débito técnico / Segurança | Isolamento de credenciais sensíveis do banco no Docker Compose via `.env` | Alta | `RNF-03` | 8 | Parcial (trabalho futuro: usuário próprio no MySQL) |
| M-12 | — | Débito técnico / Desempenho | Implementação de paginação e filtros no servidor para listagem de anúncios | Média | `RNF-02` | — | Não implementado (trabalho futuro) |
| M-13 | [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Débito técnico / Arquitetura | Exclusão física de mídias órfãs em `/uploads` na remoção e edição de anúncios | Média | `RF-08`, `RNF-03` | 8 | Concluído |
| M-14 | — | Débito técnico / Confiabilidade | Configuração de monitoramento de saúde da aplicação e meta de uptime | Baixa | `RNF-04` | — | Não implementado (trabalho futuro) |
| T-16 | [#52](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/52) | Documentação / Teste | Elaboração do Plano de Testes (`plano-de-testes.md`) e matriz de rastreabilidade (`CT-01` a `CT-13`) | Alta | `RF-01`, `RF-07`, `RF-08`, `RN-02`, `RN-04`, `RNF-02`, `RNF-03` | 7 | Concluído |
| M-15 | [#49](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/49) | Defeito / Back-end | Corrigir persistência e validação de `data_ocorrencia` ao criar/editar anúncio | Alta | `RF-07` | 7 | Concluído |
| M-16 | [#50](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/50) / [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Defeito / Segurança | Bloquear envio de URLs externas no campo `fotos` via payload JSON (`POST` na Sprint 7 e `PUT` na Sprint 8) | Alta | `RF-08`, `RNF-03` | 7–8 | Concluído |
| M-18 | [#51](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/51) | Defeito / Back-end | Gravar metadados `mime_type` e `tamanho_bytes` na tabela `foto_anuncio` | Média | `RF-08` | 7 | Concluído |
| T-17 | [#53](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/53) | Teste / Back-end | Implementar suíte automatizada (Jest + Supertest, 31 testes, 88,88% cobertura) e ambiente isolado | Alta | `RF-01`, `RF-07`, `RF-08`, `RN-02`, `RN-04`, `RNF-03` | 7 | Concluído |
| T-18 | [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54) | Teste / Front-end | Execução e evidências visuais dos testes manuais de interface (`CT-12`, 9/9 passos) | Alta | `RF-07`, `RF-08`, `RN-04` | 7 | Concluído |
| T-19 | — | Documentação / PO | Consolidar rastreabilidade em `requisitos.md`, `README.md`, backlog e relatório da Sprint 7 | Média | — | 7 | Concluído |
| M-17 | [PR #66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Débito técnico / Configuração | Tornar idempotentes os seeders iniciais (`findOrCreate` em `demo-usuarios.js`) | Baixa | `RNF-03` | 8 | Concluído |
| M-05 | [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Débito técnico / Segurança | Bloquear CPF e números de documentos pessoais no texto na API (`RegraLGPDHandler.js`) | Alta | `RN-04`, `RNF-03` | 8 | Concluído |
| T-20 | [PR #68](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/68) | Teste / Back-end | Padronizar prefixos `CT-01` a `CT-13` e expandir suíte para 50 testes automatizados (92,03% cobertura) | Alta | `RF-01`–`RNF-03` | 8 | Concluído |
| T-21 | [PR #66](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/66) | Tarefa técnica / Infraestrutura | Validar execução isolada em Docker (`npm run test:docker`), volume `uploads_data` e extrair logs de evidência | Alta | `RNF-03`, `RNF-06` | 8 | Concluído |
| US-08 | — | Funcionalidade / Front-end | Implementar botões de marcar como resolvido e excluir anúncio próprio (`RF-09`), `privacidade.html` e auditoria `RNF-05` | Média | `RF-09`, `RNF-05` | 8 | Concluído |
| T-22 | — | Documentação / Teste | Elaborar relatório final de testes (`evidencias-testes.md`), alinhar documentação técnica e gerar tag `sprint-08` | Alta | — | 8 | Concluído |
| T-23 | — | Documentação / PO | Consolidar status final do `backlog-produto.md`, documentar `uso-de-ia.md` e elaborar relatório da Sprint 8 | Média | — | 8 | Concluído |

### 4.1 Requisitos e débitos não implementados ou parciais (Trabalhos Futuros)

Em alinhamento com [`requisitos.md`](requisitos/requisitos.md) e [`evidencias-testes.md`](testes/evidencias-testes.md), os itens abaixo não integraram o escopo concluído do MVP e ficam registrados formalmente como trabalhos futuros:

- **`RF-02` e `RN-02` (Parciais — Papéis e exceção administrativa):** O campo `tipo_usuario` é persistido no cadastro e incluído no JWT, mas as rotas administrativas ainda não possuem privilégios diferenciados no back-end.
- **`RF-03` (Não implementado — Painel "Meus Anúncios"):** Priorizado abaixo da vitrine pública e do gerenciamento direto nos cards (`RF-09`); não possui rota nem tela dedicada.
- **`RF-05` e `RF-06` (Parciais — Filtros e busca):** A vitrine filtra por categoria, local e texto (case-insensitive), mas ainda não oferece filtro por período nem normalização de acentos.
- **`RF-10` (Não implementado — Comentários):** Possui apenas tabela e model no banco; rotas e interface foram postergadas.
- **`RF-11` (Não implementado — Gestão de parâmetros):** Categorias são mantidas como lista fechada no código conforme ADR-03 (`decisoes-de-projeto.md`).
- **`RF-12` e `RN-01` (Não implementados — Denúncias e quarentena):** Exigem a criação da entidade `Denuncia` e do fluxo de status `EM_QUARENTENA`.
- **`RF-13` e `RN-05` (Não implementados — Notificação automática de match):** Dependem de serviço externo de envio de e-mail, fora da infraestrutura prevista para o projeto.
- **`RF-14` e `RN-03` (Não implementados — Expiração em 60 dias):** Dependem de rotina agendada (cron/worker) e transição automática para o status `EXPIRADO`.
- **`RNF-01`, `RNF-03`, `RNF-04` e débitos técnicos (`M-01`, `M-07`, `M-08`, `M-09`, `M-11` restante, `M-12`, `M-14`):** Compreendem evolução para layout mobile-first (`RNF-01`), proxy reverso com HTTPS/TLS (`M-08`), usuário dedicado da aplicação no MySQL (`M-11`), log de auditoria e monitoramento de disponibilidade (`M-09`, `M-14`), paginação no servidor (`M-12`), extração de `AuthService` (`M-01`) e Template Method na corrente de validação (`M-07`).

## 5. Definition of Ready

Um item está pronto para entrar em uma sprint quando:

- [ ] possui descrição compreensível;

- [ ] tem valor ou objetivo identificável;

- [ ] possui critério de aceitação/conclusão;

- [ ] dependências principais foram registradas;

- [ ] foi estimado de acordo com a convenção do grupo.

## 6. Definition of Done

Um item está concluído quando:

- [ ] atende aos critérios de aceitação;

- [ ] foi revisado por outro integrante;

- [ ] está integrado à branch `main`;

- [ ] possui testes/evidências quando aplicável;

- [ ] atualizou a documentação afetada;

- [ ] está relacionado ao arquivo da sprint.

## 7. Histórico de refinamento

| Sprint | Itens criados/divididos/removidos | Motivo | Evidência |
| ----- | ----- | ----- | ----- |
| Sprint 1 | Criação dos 12 itens iniciais do Product Backlog | Definição do escopo inicial do Radar UFLA | `#1`–`#12` |
| Sprint 2 | Inclusão dos itens `#14` e `#15` e mapeamento dos RFs/RNFs | Mapeamento detalhado dos requisitos funcionais e gestão de artefatos da Sprint 2 | `#14`, `#15` |
| Sprint 4 | Inclusão dos débitos técnicos `DT-01` a `DT-05` e tarefas `#24` a `#27` | Refatoração da camada de serviços, isolamento de regras LGPD, elaboração de ADRs e correção de débitos de segurança | `#24`–`#27`, `#28` |
| Sprint 5 | Inclusão do débito técnico `DT-06` (Issue `#29`) e tarefas `T-09` a `T-11` | Implementação do padrão *Chain of Responsibility*, publicação da ADR-04, atualização dos diagramas UML e emissão de evidências de validação (antes/depois) | `#29`, `PR #37`, `PR #38` |
| Sprint 6 | Inclusão das tarefas `T-12` a `T-15`, resolução do `T-04` (ADR-08) e cadastro dos débitos de arquitetura `M-08` a `M-14` | Reestruturação da arquitetura global (ADR-05 a ADR-08), substituição do Cloudinary por Multer e volume Docker `/uploads`, e mapeamento dos débitos de segurança/infraestrutura da Sprint 6 | `PR #41`, `PR #42`, `PR #43`, `PR #45` |
| Sprint 7 | Conclusão de `T-13` a `T-15`; inclusão e resolução de `T-16` a `T-19` e dos defeitos `M-15`, `M-16` e `M-18`; registro do débito `M-17` | Elaboração do Plano de Testes (`CT-01` a `CT-13`), implementação da suíte automatizada (`Jest` + `Supertest`), validação manual da interface (`CT-12`) e correção das falhas de persistência e upload | `#49`, `#50`, `#51`, `#52`, `#53`, `#54` |
| Sprint 8 | Conclusão de `M-05`, `M-10`, `M-13`, `M-16` (`PUT`) e `M-17`; conclusão parcial de `M-11`; entrega de `US-08` (`RF-09`/`RNF-05`) e `T-20` a `T-23`; consolidação dos trabalhos futuros (`RF-02` parcial, `RF-03`, `RF-10`–`RF-14`, `RNF-04`, `M-08`, `M-09`, `M-12`, `M-14`) | Estabilização final de segurança e armazenamento, expansão da suíte automatizada para 50 testes (92,03% cobertura), encerramento da rastreabilidade de requisitos e documentação final da disciplina | `PR #66`, `PR #68`, `evidencias-testes.md` |