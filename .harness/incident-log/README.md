# Incident log — bugs que viraram aprendizado

Um arquivo por incidente: `AAAA-MM-<assunto-curto>.md`. O objetivo não é achar culpado (formato *blameless*), e sim impedir que o mesmo erro volte — inclusive pelas mãos de uma IA que não conhece o histórico.

| Data    | Incidente                                                                 | Regra que gerou            |
| ------- | ------------------------------------------------------------------------- | -------------------------- |
| 2026-10 | [Categoria livre contornava a RN-04](2026-10-categoria-contornava-rn04.md) | `boundaries.md` item 3     |

## Modelo

```markdown
# Título do incidente

- **Data:** AAAA-MM-DD
- **Commit da correção:** `abc1234`
- **Regras afetadas:** RN-xx

## O que aconteceu
## Por que aconteceu (causa raiz)
## Como foi corrigido
## O que aprendemos / regra nova
```
