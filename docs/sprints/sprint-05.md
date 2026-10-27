# Sprint 5 — Padrões de projeto aplicados ao código

- **Data de entrega:** 26/10/2026
- **Pontuação:** 2,5 pontos
- **Tag obrigatória:** `sprint-05`
- **Responsável por conferir este arquivo:** Luis Gustavo Borges Vilela Marques (@Luis-Marques06)

## 1. Pergunta que esta sprint deve responder

**Qual problema concreto e recorrente justifica a aplicação de um padrão?**

O acoplamento e a baixa extensibilidade da lógica de validação de anúncios dentro de `AnuncioService.js`. Na Sprint 4, a validação concentrava múltiplas regras de negócio (verificação de campos obrigatórios, regras de status/categoria, limite de fotos e proteção LGPD de documentos `RN-04`) em um único bloco condicional sequencial. Qualquer adição ou modificação de regra exigia alterar diretamente o serviço principal, aumentando a complexidade ciclomática e o risco de regressões em regras existentes.

## 2. Objetivo e resultado da sprint

**Objetivo planejado:** Refatorar a camada de validação de anúncios do Back-End aplicando o padrão de projeto comportamental *Chain of Responsibility*, isolando cada regra em handlers desacoplados e encadeados via `AnuncioValidationChain.js`. Atualizar o guia de padrões (`docs/padroes/padroes-de-projeto.md`), registrar a decisão na **ADR-04** (`.harness/adr/README.md`), atualizar os diagramas de classe UML (seção 3.3 de `docs/modelagem/modelagem.md`) e validar a inexistência de regressões por meio de testes antes e depois da refatoração.

