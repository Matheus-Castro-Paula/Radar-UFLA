# Categoria livre contornava a RN-04 (LGPD)

- **Data:** 2026-10 (Sprint 4)
- **Commit da correção:** `593156b` — `fix(anuncios): valida categoria e responde 400 na regra RN-04`
- **Regras afetadas:** RN-04, RNF-03
- **Issue:** #25

## O que aconteceu

A RN-04 bloqueava fotos apenas quando a categoria era exatamente `"documento"`. Como a categoria era texto livre na API, valores como `"documentos"`, `"RG"` ou `" Documento "` passavam pela checagem e permitiam publicar foto de documento pessoal na vitrine pública.

## Por que aconteceu (causa raiz)

- A regra comparava com um valor fixo, mas o campo não era restrito a uma lista fechada.
- O front-end tem um `<select>` com os valores certos, e isso deu a falsa impressão de que a entrada já vinha controlada — mas a API pode ser chamada diretamente.

## Como foi corrigido

- Lista fechada `CATEGORIAS` no `AnuncioService` (mesmos valores do `<select>` de `publicar.html`).
- `normalizarCategoria` (`trim` + minúsculas) antes de validar e salvar.
- Categoria fora da lista → `RegraNegocioError(VALIDACAO)` → HTTP 400.

## O que aprendemos

- **Validação do front não é segurança.** Toda regra precisa valer na API.
- Regra que depende de um valor de campo exige que o campo seja de **domínio fechado** e **normalizado**.
- Virou o item 3 de [boundaries.md](../boundaries.md) e um item do [ai-review-checklist.md](../ai-review-checklist.md).
