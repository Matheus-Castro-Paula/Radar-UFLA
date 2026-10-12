# Evidências Sprint 4 — Antes e depois da camada de serviços

Issues [#24](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/24) e [#25](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/25) — Devs back-end (`@Matheus-Castro-Paula`, `@artxisto`)

> Observação: não existia `anuncioController.js` antes da Sprint 4 (o back-end só tinha as rotas de autenticação). Por isso o "antes" usa o `authController.js`, que mostra o padrão anterior do projeto: regra de negócio, criptografia e acesso ao banco dentro do controller.

## Antes — commit `7ebf6ea`

`API/Back-End/src/controllers/authController.js` (função `registrar`)

```js
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

async registrar(req, res) {
  try {
    const { nome, email, senha, telefone, tipo_usuario } = req.body;

    if (!nome || !email || !senha) {                                  // validação
      return res.status(400).json({ error: "Nome, e-mail e senha são obrigatórios." });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } }); // banco
    if (usuarioExistente) {
      return res.status(400).json({ error: "E-mail já cadastrado." });
    }

    const senha_hash = await bcrypt.hash(senha, 10);                  // regra de segurança

    const novoUsuario = await Usuario.create({ ... });                // persistência
    return res.status(201).json({ ... });                             // resposta HTTP
  } catch (error) { ... }
}
```

Problema: uma única função lê a requisição, valida, acessa o banco, aplica a regra de segurança e monta a resposta HTTP.

## Depois — commits `0bffa9f` e `593156b`

### Controller: só HTTP

`API/Back-End/src/controllers/anuncioController.js`

```js
const AnuncioService = require("../services/AnuncioService");
const RegraNegocioError = require("../services/RegraNegocioError");

// Tradução dos erros de negócio do service para status HTTP
const STATUS_POR_CODIGO = {
  [VALIDACAO]: 400,
  [LGPD]: 400,
  [PROIBIDO]: 403,
  [NAO_ENCONTRADO]: 404,
};

async criar(req, res) {
  try {
    const anuncio = await AnuncioService.criar(req.body, req.usuarioId);
    return res.status(201).json({ message: "Anúncio criado com sucesso!", anuncio });
  } catch (error) {
    return responderErro(res, error, "Erro ao criar anúncio.");
  }
}
```

O controller não importa nenhum model, nem `bcrypt` ou `jwt`. Ele só lê `req`, chama o service e converte o resultado em status HTTP.

### Service: regras de negócio, com a RN-04 isolada

`API/Back-End/src/services/AnuncioService.js`

```js
async criar(dados, usuarioId) {
  const fotos = dados.fotos || [];

  // Ordem do diagrama 2.3: obrigatórios → RN-04 → regras de foto → persistência
  validarCamposObrigatorios(dados);
  validarTipoEStatus(dados);
  const categoria = normalizarCategoria(dados.categoria);
  validarCategoria(categoria);
  validarRegraLGPD(categoria, fotos);
  validarFotos(fotos);
  // ... grava Anuncio + FotoAnuncio em uma transação
}

// RN-04 (LGPD): anúncio da categoria "documento" não pode ter foto.
// Recebe o estado FINAL do anúncio, então vale para criação e edição.
function validarRegraLGPD(categoria, fotos) {
  const ehDocumento =
    String(categoria).trim().toLowerCase() === CATEGORIA_DOCUMENTO;
  const temFotos = Array.isArray(fotos) && fotos.length > 0;

  if (ehDocumento && temFotos) {
    throw new RegraNegocioError(
      LGPD,
      "Não é permitido enviar foto de documento pessoal (RN-04 / LGPD). Publique apenas a descrição.",
    );
  }
}
```

O service não conhece `req` nem `res`. Ele lança `RegraNegocioError` com um código de negócio, e o controller decide o status HTTP.

## Comparação

| Critério                            | Antes (`authController`)                    | Depois (`anuncioController` + `AnuncioService`) |
| ----------------------------------- | ------------------------------------------- | ----------------------------------------------- |
| Responsabilidades no controller     | HTTP + validação + banco + bcrypt + JWT     | Só HTTP (ler `req`, chamar o service, responder) |
| Onde fica a regra `RN-04` (LGPD)    | Só no front-end (`publicar.html`/`app.js`)  | `AnuncioService.js` (`validarRegraLGPD`)         |
| Dependências diretas do controller  | `bcryptjs`, `jsonwebtoken`, model `Usuario` | Apenas `AnuncioService` e `RegraNegocioError`    |
| Regra testável sem subir o Express? | Não                                         | Sim                                             |

## Execução

Testes com a API rodando sobre o MySQL: [`sprint-04-api-anuncios.txt`](sprint-04-api-anuncios.txt)

| # | Cenário | Resultado |
| - | ------- | --------- |
| 1 | Criar anúncio sem token | 401 |
| 2 | Documento **com** foto (RN-04) | 400 |
| 3 | Burla: categoria `"Documentos"` com foto | 400 (categoria inválida) |
| 4 | Burla: categoria `" DOCUMENTO "` com foto | 400 (RN-04) |
| 5 | Documento **sem** foto | 201 |
| 6 | Eletrônico com foto | 201 |
| 7 | Edição: anúncio com foto passa a ser documento | 400 (RN-04) |
| 8 | Edição para categoria inexistente | 400 |
| 9 | Campo obrigatório faltando | 400 |
| 10 | Vitrine pública | 200, autor só com `id` e `nome` (sem e-mail/telefone) |
