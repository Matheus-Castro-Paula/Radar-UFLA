# Product Backlog

## 1. Link do GitHub Project

[Project](https://github.com/users/Matheus-Castro-Paula/projects/2)

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
2. **Valor para o núcleo do produto**: funcionalidades que representam o objetivo central do Radar UFLA — publicação de itens achados/perdidos, cadastro/login e estrutura inicial do front-end — foram tratadas como prioridade **Alta**;
3. **Complexidade e complementaridade**: funcionalidades que agregam valor mas dependem do núcleo já estar funcionando (busca, categoria de documentos pessoais, upload de imagens e gestão de documentação) foram tratadas como prioridade **Média**.

## 4. Visão resumida do backlog

| ID    | Link da Issue                                                       | Tipo                            | Descrição curta                                         | Prioridade | Requisito         | Sprint | Estado final |
| ----- | ------------------------------------------------------------------- | ------------------------------- | ------------------------------------------------------- | ---------- | ----------------- | ------ | ------------ |
| T-01  | [#1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/1)   | Documentação                    | Estruturar repositório e documentação inicial           | Alta       | —                 | 1      | Concluído    |
| T-02  | [#2](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/2)   | Requisito / Tarefa técnica      | Modelar entidades iniciais do banco de dados            | Alta       | `RNF-06`          | 2      | Concluído    |
| T-03  | [#3](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/3)   | Tarefa técnica                  | Configurar banco de dados MySQL via Docker              | Alta       | `RNF-06`          | 2      | Concluído    |
| US-01 | [#4](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/4)   | Funcionalidade                  | Cadastro e login de usuário (autenticação JWT)          | Alta       | `RF-01`, `RF-02`  | 2      | Planejado    |
| US-02 | [#5](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/5)   | Funcionalidade                  | Estrutura inicial do front-end com layout do feed       | Alta       | `RF-04`, `RNF-01` | 1      | Concluído    |
| US-03 | [#6](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/6)   | Funcionalidade                  | Publicação de item na aba "Achados"                     | Alta       | `RF-07`           | 2      | Planejado    |
| US-04 | [#7](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/7)   | Funcionalidade                  | Publicação de item na aba "Perdidos"                    | Alta       | `RF-07`           | 2      | Planejado    |
| US-05 | [#8](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/8)   | Funcionalidade                  | Busca/pesquisa nos feeds                                | Média      | `RF-05`, `RF-06`  | 2      | Planejado    |
| US-06 | [#9](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/9)   | Requisito / Funcionalidade      | Categoria "Documentos pessoais" (sem foto do documento) | Média      | `RF-07`, `RN-04`  | 2      | Planejado    |
| T-04  | [#10](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/10) | Tarefa técnica                  | Configurar upload de imagens (Cloudinary + Multer)      | Média      | `RF-08`           | 2      | Planejado    |
| US-07 | [#11](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/11) | Funcionalidade / Tarefa técnica | Integrar tela/formulário de publicação ao back-end      | Alta       | `RF-03`, `RF-07`  | 2      | Planejado    |
| T-05  | [#12](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/12) | Documentação                    | Instruções de instalação e execução do projeto          | Média      | `RNF-06`          | 2      | Concluído    |
| T-06  | [#14](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/14) | Documentação / PO               | Atualizar documentação e artefatos da Sprint 2          | Média      | —                 | 2      | Em andamento |
| T-07  | [#15](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/15) | Documentação / Gestão           | Finalizar relatório da Sprint 2 e gerar Tag Git         | Média      | —                 | 2      | Em andamento |

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

| Sprint   | Itens criados/divididos/removidos                          | Motivo                                                                           | Evidência    |
| -------- | ---------------------------------------------------------- | -------------------------------------------------------------------------------- | ------------ |
| Sprint 1 | Criação dos 12 itens iniciais do Product Backlog           | Definição do escopo inicial do Radar UFLA                                        | `#1`–`#12`   |
| Sprint 2 | Inclusão dos itens `#14` e `#15` e mapeamento dos RFs/RNFs | Mapeamento detalhado dos requisitos funcionais e gestão de artefatos da Sprint 2 | `#14`, `#15` |
