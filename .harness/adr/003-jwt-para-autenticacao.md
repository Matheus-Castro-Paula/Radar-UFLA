# ADR-003 — Autenticação stateless com JWT + bcrypt

- **Status:** Aceito
- **Data:** 2026-09 (Sprint 3 — commit `7ebf6ea`)
- **Requisitos relacionados:** RNF-03, RN-02

## Contexto

A vitrine é pública, mas publicar, editar e excluir anúncios exige saber quem é o usuário (RN-02). O front-end é estático e separado da API.

## Decisão

- Senhas armazenadas com **bcrypt** (custo 10).
- Login devolve um **JWT** assinado com `JWT_SECRET`, contendo `id` e `tipo_usuario`.
- `authMiddleware` valida o header `Authorization: Bearer <token>` e preenche `req.usuarioId` e `req.usuarioTipo`.
- Rotas de leitura da vitrine ficam sem middleware; rotas de escrita usam o middleware.

## Alternativas consideradas

- **Sessão no servidor (cookie + store)** — exige estado compartilhado e configuração de CSRF; desnecessário para um front estático simples.
- **Login institucional (SSO UFLA)** — ideal no futuro, mas fora do alcance do semestre.

## Consequências

- API sem estado de sessão; fácil de escalar e testar.
- Token não pode ser revogado antes de expirar — manter expiração curta.
- `JWT_SECRET` é crítico: deve vir só do `.env` (hoje há valor padrão no código — dívida registrada em `context.md`).
