# Evidências de interface — CT-12 (Sprint 7)

> Issue [#54](https://github.com/Matheus-Castro-Paula/Radar-UFLA/issues/54) | Responsável: Front-end (`@rodrigopenha13`) | Caso do [Plano de Testes](../plano-de-testes.md): **CT-12**

Roteiro manual com capturas de tela dos fluxos de publicação e da vitrine. Cobre `RF-07` (data e hora), `RF-08` (limites de foto), `RN-04` (LGPD) e a correção do defeito M-15 vista pela interface.

## 1. Ambiente testado

| Item | Valor |
| --- | --- |
| Data e hora da execução | 2026-11-16, das 21:35 às 21:53 (horário de Brasília) |
| Branch e commit testados | `feature/testes-automatizados-sprint-07`, commit `8320d84` (inclui as correções M-15, M-16 e M-18) |
| Correção M-15 incluída? | Sim. Verificada pela interface no passo CT-12.6: o card mostra a data e hora informadas |
| Navegador | Mozilla Firefox |
| API | `http://localhost:3000` (Docker, migrations e seeder aplicados, conforme o README) |
| Front-End | `http://127.0.0.1:8000` |
| Usuário | Usuário de demonstração do seeder (autor exibido nos cards: "Admin Radar") |

## 2. Arquivos usados no teste

| Arquivo | Para que serve |
| --- | --- |
| Fotos de chaves (JPG/PNG, menos de 5 MB cada) | Fotos válidas (passos CT-12.1, CT-12.5, CT-12.6 e CT-12.8) |
| `iss075e0275000~orig.jpg` (pouco mais de 5 MB) | Passo CT-12.3a (acima do limite) |
| `README.md` | Passo CT-12.3b (formato inválido) |

## 3. Execução do roteiro

Capturas de tela salvas nesta mesma pasta.

| Passo | Ação | Resultado esperado | Resultado obtido | Evidência |
| --- | --- | --- | --- | --- |
| CT-12.1 | Abrir `publicar.html` logado | O formulário tem o campo **Data e hora** (calendário) e a área de upload de fotos | ✅ Campo Data e hora com seletor de calendário e área de upload visíveis | [ct12-1-formulario.jpg](ct12-1-formulario.jpg) |
| CT-12.2 | Preencher título, descrição e local; informar uma **data futura**; clicar em Publicar | Mensagem "A data e a hora não podem estar no futuro." e nenhum anúncio criado | ✅ Data futura recusada na tela, sem criar anúncio | [ct12-2-data-futura.jpg](ct12-2-data-futura.jpg) |
| CT-12.3a | Escolher uma foto acima de 5 MB | Mensagem informando que a foto deve ter no máximo 5 MB; a foto não aparece na prévia | ✅ Arquivo de pouco mais de 5 MB (exibido como "5.0 MB") recusado com a mensagem de limite; não entrou na prévia | [ct12-3a-foto-grande.jpg](ct12-3a-foto-grande.jpg) |
| CT-12.3b | Escolher um arquivo que não é imagem (`README.md`) | Mensagem informando que o arquivo não é JPG, PNG ou WEBP | ✅ Arquivo recusado com a mensagem de formato inválido | [ct12-3b-formato-invalido.jpg](ct12-3b-formato-invalido.jpg) |
| CT-12.4 | Escolher a categoria **Documento** | Área de upload oculta e aviso de LGPD exibido | ✅ Upload oculto e aviso de LGPD exibido. Teste feito sem foto previamente escolhida, então a mensagem de descarte de fotos não apareceu | [ct12-4-documento.jpg](ct12-4-documento.jpg) |
| CT-12.5 | Categoria "Objeto pessoal", informar data e hora **passadas** e publicar | Mensagem "Item publicado!" e redirecionamento para a vitrine | ✅ "Item publicado! Redirecionando para o feed..." exibido. Esta publicação foi feita sem foto; a publicação com foto aparece na vitrine (CT-12.6) | [ct12-5-publicado.jpg](ct12-5-publicado.jpg) |
| CT-12.6 | Na vitrine (`index.html`), localizar os anúncios publicados | O card mostra a **foto enviada** e a **data e hora informadas**, não a hora de criação | ✅ O primeiro card mostra a foto e "09/11, 15:00"; o segundo mostra "12/11, 21:50", exatamente a data digitada no CT-12.5 (M-15 corrigido) | [ct12-6-vitrine.jpg](ct12-6-vitrine.jpg) |
| CT-12.7 | Publicar um anúncio da categoria **Documento**, sem foto | "Item publicado!"; na vitrine o card mostra o ícone da categoria, sem imagem (`RN-04`) | ✅ Card "CNH" exibido com o ícone de documento, sem imagem, com a data informada (09/11, 21:49) | [ct12-7-documento-vitrine.jpg](ct12-7-documento-vitrine.jpg) |
| CT-12.8 | Anexar **3 fotos** e depois tentar anexar uma 4ª | Máximo de 3 fotos; aviso ao tentar a 4ª | ✅ Três prévias exibidas e aviso "Envie no máximo 3 fotos. As demais foram ignoradas." | [ct12-8-tres-fotos.jpg](ct12-8-tres-fotos.jpg) |

## 4. Resultado

| Item | Resultado |
| --- | --- |
| Passos aprovados | 9 de 9 |
| CT-12 | **Aprovado** |
| Defeitos encontrados | Nenhum |
