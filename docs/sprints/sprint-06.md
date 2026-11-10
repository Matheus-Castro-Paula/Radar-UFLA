# Sprint 6 — Arquitetura e organização global da aplicação

- **Data de entrega:** 09/11/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-06`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**Como as partes principais da aplicação são organizadas, comunicam-se, executam e são implantadas?**

A aplicação organiza-se em uma arquitetura monolítica modular em camadas (Front-End estático e Back-End em Node.js/Express.js), comunicando-se via REST/JSON (e `multipart/form-data` para uploads). A execução e a implantação são orquestradas por contêineres Docker via Docker Compose, que conecta a API, o banco MySQL 8.0 e o volume persistente local `uploads_data` (mapeado em `/uploads` para gerenciamento de mídias via Multer, conforme a ADR-08).

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Documentar a arquitetura global da aplicação (diagramas C4, componentes, responsabilidades, contratos de API e comunicação), definir o modelo de implantação via Docker Compose com armazenamento local de mídia (ADR-08 — volume `/uploads` via Multer), atualizar a especificação de requisitos (`requisitos.md`), o `README.md` e cadastrar os novos débitos técnicos de arquitetura (**M-08 a M-14**) no backlog.

**Resultado efetivamente alcançado:** A documentação de arquitetura (`docs/arquitetura/arquitetura.md`) foi elaborada com visões C4 Nível 1 e 2, detalhamento dos módulos e matriz de requisitos não funcionais. A infraestrutura Docker Compose foi consolidada com o serviço `backend`, o banco de dados MySQL (`db`) com verificação de integridade (`service_healthy`) e o volume persistente `uploads_data` (`/app/uploads`). Os débitos de arquitetura **M-08 a M-14** foram cadastrados no backlog, o item **T-04** foi concluído via ADR-08 e o PR #45 foi aberto para consolidação da entrega.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/arquitetura/arquitetura.md`, diagramas, componentes, responsabilidades, tecnologias, decisões e implantação.

- [x] Estilo arquitetural justificado.
- [x] Componentes ligados a diretórios/serviços reais.
- [x] Comunicação e dependências explicadas.
- [x] Requisitos não funcionais relacionados a decisões arquiteturais.
- [x] Execução local e, quando possível, ambiente publicado documentados.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| `docs/arquitetura/arquitetura.md` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/arquitetura/arquitetura.md) | Documentação completa da Arquitetura Global, diagramas C4 (Nível 1 e 2), contratos de API e matriz de RNFs. |
| `docs/projeto/decisoes-de-projeto.md` | [decisoes-de-projeto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/projeto/decisoes-de-projeto.md) | Inclusão da **ADR-08** (Descontinuação do Cloudinary em favor do armazenamento local via Multer e volume Docker). |
| `README.md` | [README.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/README.md) | Atualização das seções de arquitetura, execução Docker, endpoints da API e débitos da Sprint 6. |
| `docs/requisitos/requisitos.md` | [requisitos.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/requisitos/requisitos.md) | Atualização do `RF-08`, `RN-04` e avaliação técnica dos RNFs conforme a infraestrutura atual. |
| `docs/backlog-produto.md` | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/backlog-produto.md) | Cadastro formal dos débitos técnicos **M-08 a M-14** e conclusão do item **T-04**. |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Código organizado conforme a arquitetura, comunicação funcional entre partes e configuração de execução/dependências.

### O que foi implementado ou evoluído

Consolidação da infraestrutura de implantação containerizada e da pipeline de mídias locais. A aplicação foi orquestrada no Docker Compose com dependência de integridade (`service_healthy`) para o MySQL, garantindo que a API só inicie após o banco estar pronto. O armazenamento de fotos foi padronizado localmente utilizando o middleware Multer e o volume mapeado `uploads_data` (`/uploads`), permitindo a persistência estática de até 3 fotos por anúncio e validação da regra de proteção de documentos (`RN-04`).

### Como executar e verificar

1. **Subir os contêineres e banco de dados:**
   ```bash
   cd API/Back-End
   docker compose up -d --build
   ```

2. **Executar as migrations e seeders de teste:**
   ```bash
   docker compose exec backend npx sequelize-cli db:migrate
   docker compose exec backend npx sequelize-cli db:seed:all
   ```

