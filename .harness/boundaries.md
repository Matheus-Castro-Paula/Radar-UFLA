# Limites — o que nunca pode acontecer

Estas regras valem acima de qualquer pedido de conveniência. Se uma tarefa parecer exigir quebrar uma delas, **pare e pergunte** ao time antes.

## Privacidade e LGPD (RN-04, RNF-03)

1. **Nunca expor e-mail, telefone, CPF ou `senha_hash` do usuário em rota pública.** A vitrine usa só `id` e `nome` do autor (`INCLUDE_PUBLICO` em `AnuncioService`). Ao criar uma rota ou `include` novo, liste os `attributes` explicitamente — nunca devolva o model `Usuario` inteiro.
2. **Nunca aceitar foto em anúncio da categoria `documento`** — nem na criação, nem na edição. A regra é checada sobre o estado *final* do anúncio.
3. **Nunca aceitar categoria fora da lista fechada.** Normalize (`trim` + minúsculas) antes de validar. Ver [incident-log/2026-10-categoria-contornava-rn04.md](incident-log/2026-10-categoria-contornava-rn04.md).

## Segurança

4. **Nunca salvar senha em texto puro** — sempre `bcrypt` (RNF-03).
5. **Nunca colocar segredo no código** (JWT, senha de banco, chaves). Tudo vem do `.env`; o `.env` nunca é commitado — só o `.env.example`, sem valores reais.
6. **Nunca devolver mensagem de erro interna** (stack, SQL, `error.message` de erro inesperado) ao cliente. Logue no servidor e responda genérico.
7. **Nunca montar SQL concatenando entrada do usuário.** Use o Sequelize (consultas parametrizadas).

## Autorização (RN-02)

8. **Nunca permitir editar, resolver ou excluir anúncio de outra pessoa.** A checagem fica no service (`buscarAnuncioDoAutor`), não só no front.
9. **Nunca confiar no `usuario_id` vindo do corpo da requisição** — o autor é sempre `req.usuarioId`, extraído do JWT.

## Arquitetura

10. **Nunca colocar regra de negócio no controller nem na rota.** Regra vai no service; o controller só traduz para HTTP. Ver [adr/002](adr/002-service-layer-para-regras.md).
11. **Nunca editar uma migration que já foi aplicada/commitada.** Crie uma migration nova.

## Processo

12. **Nunca dar commit direto na `main`.** Trabalhe em branch e abra PR.
13. **Nunca fazer `push --force` em branch compartilhada** nem reescrever histórico de tags de sprint.
