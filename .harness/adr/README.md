# ADRs — Architecture Decision Records

**Fonte oficial:** [docs/projeto/decisoes-de-projeto.md](../../docs/projeto/decisoes-de-projeto.md), seção 2. Os ADRs ficam **só lá** — esta pasta é apenas um índice, para não existirem duas numerações diferentes.

| ADR    | Decisão                                       | Em uma frase                                                                                          |
| ------ | --------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| ADR-01 | Camada de Serviços entre Controllers e Models | Regra de negócio fica em `services/` e lança `RegraNegocioError`; o controller só traduz para HTTP.   |
| ADR-02 | Autenticação stateless com JWT + bcrypt       | Senha com bcrypt; token JWT de 24h com `id`, `email` e `tipo_usuario`, validado pelo `authMiddleware`. |
| ADR-03 | Regra `RN-04` (LGPD) no back-end, no service  | Foto de documento é bloqueada na API, não só no front-end.                                            |

## Antes de mudar algo que contradiz um ADR

Leia o ADR completo no documento oficial. Se a decisão precisar mudar, registre um **novo** ADR lá (próximo número livre) explicando o motivo — não edite nem contradiga o antigo em silêncio.

## Decisões ainda não registradas

- **Monólito em camadas, cliente-servidor (RNF-06)** — a estrutura adotada desde a Sprint 2 (`routes → middlewares → controllers → services → models`, front estático consumindo uma API REST única). Alternativas descartadas: microsserviços (custo desproporcional ao tamanho do sistema e do time) e Clean/Hexagonal completa (indireção demais para o domínio). Candidata a ADR ou ao `docs/arquitetura/arquitetura.md` da Sprint 6.
