# ADRs — Architecture Decision Records

Cada arquivo registra **uma** decisão: o contexto, o que foi decidido, as alternativas e as consequências. ADRs não são editados depois de aceitos — se a decisão mudar, crie um novo e marque o antigo como "Substituído por ADR-00X".

| ADR                                                | Decisão                                      | Status  |
| -------------------------------------------------- | -------------------------------------------- | ------- |
| [001](001-monolito-em-camadas.md)                  | Monólito em camadas, cliente-servidor        | Aceito  |
| [002](002-service-layer-para-regras.md)            | Regras de negócio em services com erro semântico | Aceito  |
| [003](003-jwt-para-autenticacao.md)                | Autenticação stateless com JWT + bcrypt      | Aceito  |

## Modelo

```markdown
# ADR-00X — Título curto

- **Status:** Proposto | Aceito | Substituído por ADR-00Y
- **Data:** AAAA-MM-DD
- **Requisitos relacionados:** RF-xx, RNF-xx

## Contexto
Qual problema ou força levou à decisão.

## Decisão
O que foi decidido, em uma ou duas frases.

## Alternativas consideradas
- Opção A — por que não.

## Consequências
O que fica melhor, o que fica pior, o que passa a ser obrigatório.
```
