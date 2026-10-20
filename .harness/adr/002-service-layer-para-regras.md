# ADR-002 — Regras de negócio em services com erro semântico

- **Status:** Aceito
- **Data:** 2026-10 (Sprint 4 — commits `0bffa9f`, `593156b`; Issues #24 e #25)
- **Requisitos relacionados:** RN-02, RN-04, RF-08

## Contexto

No padrão inicial (`authController`, commit `7ebf6ea`), uma única função lia a requisição, validava, acessava o banco, aplicava regra de segurança e montava a resposta HTTP. Para anúncios, a RN-04 (LGPD) precisa valer igual na criação e na edição — duplicá-la em dois handlers HTTP seria fonte de bug.

## Decisão

- Toda regra de negócio fica em `src/services/` (ex.: `AnuncioService`), sem conhecer `req`/`res`.
- Violações são lançadas como `RegraNegocioError(codigo, mensagem)`, com código **semântico** (`VALIDACAO`, `LGPD`, `PROIBIDO`, `NAO_ENCONTRADO`), não status HTTP.
- O controller traduz código → status (`STATUS_POR_CODIGO`).

## Alternativas consideradas

- **Validar no controller** — mistura camadas e duplica regras entre rotas.
- **Validar só no model (Sequelize validators)** — bom para formato de campo, ruim para regras que cruzam entidades (categoria × fotos, autor × anúncio).
- **Service retornando status HTTP** — acopla a regra ao protocolo; o mesmo service não poderia ser reutilizado (ex.: job de expiração RN-03).

## Consequências

- Regras testáveis sem subir servidor (testes unitários de service na Sprint 7).
- Novas regras: adicionar no service + (se preciso) um código novo em `RegraNegocioError.CODIGOS` + o mapeamento no controller.
- Dívida: `authController` ainda segue o padrão antigo — migrar para `AuthService`.
