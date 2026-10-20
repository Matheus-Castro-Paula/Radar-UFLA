# Padrão — Camadas do back-end

Referência viva: `API/Back-End/src/services/AnuncioService.js` e `src/controllers/anuncioController.js`. Na dúvida, copie o jeito deles.

## Controller: só HTTP

```js
async criar(req, res) {
  try {
    const anuncio = await AnuncioService.criar(req.body, req.usuarioId);
    return res.status(201).json({ message: "Anúncio criado com sucesso!", anuncio });
  } catch (error) {
    return responderErro(res, error, "Erro ao criar anúncio.");
  }
},
```

- Lê `req.params`, `req.query`, `req.body`, `req.usuarioId`.
- Chama **um** método do service.
- Escolhe o status de sucesso (`200`, `201`, `204`) e traduz `RegraNegocioError` via `STATUS_POR_CODIGO`.
- Não importa models, bcrypt, jwt nem faz `if` de regra de negócio.

## Service: regra de negócio

- Recebe dados simples (objetos, ids) — nunca `req`/`res`.
- Valida na ordem: obrigatórios → tipo/status → normalização → regras (RN-xx) → formato de fotos → persistência.
- Viola regra? `throw new RegraNegocioError(CODIGO, "mensagem para o usuário")`.
- Escrita em mais de uma tabela → `sequelize.transaction(...)`.
- Leitura pública → sempre com `INCLUDE_PUBLICO` (attributes explícitos).
- Comente a regra com o ID: `// RN-04 (LGPD): ...`.

## RegraNegocioError

| Código            | Quando usar                               | HTTP |
| ----------------- | ----------------------------------------- | ---- |
| `VALIDACAO`       | Campo ausente, formato ou valor inválido  | 400  |
| `LGPD`            | Violação de privacidade (RN-04)           | 400  |
| `PROIBIDO`        | Usuário sem permissão (RN-02)             | 403  |
| `NAO_ENCONTRADO`  | Recurso inexistente                       | 404  |

Precisa de um código novo? Adicione em `RegraNegocioError.CODIGOS` **e** em `STATUS_POR_CODIGO`.

## Rotas

- Leitura pública sem middleware; escrita com `autenticarToken`.
- Prefixo `/api/<recurso>` registrado em `server.js`.

## Banco

- Mudança de schema = migration nova em `src/migrations/` + ajuste no model.
- Tabelas e colunas em `snake_case` (`usuario_id`, `criado_em`); models com `underscored: true`.
