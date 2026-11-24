# Evidência — Auditoria de acessibilidade (RNF-05)

- **Data:** 24/11/2026
- **Ferramenta:** axe-core 4.10.2, executado no navegador sobre cada página
- **Regras:** WCAG 2.0 e 2.1, níveis A e AA (`wcag2a`, `wcag2aa`, `wcag21a`, `wcag21aa`)
- **Ambiente:** API no Docker Compose de desenvolvimento (`http://localhost:3000`) e Front-End em `http://localhost:8000`, com usuário logado e anúncios nas abas Achados e Perdidos
- **Requisito:** `RNF-05` de [`requisitos.md`](../../requisitos/requisitos.md)

## 1. Resultado por página

| Página | Violações antes | Violações depois | Regras aprovadas | Itens para revisão manual |
| --- | --- | --- | --- | --- |
| `index.html` (aba Achados, logado) | 1 (`color-contrast`, grave) | 0 | 26 | Ícone decorativo do logo |
| `index.html` (aba Perdidos, logado) | — | 0 | 26 | Ícone decorativo do logo |
| `publicar.html` | 0 | 0 | 24 | Contraste sobre fundo composto |
| `login.html` | 0 | 0 | 15 | Contraste sobre fundo composto |
| `registro.html` | 0 | 0 | 15 | Contraste sobre fundo composto |
| `privacidade.html` | 0 | 0 | 10 | — |

Os "itens para revisão manual" são casos em que o axe não consegue calcular o contraste sozinho, como um elemento que só tem um símbolo (`.wordmark-mark`). Foram conferidos visualmente: o ícone do logo é decorativo, e os textos sobre fundo composto são legíveis.

## 2. Violação encontrada e correção

| Item | Antes | Depois |
| --- | --- | --- |
| Selo "Achado" no card (`.card-badge`) | Texto `#C68A2E` sobre branco: **2,97:1** (o mínimo AA para texto pequeno é 4,5:1) | Novo token `--achados-texto: #8F5F14`: **5,50:1** |
| Contador da aba Achados (`.tab-count`) | Mesma cor sobre `#FBF1DF`: **2,65:1** | `#8F5F14` sobre `#FBF1DF`: **4,91:1** |

O laranja original continua nas bordas e no sublinhado da aba, onde não há texto. O selo "Perdido" (`#4C6E8A`, 5,38:1) já atendia. Correção em [`styles.css`](../../../API/Front-End/styles.css).

## 3. Verificações manuais

| Verificação | Resultado |
| --- | --- |
| Navegação por teclado na vitrine | 15 elementos focáveis, na ordem: logo, busca, Sair, Publicar, abas, filtros, botões do card. Nenhum `tabindex` positivo |
| Foco visível | Contorno sólido de 2 px na cor da marca (`:focus-visible`), conferido ao chegar no botão "Marcar como resolvido" com a tecla Tab |
| Nome acessível | Nenhum elemento focável sem nome; os botões do card têm `aria-label` com o título do anúncio |
| Abas e mensagens | `role="tablist"`, `aria-selected` e mensagens em região `role="status"` e `aria-live` |

## 4. Limitações

- O axe detecta cerca de metade dos problemas de WCAG. Não houve teste com leitor de tela (NVDA) nem com usuários.
- A conformidade vale para as cinco páginas e os estados testados. Mensagens de erro do formulário de publicação não foram auditadas abertas.