**Resultado efetivamente alcançado:** A refatoração foi implementada com sucesso com a criação da classe base `ValidationHandler`, handlers concretos (`CamposObrigatoriosHandler`, `CategoriaEStatusHandler`, `FotosHandler`, `RegraLGPDHandler`) e a corrente `AnuncioValidationChain`. O `AnuncioService.js` foi simplificado para delegar a validação a essa corrente. Todos os artefatos de documentação e ADR-04 foram integrados à `main` (PR #37 - Commit `9fdc5b3` e PR #38 - Commit `e2eaea6`). Os relatórios de testes comprovaram 100% de aprovação nos 12 cenários de validação sem regressão.

## 3. Checklist do artefato central — 0,75 ponto

**Entrega esperada:** `docs/padroes/padroes-de-projeto.md`, padrão selecionado, contexto, participantes, alternativas e evidência no código.

- [x] Problema descrito antes do padrão.
- [x] Participantes do padrão mapeados para arquivos reais.
- [x] Alternativas e justificativa registradas.
- [x] Benefícios e trade-offs explicados no contexto do projeto.
- [x] Testes ou demonstração preservam o comportamento esperado.

### Links dos artefatos

| Artefato criado/atualizado | Link na tag da sprint | O que mudou |
| :--- | :--- | :--- |
| `docs/padroes/padroes-de-projeto.md` | [padroes-de-projeto.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-05/docs/padroes/padroes-de-projeto.md) | Documentação detalhada do padrão *Chain of Responsibility* (problema, estrutura, participantes e trade-offs). |
| `.harness/adr/README.md` | [ADR-04](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-05/.harness/adr/README.md) | Registro da Decisão Arquitetural 04 (Chain of Responsibility nas validações de anúncios). |
| `docs/modelagem/modelagem.md` | [modelagem.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-05/docs/modelagem/modelagem.md) | Atualização da Seção 3.3 do Diagrama de Classes UML incluindo a hierarquia de `ValidationHandler`. |
| `API/Back-End/src/services/validations/` | [validations/](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-05/API/Back-End/src/services/validations) | Criação de `ValidationHandler.js`, `AnuncioValidationChain.js` e dos 4 handlers concretos de validação. |
| `docs/sprints/sprint-05.md` | [sprint-05.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-05/docs/sprints/sprint-05.md) | Relatório final de acompanhamento e gestão da Sprint 5. |

## 4. Incremento da aplicação web — 0,75 ponto

**Incremento mínimo esperado:** Implementação ou refatoração de ao menos um padrão pertinente, vinculada a Issue/PR e demonstrável.

### O que foi implementado ou evoluído

Refatoração do mecanismo de validação de criação e edição de anúncios no módulo Back-End. A validação engessada dentro do `AnuncioService` foi substituída pelo encadeamento dinâmico de objetos. Quando um anúncio é enviado para publicação ou alteração, o `AnuncioValidationChain` executa sequencialmente cada handler:
1. `CamposObrigatoriosHandler`: Valida presença de título, descrição, categoria, tipo e status.
2. `CategoriaEStatusHandler`: Garante que as categorias e status pertençam aos valores permitidos no domínio.
3. `FotosHandler`: Garante o limite máximo de 3 fotos por anúncio.
4. `RegraLGPDHandler`: Aplica a regra `RN-04`, bloqueando o upload de imagens na categoria "documento".

Se qualquer handler identificar uma violação, ele interrompe a corrente e lança a exceção `RegraNegocioError` sem que os handlers seguintes sejam processados.

### Como executar e verificar

1. **Subir os contêineres e banco de dados:**
   - `cd API/Back-End`
   - `docker compose up -d --build`
   - `docker compose exec backend npx sequelize-cli db:migrate`

2. **Executar a suíte de validação de anúncios e gerar relatório:**
   - `docker compose exec backend npm test`

| Requisito/Issue | Código ou protótipo | Evidência de execução |
| :--- | :--- | :--- |
| `RN-04` / `RF-07` / `#29` | [AnuncioValidationChain.js](../../API/Back-End/src/services/validations/AnuncioValidationChain.js) | [sprint-05-validacoes-depois.txt](evidencias/sprint-05-validacoes-depois.txt) |
| `RN-04` / `#29` | [RegraLGPDHandler.js](../../API/Back-End/src/services/validations/RegraLGPDHandler.js) | [sprint-05-validacoes-depois.txt](evidencias/sprint-05-validacoes-depois.txt) |
| `RNF-06` / `#23` | [padroes-de-projeto.md](../padroes/padroes-de-projeto.md) | [PR #37](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/37) |

## 5. Scrum e gestão do trabalho — 0,50 ponto

### Sprint Backlog

| Issue | Descrição | Responsável | Critério de aceitação/conclusão | Situação |
| :--- | :--- | :--- | :--- | :--- |
| `#29` | Refatoração de validações utilizando o padrão Chain of Responsibility (`DT-06`) | @Matheus-Castro-Paula | Handlers isolados em `src/services/validations/` e `AnuncioService` refatorado | Concluída |
| `#23` | Documentação da ADR-04 e atualização do guia de padrões de projeto (`T-09`) | @BernarDEVthomaz | Documentos `padroes-de-projeto.md` e ADR-04 gravados e alinhados | Concluída |
| `#24` | Atualização dos Diagramas de Classes UML (Seção 3.3) | @BernarDEVthomaz | Diagrama de classes atualizado refletindo a estrutura da corrente de validação | Concluída |
| `#25` | Execução dos testes e emissão de evidências antes/depois (`T-10`) | @BernarDEVthomaz | Ficheiros `sprint-05-validacoes-antes.txt` e `sprint-05-validacoes-depois.txt` gerados | Concluída |
| `#26` | Consolidação do backlog e elaboração do relatório final da Sprint 5 (`T-11`) | @Luis-Marques06 | Backlog atualizado no repositório e relatório `sprint-05.md` preenchido | Concluída |

### Acompanhamento

- **GitHub Project:** [Projects - Radar UFLA](https://github.com/users/Matheus-Castro-Paula/projects/2)
- **Reuniões/decisões:** Reuniões de alinhamento técnico via Discord para validar a escolha do padrão *Chain of Responsibility*, revisar os PRs #37 e #38 e garantir zero alteração nas assinaturas de erros tratadas pelo controller HTTP.
- **Impedimentos:** Nenhum.
- **Mudanças de escopo:** Nenhuma.

## 6. GitHub, documentação e rastreabilidade — 0,50 ponto

| Tipo de evidência | Link | O que comprova |
| :--- | :--- | :--- |
| Issue | [#29](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/29) | Registro da refatoração de validações com Chain of Responsibility. |
| Pull Request | [PR #37](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/37), [PR #38](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/38) | PR #37 (Docs/ADR-04/UML) e PR #38 (Implementação técnica do padrão). |
| Commit | [9fdc5b3](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/9fdc5b3), [e2eaea6](https://github.com/Matheus-Castro-Paula/Radar-UFLA/commit/e2eaea6) | Commits de merge dos PRs #37 e #38 na branch `main`. |
| Código/arquivo | [AnuncioValidationChain.js](../../API/Back-End/src/services/validations/AnuncioValidationChain.js), [ValidationHandler.js](../../API/Back-End/src/services/validations/ValidationHandler.js) | Implementação da classe base e montagem da corrente de validação. |
| Teste/captura/relatório | [sprint-05-validacoes-depois.txt](evidencias/sprint-05-validacoes-depois.txt), [padroes-de-projeto.md](../padroes/padroes-de-projeto.md) | Relatório comprobatório dos 12 cenários de teste validados e documento de padrões. |

### Rastreabilidade resumida

| Requisito | Issue | Artefato/modelo/decisão | Código | Teste/evidência |
| :--- | :--- | :--- | :--- | :--- |
| `RN-04` / `RF-07` | `#29` | [padroes-de-projeto.md](../padroes/padroes-de-projeto.md) (ADR-04) | [RegraLGPDHandler.js](../../API/Back-End/src/services/validations/RegraLGPDHandler.js) | [sprint-05-validacoes-depois.txt](evidencias/sprint-05-validacoes-depois.txt) |
| `RNF-06` | `#23` | [.harness/adr/README.md](../../.harness/adr/README.md) | [PR #37](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/37) | [PR #37](https://github.com/Matheus-Castro-Paula/Radar-UFLA/pull/37) |
| `RNF-06` | `#26` | [backlog-produto.md](../backlog-produto.md) | [sprint-05.md](sprint-05.md) | [sprint-05.md](sprint-05.md) |

## 7. Revisão do incremento

- **O que foi demonstrado:** Refatoração modular da validação de anúncios; criação dos handlers isolados estendendo `ValidationHandler`; centralização da corrente em `AnuncioValidationChain`; atualização da ADR-04 e diagramas UML (seção 3.3); emissão de relatórios provando equivalência funcional total antes e depois da refatoração.
- **Critérios atendidos:** Checklist do artefato central inteiramente preenchido; separação clara de responsabilidades entre os handlers; preservação integral dos comportamentos e regras de negócio (`RN-04`, `RF-07`).
- **Itens não concluídos:** Nenhum. Todo o escopo planejado para a Sprint 5 foi concluído.
- **Motivo das pendências:** Não se aplica.
- **Feedback recebido e ajustes:** Garantir que o tratamento e o formato de erro retornado pela API (`RegraNegocioError`) permanecessem idênticos ao comportamento da Sprint 4 para evitar quebras de contrato no Front-End (atendido).

## 8. Retrospectiva e próxima sprint

- **Funcionou bem:** A modularização trazida pelo *Chain of Responsibility*, permitindo que novas regras de validação sejam adicionadas no futuro criando apenas um novo handler sem alterar o código do serviço principal.
- **Precisa melhorar:** Orientar a equipe a executar o desenvolvimento fora de pastas de sincronização em nuvem (como OneDrive) para evitar travamentos de ponteiros do Git durante operações de merge.
- **Ação concreta para a próxima sprint:** Retomar as tarefas de funcionalidade com a implementação da integração de upload de imagens via Multer/Cloudinary (`RF-08` / Issue #10) e a resolução dos débitos técnicos de variáveis de ambiente (`DT-04` e `DT-05`).

## 9. O que não será considerado suficiente

- Copiar definição teórica de padrão.
- Forçar padrão sem necessidade.
- Apresentar diagrama sem código correspondente.

## 10. Links enviados no UFLA Virtual

- **Tag sprint-05:** [sprint-05](https://github.com/Matheus-Castro-Paula/Radar-UFLA/tree/sprint-05)
- **Este arquivo na tag:** [sprint-05.md](https://github.com/Matheus-Castro-Paula/Radar-UFLA/blob/sprint-05/docs/sprints/sprint-05.md)