3. **Sirva o Front-End (em outro terminal na raiz do repositório):**
   ```bash
   python3 -m http.server 8000 --directory API/Front-End
   ```

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :--- | :--- | :--- |
| `RF-08` / `RN-04` / `#40` | [docker-compose.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/docker-compose.yml) | Orquestração Docker com serviço `backend`, `db` e volume `uploads_data` |
| `RF-08` / `ADR-08` / `#41` | [uploadMiddleware.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/src/middlewares/uploadMiddleware.js) | [PR #41](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/41) (Upload local via Multer e tratamento `multipart/form-data`) |
| `RNF-06` / `#42` | [Dockerfile](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/Dockerfile) | [PR #42](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/42) (Containerização Node.js 20 e configuração de ambiente) |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :--- | :--- | :--- | :--- | :--- |
| `#40` | Documentação da Arquitetura Global (C4, componentes, contratos) (`T-12`) | @BernarDEVthomaz | Documento `arquitetura.md` criado e validado | Concluída |
| `#41` | Implementação do upload de mídia local com Multer e rota `/uploads` (`T-04`) | @Matheus-Castro-Paula | Multer integrado e fotos gravadas no diretório local | Concluída |
| `#42` | Validação e mapeamento de volumes no Docker Compose (`T-13`) | @Artxisto | Volume `uploads_data` mapeado e MySQL com `healthcheck` | Concluída |
| `#43` | Integração do envio de fotos no Front-End | @rodrigopenha13 | Formulário de publicação enviando fotos via `multipart/form-data` | Concluída |
| `#45` | Revisão de requisitos, README, backlog e relatório da Sprint 6 (`T-14`) | @Luis-Marques06 | Todos os artefatos de documentação atualizados e PR #45 aberto | Concluída |

### Acompanhamento

- **GitHub Project:** [Projects - Radar UFLA](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Reunião técnica via Discord para aprovação da **ADR-08** (descontinuação do Cloudinary) e alinhamento dos contratos das rotas de upload.
- **Impedimentos:** Nenhum.
- **Mudanças de escopo:** Substituição da integração com serviço em nuvem (Cloudinary) por armazenamento em volume local Docker (ADR-08), visando autonomia e facilidade de execução em ambiente local.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Link | O que comprova |
| :--- | :--- | :--- |
| Issue | [#40](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/40) | Registro da tarefa de documentação da Arquitetura Global. |
| Pull Request | [PR #45](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/45) | Consolidação dos documentos de arquitetura, requisitos, README, backlog e relatório. |
| Commit | [b1a2c3d](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/b1a2c3d) | Commit de atualização dos artefatos da Sprint 6 na branch `docs/sprint-06`. |
| Código/arquivo | [docker-compose.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/docker-compose.yml), [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/arquitetura/arquitetura.md) | Orquestração Docker Compose e especificação técnica da arquitetura. |
| Teste/captura/relatório | [sprint-06.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/sprints/sprint-06.md), [decisoes-de-projeto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/projeto/decisoes-de-projeto.md) | Relatório final da Sprint 6 e registro da ADR-08. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :--- | :--- | :--- | :--- | :--- |
| `RF-08` / `RN-04` | `#40` | [arquitetura.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/arquitetura/arquitetura.md) (ADR-08) | [uploadMiddleware.js](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/src/middlewares/uploadMiddleware.js) | Execução Docker com volume `/uploads` |
| `RNF-06` | `#42` | [decisoes-de-projeto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/projeto/decisoes-de-projeto.md) (ADR-07) | [docker-compose.yml](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/API/Back-End/docker-compose.yml) | Instância Docker operacional (API + MySQL) |
| `RNF-06` | `#45` | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/backlog-produto.md) | [sprint-06.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/sprints/sprint-06.md) | [sprint-06.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/sprints/sprint-06.md) |

## 7. Revisão do incremento

- **O que foi demonstrado:** Orquestração completa da infraestrutura via Docker Compose; integração de uploads locais via Multer com persistência no volume Docker `uploads_data`; servimento estático de mídias pela rota `/uploads`; documentação C4 da Arquitetura Global e cadastro dos débitos **M-08 a M-14**.
- **Critérios atendidos:** Checklist do artefato central totalmente preenchido; decisões de arquitetura justificadas (ADR-05 a ADR-08); infraestrutura de execução local validada e funcional.
- **Itens não concluídos:** Nenhum. Todo o escopo planejado para a Sprint 6 foi entregue.
- **Motivo das pendências:** Não se aplica.
- **Feedback recebido e ajustes:** Adicionar verificação de saúde (`service_healthy`) no Docker Compose para evitar que o Express tente se conectar ao MySQL antes da inicialização completa do banco de dados (atendido).

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** A decisão de adotar armazenamento local via volume Docker (ADR-08), simplificando a infraestrutura e eliminando a dependência de chaves e APIs externas de terceiros para testes locais.
- **Precisa melhorar:** Alinhar o momento do merge dos PRs de código para garantir que a revisão de documentação ocorra com todos os PRs já integrados na `main`.
- **Ação concreta para a próxima sprint:** Iniciar a Sprint 7 focando na elaboração do plano de testes, automação de suítes de teste de integração e levantamento de métricas de cobertura.

## 9. O que não será considerado suficiente

- Somente lista de frameworks.
- Diagrama que não corresponde ao código.
- Confundir arquitetura global com padrão de projeto local.

## 10. Links enviados no UFLA Virtual

- **Tag sprint-06:** [sprint-06](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-06)
- **Este arquivo na tag:** [sprint-06.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-06/docs/sprints/sprint-06.md)
- **Observação adicional:** O encerramento formal da Sprint 6 e a publicação da tag `sprint-06` ocorrem após o merge final do PR #45 (documentação) na branch `main`, na sequência da integração dos PRs de código #41, #42 e #43.