# Product Backlog

## 1. Link do GitHub Project

[Project](https://github.com/Matheus-Castro-Paula/Radar-UFLA/projects/2)

## 2. Campos obrigatórios no Project

Cada item deve possuir, no mínimo:

* título claro;

* tipo (`funcionalidade`, `requisito`, `documentação`, `tarefa técnica`, `teste`, `defeito`);

* prioridade (Alta/Média/Baixa);

* responsável;

* sprint;

* status (A fazer, Em andamento, Em revisão, Concluído);

* critério de aceitação ou conclusão;

* requisito relacionado, quando aplicável.

## 3. Estratégia de priorização

A priorização considerou três critérios principais:

1. **Dependência técnica**: itens que são pré-requisito para outros (ex: estruturação do repositório, modelagem de dados e ambiente Docker) foram tratados como prioridade **Alta**, por bloquearem o andamento das tarefas seguintes;

2. **Valor para o núcleo do produto**: funcionalidades que representam o objetivo central do Radar UFLA — publicação de itens achados/perdidos, cadastro/login e estrutura inicial do front-end — foram tratadas como prioridade **Alta**;

3. **Complexidade e complementaridade**: funcionalidades que agregam valor mas dependem do núcleo já estar funcionando (busca, categoria de documentos pessoais, upload de imagens e gestão de documentação) foram tratadas como prioridade **Média**.

## 4. Visão resumida do backlog

| ID | Link da Issue / PR | Tipo | Descrição curta | Prioridade | Requisito | Sprint | Estado final | 
| ----- | ----- | ----- | ----- | ----- | ----- | ----- | ----- | 
| T-01 | [#1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/1) | Documentação | Estruturar repositório e documentação inicial | Alta | — | 1 | Concluído | 
| T-02 | [#2](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/2) | Requisito / Tarefa técnica | Modelar entidades iniciais do banco de dados | Alta | `RNF-06` | 2 | Concluído | 
| T-03 | [#3](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/3) | Tarefa técnica | Configurar banco de dados MySQL via Docker | Alta | `RNF-06` | 2 | Concluído | 
| US-01 | [#4](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/4) | Funcionalidade | Cadastro e login de usuário (autenticação JWT) | Alta | `RF-01`, `RF-02` | 2 | Concluído | 
| US-02 | [#5](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/5) | Funcionalidade | Estrutura inicial do front-end com layout do feed | Alta | `RF-04`, `RNF-01` | 1 | Concluído | 
| US-03 | [#6](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/6) | Funcionalidade | Publicação de item na aba "Achados" | Alta | `RF-07` | 2 | Concluído | 
| US-04 | [#7](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/7) | Funcionalidade | Publicação de item na aba "Perdidos" | Alta | `RF-07` | 2 | Concluído | 
| US-05 | [#8](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/8) | Funcionalidade | Busca/pesquisa nos feeds | Média | `RF-05`, `RF-06` | 2 | Concluído | 
| US-06 | [#9](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/9) | Requisito / Funcionalidade | Categoria "Documentos pessoais" (sem foto do documento) | Média | `RF-07`, `RN-04` | 2 | Concluído | 
| T-04 | [#10](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/10) | Tarefa técnica | Configurar upload local de mídias (Multer + volume Docker) | Média | `RF-08` | 2 | Concluído (ADR-08) | 
| US-07 | [#11](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/11) | Funcionalidade / Tarefa técnica | Integrar tela/formulário de publicação ao back-end | Alta | `RF-03`, `RF-07` | 2 | Concluído | 
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
| T-13 | [PR #41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/41) | Tarefa técnica / Back-end | Upload local de mídias via Multer e validação no AnuncioController | Alta | `RF-08`, `RN-04` | 6 | Em andamento (#41) | 
| T-14 | [PR #42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/42) | Tarefa técnica / Infraestrutura | Mapeamento do volume Docker `uploads_data` (`/uploads`) e healthcheck do MySQL | Alta | `RNF-06` | 6 | Em andamento (#42) | 
| T-15 | [PR #43](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/43) | Funcionalidade / Front-end | Integração do formulário e exibição de mídias armazenadas no volume local | Alta | `RF-08` | 6 | Em andamento (#43) | 
| M-08 | — | Débito técnico / Segurança | Configuração de HTTPS/TLS na comunicação da API | Média | `RNF-03` | 6 | A fazer | 
| M-09 | — | Débito técnico / Auditoria | Implementação de Audit Log para registro de operações críticas | Média | `RNF-04` | 6 | A fazer | 
| M-10 | — | Débito técnico / Segurança | Parametrização e restrição de política de CORS | Média | `RNF-03` | 6 | A fazer | 
| M-11 | — | Débito técnico / Segurança | Isolamento de credenciais sensíveis do banco no Docker Compose via `.env` | Alta | `RNF-03` | 6 | A fazer | 
| M-12 | — | Débito técnico / Desempenho | Implementação de paginação na listagem/busca de anúncios | Média | `RNF-02` | 6 | A fazer | 
| M-13 | — | Débito técnico / Segurança | Validação de Magic Bytes e sanitização rigorosa nos uploads de imagens | Média | `RNF-03` | 6 | A fazer | 
| M-14 | — | Débito técnico / Confiabilidade | Configuração de monitoramento de saúde da aplicação e meta de uptime | Baixa | `RNF-04` | 6 | A fazer | 

## 5. Definition of Ready

Um item está pronto para entrar em uma sprint quando:

* \[ \] possui descrição compreensível;

* \[ \] tem valor ou objetivo identificável;

* \[ \] possui critério de aceitação/conclusão;

* \[ \] dependências principais foram registradas;

* \[ \] foi estimado de acordo com a convenção do grupo.

## 6. Definition of Done

Um item está concluído quando:

* \[ \] atende aos critérios de aceitação;

* \[ \] foi revisado por outro integrante;

* \[ \] está integrado à branch `main`;

* \[ \] possui testes/evidências quando aplicável;

* \[ \] atualizou a documentação afetada;

* \[ \] está relacionado ao arquivo da sprint.

## 7. Histórico de refinamento

| Sprint | Itens criados/divididos/removidos | Motivo | Evidência | 
| ----- | ----- | ----- | ----- | 
| Sprint 1 | Criação dos 12 itens iniciais do Product Backlog | Definição do escopo inicial do Radar UFLA | `#1`–`#12` | 
| Sprint 2 | Inclusão dos itens `#14` e `#15` e mapeamento dos RFs/RNFs | Mapeamento detalhado dos requisitos funcionais e gestão de artefatos da Sprint 2 | `#14`, `#15` | 
| Sprint 4 | Inclusão dos débitos técnicos `DT-01` a `DT-05` e tarefas `#24` a `#27` | Refatoração da camada de serviços, isolamento de regras LGPD, elaboração de ADRs e correção de débitos de segurança | `#24`–`#27`, `#28` | 
| Sprint 5 | Inclusão do débito técnico `DT-06` (Issue `#29`) e tarefas `T-09` a `T-11` | Implementação do padrão *Chain of Responsibility*, publicação da ADR-04, atualização dos diagramas UML e emissão de evidências de validação (antes/depois) | `#29`, `PR #37`, `PR #38` | 
| Sprint 6 | Inclusão das tarefas `T-12` a `T-15`, resolução do `T-04` (ADR-08) e cadastro dos débitos de arquitetura `M-08` a `M-14` | Reestruturação da arquitetura global (ADR-05 a ADR-08), substituição do Cloudinary por Multer e volume Docker `/uploads`, e mapeamento dos débitos de segurança/infraestrutura da Sprint 6 | `PR #41`, `PR #42`, `PR #43`, `PR #45` | 
