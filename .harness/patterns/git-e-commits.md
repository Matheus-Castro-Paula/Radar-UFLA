# Padrão — Git, commits e PRs

## Branches

- Nunca trabalhe direto na `main`.
- Branches de trabalho: `Back-end`, `feature/<assunto>`, `sprint-0X-docs`.
- Integração por Pull Request, revisado por pelo menos uma pessoa.

## Commits

Formato: `tipo(escopo): mensagem no imperativo, em português`

| Tipo       | Uso                                       |
| ---------- | ----------------------------------------- |
| `feat`     | Funcionalidade nova                       |
| `fix`      | Correção de bug                           |
| `refactor` | Mudança interna sem alterar comportamento |
| `docs`     | Documentação                              |
| `chore`    | Configuração, dependências, limpeza       |
| `test`     | Testes                                    |

Exemplos reais do repositório:

- `feat(auth): implementa cadastro, login com bcrypt e middleware JWT`
- `refactor(anuncios): cria AnuncioService e isola regra RN-04 (LGPD)`
- `fix(anuncios): valida categoria e responde 400 na regra RN-04`
- `docs(sprint-04): adiciona evidências do antes e depois do AnuncioService`

Cite RN/RF e a Issue quando houver (`Closes #25` no corpo).

## Uso de IA

- Código gerado por IA passa pelo [ai-review-checklist.md](../ai-review-checklist.md) antes do PR.
- Registrar o uso relevante em [docs/uso-de-ia.md](../../docs/uso-de-ia.md).
