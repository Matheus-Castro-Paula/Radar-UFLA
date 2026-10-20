# .harness/

Conhecimento do projeto escrito para quem vai mexer no código — pessoas novas no time e agentes de IA (Claude Code, Copilot, Cursor). A ideia: **a pista mora no repositório**. Regras, decisões e erros passados ficam versionados junto com o código, e não na cabeça de alguém ou em um chat perdido.

| Arquivo / pasta                                      | Para que serve                                   |
| ---------------------------------------------------- | ------------------------------------------------ |
| [context.md](context.md)                             | O projeto resumido — lido no início de toda sessão |
| [boundaries.md](boundaries.md)                       | O que **nunca** pode acontecer                   |
| [adr/](adr/)                                         | Decisões de arquitetura, com o porquê            |
| [patterns/](patterns/)                               | O jeito do time fazer                            |
| [ai-review-checklist.md](ai-review-checklist.md)     | A régua para revisar código (gerado por IA ou não) |
| [incident-log/](incident-log/)                       | Bugs que viraram aprendizado                     |

## Como é carregado

- **Claude Code:** o [CLAUDE.md](../CLAUDE.md) na raiz é lido automaticamente e aponta para cá.
- **Outras ferramentas:** apontar o arquivo de instruções delas (ex.: `.github/copilot-instructions.md`) para `context.md` e `boundaries.md`.

## Como manter

- Tomou uma decisão de arquitetura? Crie um ADR novo (não edite o antigo; marque-o como substituído).
- Corrigiu um bug que poderia voltar? Registre em `incident-log/` e, se virar regra, leve para `boundaries.md`.
- Mudou a stack ou a estrutura de pastas? Atualize `context.md` no mesmo PR.
