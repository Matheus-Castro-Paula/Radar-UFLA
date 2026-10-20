# Checklist de review — a régua do time

Use em todo PR, principalmente quando o código foi gerado ou sugerido por IA. Um "não" bloqueia o merge até ser resolvido ou justificado no PR.

## Arquitetura

- [ ] A regra de negócio ficou no **service**, e não no controller ou na rota?
- [ ] O controller só lê `req`, chama o service e traduz o resultado para HTTP?
- [ ] Erros de regra são lançados como `RegraNegocioError` com o código certo?
- [ ] Mudança de schema veio por **migration nova** (sem editar migration antiga)?

## Privacidade e segurança (ver [boundaries.md](boundaries.md))

- [ ] Alguma resposta pública devolve e-mail, telefone, CPF ou `senha_hash`? (Confira os `attributes` de todo `include` de `Usuario`.)
- [ ] A RN-04 continua valendo na criação **e** na edição (categoria `documento` sem foto)?
- [ ] Entrada do usuário é normalizada antes de comparar com listas fechadas (`trim`, minúsculas)?
- [ ] Algum segredo, senha ou token ficou no código ou no commit?
- [ ] Erro inesperado devolve detalhe interno ao cliente?
- [ ] O autor vem de `req.usuarioId` (JWT), e não do corpo da requisição?
- [ ] Rotas de escrita estão protegidas por `autenticarToken`?

## Correção

- [ ] Escrita em mais de uma tabela está dentro de `sequelize.transaction`?
- [ ] Casos de borda: campo ausente, lista vazia, id inexistente, usuário que não é o autor?
- [ ] A IA não "inventou" coluna, rota, função ou pacote que não existe no projeto?
- [ ] Foi testado de verdade (Postman/Insomnia, teste automatizado ou front rodando)? Evidência no PR?

## Higiene

- [ ] Nomes e mensagens em português, seguindo o estilo do arquivo vizinho?
- [ ] Sem código morto, `console.log` de debug ou dependência nova sem necessidade?
- [ ] Commit no formato `tipo(escopo): mensagem`, citando RN/RF/Issue?
- [ ] Se a mudança gerou aprendizado, foi registrada em `incident-log/` ou `boundaries.md`?
