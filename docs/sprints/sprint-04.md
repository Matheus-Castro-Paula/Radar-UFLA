# Sprint 4 — Princípios de projeto e decisões locais

- **Data de entrega:** 13/10/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-04`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**Como responsabilidades, módulos e interfaces locais serão organizados e justificados?**

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Definir a arquitetura do Back-End decompondo-a em camadas bem delimitadas (`routes`, `middlewares`, `controllers`, `services` e `models`), refatorar o módulo de anúncios extraindo as regras de negócio para o `AnuncioService.js`, isolar a validação da regra de LGPD (`RN-04`), registrar as Decisões de Arquitetura (ADRs) com justificativas e trade-offs e incorporar a gestão de débitos técnicos (`DT-01` a `DT-05`) ao Product Backlog.

**Resultado efetivamente alcançado:** Foi criada a camada de serviços em `API/Back-End/src/services/` contendo `AnuncioService.js` e a classe de erro customizada `RegraNegocioError.js`. O `anuncioController.js` foi refatorado para lidar exclusivamente com o protocolo HTTP. A regra `RN-04` (proibição de fotos em anúncios da categoria "documento") foi isolada na camada de serviço. O Tech Lead (@BernarDEVthomaz) elaborou o documento `docs/projeto/decisoes-de-projeto.md` registrando 3 ADRs e a análise comparativa de coesão/acoplamento (PR #28). O PO (@Luis-Marques06) atualizou o `docs/backlog-produto.md` adicionando os débitos técnicos e o histórico de refinamento da Sprint 4 (Commit `2850ed1`).

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/projeto/decisoes-de-projeto.md`, decomposição e decisões relacionadas a coesão, acoplamento, responsabilidade e testabilidade.

