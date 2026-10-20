# Contexto do projeto — Radar UFLA

## O que é

Aplicação web de **achados e perdidos do campus da UFLA**. Feed com duas abas: **Achados** (quem encontrou publica foto e descrição) e **Perdidos** (quem perdeu publica o item). Trabalho da disciplina de Engenharia de Software 2026/2, entregue em sprints com tags (`sprint-01` … `versao-final`).

Requisitos completos: [docs/requisitos/requisitos.md](../docs/requisitos/requisitos.md). Modelagem: [docs/modelagem/modelagem.md](../docs/modelagem/modelagem.md).

## Stack

| Parte     | Tecnologia                                                         | Pasta                |
| --------- | ------------------------------------------------------------------ | -------------------- |
| Back-end  | Node.js, Express 5, Sequelize 6, MySQL, JWT (`jsonwebtoken`), bcryptjs | `API/Back-End/`      |
| Front-end | HTML, CSS e JavaScript puro (sem framework)                        | `API/Front-End/`     |
| Infra     | Docker + docker-compose, migrations/seeders via `sequelize-cli`    | `API/Back-End/`      |

## Arquitetura (decisões em [docs/projeto/decisoes-de-projeto.md](../docs/projeto/decisoes-de-projeto.md))

Cliente-servidor, back-end em **monólito em camadas**:

```
routes → middlewares → controllers → services → models (Sequelize) → MySQL
```

- **routes/**: liga URL + verbo ao controller. Rotas públicas (vitrine) e protegidas (`authMiddleware`).
- **middlewares/**: autenticação JWT (`req.usuarioId`, `req.usuarioTipo`).
- **controllers/**: só HTTP — lê `req`, chama o service, traduz o resultado em status.
- **services/**: regras de negócio. Lançam `RegraNegocioError` com código semântico (`VALIDACAO`, `LGPD`, `PROIBIDO`, `NAO_ENCONTRADO`).
- **models/**: tabelas e associações. `usuarios`, `anuncios`, `fotos_anuncio`, `comentarios`.

Rotas da API: `/api/auth/*` e `/api/anuncios` (GET público; POST/PUT/DELETE com JWT).

## Domínio — termos

- **Anúncio**: um post. `tipo` = `ACHADO` | `PERDIDO`. `status` = `ATIVO` | `RESOLVIDO` | `ARQUIVADO`.
- **Categoria**: lista fechada — `objeto`, `eletronico`, `documento`, `material`, `outro` (mesmos valores do `<select>` em `publicar.html`).
- **Vitrine**: listagem pública. Não exige login e nunca expõe dados pessoais do autor.
- **RN-xx / RF-xx / RNF-xx**: IDs de regras de negócio e requisitos. Cite o ID em comentários e commits quando implementar um.

## Regras de negócio mais sensíveis

- **RN-02**: só o autor (ou o Administrador Geral) edita/resolve o anúncio.
- **RN-04 (LGPD)**: vitrine nunca mostra e-mail, telefone ou CPF do autor; anúncio de categoria `documento` não aceita foto.
- **RF-08**: até 3 fotos por anúncio, JPG/PNG/WEBP.

## Estado atual e dívidas conhecidas

Lista oficial de melhorias: seção 4 de [decisoes-de-projeto.md](../docs/projeto/decisoes-de-projeto.md) (M-01 a M-04) e seção 6 de [modelagem.md](../docs/modelagem/modelagem.md).

- `AnuncioService` segue o padrão de camadas. `authController` **ainda não** — validação, bcrypt e banco estão no controller (M-01, candidato a `AuthService`).
- Usuário tem `tipo_usuario` (`comum` | `admin`) e `telefone`. O cadastro sempre cria `comum`; admin só via seeder/banco.
- RN-02: a verificação de autoria ainda **não** libera o Administrador Geral (agora possível com `req.usuarioTipo === "admin"`).
- `JWT_SECRET` tem valor padrão fixo no código (`authController`, `authMiddleware`) — deve vir só do `.env` (M-02).
- Erros 500 devolvem `details: error.message` ao cliente — vazar detalhe interno é indesejado.
- Front-end: login e registro já consomem a API; o feed ainda usa dados fixos (`ITEMS` em `app.js`) e `publicar.html` ainda não envia para `/api/anuncios`.
- Sprint 5: validações de anúncio serão migradas para **Chain of Responsibility** em `services/validations/` (`ValidationHandler` + handlers concretos).
- Não há testes automatizados ainda (previstos para a Sprint 7).

## Convenções rápidas

- Código, nomes, mensagens e commits **em português**.
- Commits: `tipo(escopo): mensagem` — ex.: `fix(anuncios): valida categoria e responde 400 na regra RN-04`.
- Detalhes em [patterns/](patterns/).
