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

- **[AGENTS.md](../AGENTS.md)** na raiz é o ponto de entrada: padrão aberto lido automaticamente por Codex, Cursor, GitHub Copilot, Gemini CLI e outros. Ele aponta para cá.
- **Claude Code** lê o [CLAUDE.md](../CLAUDE.md), que só contém `@AGENTS.md` (importa o mesmo conteúdo). Edite sempre o `AGENTS.md`, nunca o `CLAUDE.md`.
- **Qualquer outra IA:** peça para ela ler `AGENTS.md` ou cole `context.md` e `boundaries.md` na conversa.

## Como manter

- Tomou uma decisão de arquitetura? Crie um ADR novo (não edite o antigo; marque-o como substituído).
- Corrigiu um bug que poderia voltar? Registre em `incident-log/` e, se virar regra, leve para `boundaries.md`.
- Mudou a stack ou a estrutura de pastas? Atualize `context.md` no mesmo PR.