- [x] Responsabilidades de módulos/componentes locais identificadas.
- [x] Alternativas consideradas e decisão justificada.
- [x] Trade-offs ou consequências registrados.
- [x] Código afetado linkado.
- [x] Backlog atualizado com débitos ou tarefas descobertas.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| `docs/projeto/decisoes-de-projeto.md` | [decisoes-de-projeto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-04/docs/projeto/decisoes-de-projeto.md) | Documento de arquitetura: decomposição em camadas (Mermaid), ADR-01, ADR-02, ADR-03, análise de coesão/acoplamento e lista de melhorias. |
| `docs/backlog-produto.md` | [backlog-produto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-04/docs/backlog-produto.md) | Inclusão dos débitos técnicos `DT-01` a `DT-05`, tarefa `T-08` (#27) e histórico de refinamento da Sprint 4. |
| `API/Back-End/src/services/` | [services/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-04/API/Back-End/src/services) | Criação da camada de serviços (`AnuncioService.js` e `RegraNegocioError.js`) isolando as regras de negócio. |
| `docs/sprints/sprint-04.md` | [sprint-04.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-04/docs/sprints/sprint-04.md) | Relatório final de acompanhamento e gestão da Sprint 4. |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Implementação/refatoração que demonstre a decisão, com comparação ou vínculo claro entre documento e código.

### O que foi implementado ou evoluído

Refatoração da arquitetura do módulo de anúncios do Back-End. As regras de negócio para publicar, editar, consultar e excluir anúncios (`RN-02`, `RN-04`, limite de 3 fotos, validação de categoria) foram transferidas do controller para o `AnuncioService.js`. A regra `RN-04` (LGPD) foi isolada no método `validarRegraLGPD`, que rejeita o envio de anexos de imagens em cadastros ou edições da categoria `documento` e lança a exceção `RegraNegocioError` (código `LGPD`). O `anuncioController.js` tornou-se enxuto e desacoplado do ORM, concentrando-se na tradução do protocolo HTTP.

### Como executar e verificar

1. **Subir os contêineres e executar migrations:**
   - `cd API/Back-End`
   - `docker compose up -d --build`
   - `docker compose exec backend npx sequelize-cli db:migrate`

2. **Testar a regra RN-04 (LGPD) via cURL (deve retornar HTTP 400 - LGPD):**
   - `curl -X POST http://localhost:3000/api/anuncios -H "Content-Type: application/json" -H "Authorization: Bearer TOKEN" -d '{"titulo":"Carteira Encontrada","descricao":"Carteira achada","categoria":"documento","tipo":"achado","status":"ativo","fotos":["https://exemplo.com/foto.jpg"]}'`

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :--- | :--- | :--- |
| `RN-04` / `#25` | [AnuncioService.js](../../API/Back-End/src/services/AnuncioService.js) | [sprint-04-api-anuncios.txt](../sprints/evidencias/sprint-04-api-anuncios.txt) |
| `RF-07` / `#24` | [anuncioController.js](../../API/Back-End/src/controllers/anuncioController.js) | [sprint-04-antes-depois.md](../sprints/evidencias/sprint-04-antes-depois.md) |
| `RNF-06` / `#26` | [decisoes-de-projeto.md](../projeto/decisoes-de-projeto.md) | [PR #28](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/28) |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :--- | :--- | :--- | :--- | :--- |
| `#24` | Extração da camada `AnuncioService` do `anuncioController` (`DT-01`) | @Matheus-Castro-Paula / @Artxisto | Regras de negócio movidas para `AnuncioService.js` e controller lidando só com HTTP | Concluída |
| `#25` | Isolar regra da LGPD (Documentos Pessoais) no `AnuncioService` (`DT-02`) | @Matheus-Castro-Paula / @Artxisto | `RN-04` validada no service rejeitando fotos em anúncios da categoria "documento" | Concluída |
| `#26` | Documento de decisões locais de projeto (ADRs, coesão/acoplamento) (`DT-03`) | @BernarDEVthomaz | Arquivo `decisoes-de-projeto.md` criado com diagramas, 3 ADRs e análise de coesão | Concluída |
| `#27` | Atualizar relatório da Sprint 4 e Backlog de Débitos Técnicos (`T-08`) | @Luis-Marques06 | Backlog atualizado com débitos técnicos e relatório `sprint-04.md` preenchido | Concluída |

### Acompanhamento

- **GitHub Project:** [Projects](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Reuniões via Discord para alinhar a arquitetura em camadas do Back-End, tratar o `RegraNegocioError` sem dependência do Express, revisar o PR #28 do Tech Lead e estruturar os débitos técnicos no Product Backlog.
- **Impedimentos:** Nenhum.
- **Mudanças de escopo:** Nenhuma.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Link | O que comprova |
| :--- | :--- | :--- |
| Issue | [#24](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/24), [#25](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/25), [#26](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/26), [#27](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/27) | Tarefas de refatoração, LGPD, documentação de arquitetura e PO. |
| Pull Request | [PR #28](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/28) | PR aprovado do Tech Lead incorporando a documentação de decisões na main. |
| Commit | [2850ed1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/2850ed1), [0bffa9f](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/0bffa9f) | Commits de atualização do Product Backlog (#27) e refatoração da camada de serviço (#24). |
| Código/arquivo | [AnuncioService.js](../../API/Back-End/src/services/AnuncioService.js), [anuncioController.js](../../API/Back-End/src/controllers/anuncioController.js) | Implementação das camadas de serviço e controller refatorado. |
| Teste/captura/relatório | [decisoes-de-projeto.md](../projeto/decisoes-de-projeto.md), [sprint-04.md](sprint-04.md) | Documentação de arquitetura e relatório de acompanhamento da sprint. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :--- | :--- | :--- | :--- | :--- |
| `RN-04` | `#25` | [decisoes-de-projeto.md](../projeto/decisoes-de-projeto.md) (ADR-03) | [AnuncioService.js](../../API/Back-End/src/services/AnuncioService.js) | [sprint-04-api-anuncios.txt](../sprints/evidencias/sprint-04-api-anuncios.txt) |
| `RF-07` | `#24` | [decisoes-de-projeto.md](../projeto/decisoes-de-projeto.md) (ADR-01) | [anuncioController.js](../../API/Back-End/src/controllers/anuncioController.js) | [sprint-04-antes-depois.md](../sprints/evidencias/sprint-04-antes-depois.md) |
| `RNF-06` | `#26` | [decisoes-de-projeto.md](../projeto/decisoes-de-projeto.md) | [PR #28](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/28) | [PR #28](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/28) |
| `RNF-06` | `#27` | [backlog-produto.md](../backlog-produto.md) | [commit 2850ed1](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/2850ed1) | [sprint-04.md](sprint-04.md) |

## 7. Revisão do incremento

- **O que foi demonstrado:** Refatoração da arquitetura do módulo de anúncios com criação da camada `src/services/`; desacoplamento do `anuncioController`; isolamento rígido da regra `RN-04` (LGPD); registro de 3 ADRs; atualização do Product Backlog com a inclusão e rastreabilidade dos débitos técnicos `DT-01` a `DT-05`.
- **Critérios atendidos:** Atendimento ao checklist do artefato central (`docs/projeto/decisoes-de-projeto.md`); divisão clara de responsabilidades; alta coesão e baixo acoplamento; rastreabilidade completa no GitHub.
- **Itens não concluídos:**
  - `DT-04`: Mover a chave `JWT_SECRET` para variáveis de ambiente (`.env`).
  - `DT-05`: Centralizar a chave de autenticação JWT duplicada entre controller e middleware.
  - Refatorar o `authController.js` extraindo um `AuthService` (Melhoria M-01 em `decisoes-de-projeto.md`).
- **Motivo das pendências:** O escopo da sprint priorizou a refatoração do módulo de anúncios e o registro formal da arquitetura. As melhorias na autenticação foram registradas como débitos técnicos no backlog.
- **Feedback recebido e ajustes:** Garantir alinhamento estrito entre o relatório de arquitetura do Tech Lead e o Product Backlog gerenciado pelo PO (atendido).

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** A sinergia entre o desenvolvimento e a gestão, permitindo refatorar a camada de negócios sem quebrar a API; a documentação clara das decisões técnicas via ADRs.
- **Precisa melhorar:** Priorizar a resolução dos débitos técnicos de segurança (`JWT_SECRET`) logo no início do desenvolvimento.
- **Ação concreta para a próxima sprint:** Resolver os débitos técnicos de segurança (`DT-04` e `DT-05`) e avançar na implementação do upload de imagens com Multer/Cloudinary (`RF-08` / Issue #10).

## 9. O que não será considerado suficiente

- Apenas listar princípios de projeto.
- Descrever arquitetura global em vez de decisões locais.
- Decisão sem alteração ou evidência no código.

## 10. Links enviados no UFLA Virtual

- **Tag sprint-04:** [Sprint 04](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-04)
- **Este arquivo na tag:** [sprint-04.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-04/docs/sprints/sprint-04.md)