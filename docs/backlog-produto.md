# Product Backlog

## 1. Link do GitHub Project

`https://github.com/users/Matheus-Castro-Paula/projects/2`

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

1. **Dependência técnica**: itens que são pré-requisito para outros (ex: estruturação do repositório e modelagem de dados) foram tratados como prioridade **Alta**, por bloquearem o andamento das tarefas seguintes;
2. **Valor para o núcleo do produto**: funcionalidades que representam o objetivo central do Radar UFLA — publicação de itens achados/perdidos, cadastro/login e estrutura inicial do front-end — foram tratadas como prioridade **Alta**;
3. **Complexidade e complementaridade**: funcionalidades que agregam valor mas dependem do núcleo já estar funcionando (busca, categoria de documentos pessoais, upload de imagens) foram tratadas como prioridade **Média**.

## 4. Visão resumida do backlog

| ID    | Link da Issue | Tipo                            | Descrição curta                                         | Prioridade | Requisito            | Sprint | Estado final |
| ----- | ------------- | ------------------------------- | ------------------------------------------------------- | ---------- | -------------------- | ------ | ------------ |
| T-01  | `#1`          | Documentação                    | Estruturar repositório e documentação inicial           | Alta       | —                    | 1      | Concluído    |
| T-02  | `#2`          | Requisito / Tarefa técnica      | Modelar entidades iniciais do banco de dados            | Alta       | A definir (Sprint 2) | 1      | Planejado    |
| T-03  | `#3`          | Tarefa técnica                  | Configurar banco de dados MySQL via Docker              | Alta       | A definir (Sprint 2) | 1      | Planejado    |
| US-01 | `#4`          | Funcionalidade                  | Cadastro e login de usuário (autenticação JWT)          | Alta       | A definir (Sprint 2) | 1      | Planejado    |
| US-02 | `#5`          | Funcionalidade                  | Estrutura inicial do front-end com layout do feed       | Alta       | A definir (Sprint 2) | 1      | Planejado    |
| US-03 | `#6`          | Funcionalidade                  | Publicação de item na aba "Achados"                     | Alta       | A definir (Sprint 2) | 2      | Planejado    |
| US-04 | `#7`          | Funcionalidade                  | Publicação de item na aba "Perdidos"                    | Alta       | A definir (Sprint 2) | 2      | Planejado    |
| US-05 | `#8`          | Funcionalidade                  | Busca/pesquisa nos feeds                                | Média      | A definir (Sprint 2) | 2      | Planejado    |
| US-06 | `#9`          | Requisito / Funcionalidade      | Categoria "Documentos pessoais" (sem foto do documento) | Média      | A definir (Sprint 2) | 2      | Planejado    |
| T-04  | `#10`         | Tarefa técnica                  | Configurar upload de imagens (Cloudinary + Multer)      | Média      | A definir (Sprint 2) | 2      | Planejado    |
| US-07 | `#11`         | Funcionalidade / Tarefa técnica | Integrar tela/formulário de publicação ao back-end      | Alta       | A definir (Sprint 2) | 2      | Planejado    |
| T-05  | `#12`         | Documentação                    | Instruções de instalação e execução do projeto          | Média      | —                    | 1      | Planejado    |

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

| Sprint   | Itens criados/divididos/removidos                | Motivo                                    | Evidência  |
| -------- | ------------------------------------------------ | ----------------------------------------- | ---------- |
| Sprint 1 | Criação dos 12 itens iniciais do Product Backlog | Definição do escopo inicial do Radar UFLA | `#1`–`#12` |
