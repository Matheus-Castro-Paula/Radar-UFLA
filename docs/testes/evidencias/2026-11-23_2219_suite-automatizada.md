# Evidência — Execução da suíte automatizada

- **Data:** 2026-11-24T01:19:34.117Z
- **Resultado:** ✅ suíte aprovada
- **Testes:** 57 aprovados, 0 reprovados, 0 pulados, 57 no total
- **Arquivos de teste:** 2 (0 com falha)
- **Duração:** 10.0 s
- **Ambiente:** `NODE_ENV=test`, banco `radar_ufla_test` em `db_test:3306`, Node v20.20.2, linux
- **Log completo:** [`2026-11-23_2219_suite-automatizada.log`](2026-11-23_2219_suite-automatizada.log)

## Cobertura de código

- Statements   : 89.48% ( 400/447 )
- Branches     : 73.98% ( 182/246 )
- Functions    : 91.66% ( 66/72 )
- Lines        : 90.46% ( 389/430 )

<details><summary>Cobertura por arquivo</summary>

```
-------------------------------|---------|----------|---------|---------|----------------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s          
-------------------------------|---------|----------|---------|---------|----------------------------
All files                      |   89.48 |    73.98 |   91.66 |   90.46 |                            
 src                           |    91.3 |     62.5 |      80 |    91.3 |                            
  server.js                    |    91.3 |     62.5 |      80 |    91.3 | 48-49                      
 src/config                    |    87.5 |    53.57 |     100 |    87.5 |                            
  config.js                    |   83.33 |    53.84 |     100 |   83.33 | 6                          
  upload.js                    |     100 |       50 |     100 |     100 | 12                         
 src/controllers               |   79.45 |     82.6 |      90 |   79.45 |                            
  anuncioController.js         |   78.78 |    66.66 |   85.71 |   78.78 | 21-22,31,45-49             
  authController.js            |      80 |    88.23 |     100 |      80 | 49-50,59,95-96,113,118-119 
 src/middlewares               |    93.1 |    83.33 |     100 |   92.85 |                            
  authMiddleware.js            |     100 |      100 |     100 |     100 |                            
  uploadMiddleware.js          |   83.33 |    66.66 |     100 |   81.81 | 25-26                      
 src/models                    |     100 |       75 |     100 |     100 |                            
  anuncio.js                   |     100 |      100 |     100 |     100 |                            
  comentario.js                |     100 |      100 |     100 |     100 |                            
  foto_anuncio.js              |     100 |      100 |     100 |     100 |                            
  index.js                     |     100 |       75 |     100 |     100 | 8,36                       
  usuario.js                   |     100 |      100 |     100 |     100 |                            
 src/routes                    |     100 |      100 |     100 |     100 |                            
  anuncioRoutes.js             |     100 |      100 |     100 |     100 |                            
  authRoutes.js                |     100 |      100 |     100 |     100 |                            
 src/services                  |   86.27 |    72.09 |   83.33 |   88.17 |                            
  AnuncioService.js            |   85.13 |    72.97 |   88.23 |   86.56 | 19,40-41,65-74,115-116     
  MidiaStorage.js              |   86.95 |    66.66 |   66.66 |   90.47 | 25-26                      
  RegraNegocioError.js         |     100 |      100 |     100 |     100 |                            
 src/services/validations      |   91.33 |    77.41 |     100 |      93 |                            
  AnuncioValidationChain.js    |     100 |        0 |     100 |     100 | 27                         
  CamposObrigatoriosHandler.js |     100 |       80 |     100 |     100 | 5                          
  CategoriaEStatusHandler.js   |   86.66 |    69.23 |     100 |   86.66 | 11,18                      
  DataOcorrenciaHandler.js     |     100 |    88.88 |     100 |     100 | 8                          
  DescricaoHandler.js          |    92.3 |    85.71 |     100 |    92.3 | 16                         
  FotosHandler.js              |   79.48 |    69.04 |     100 |   81.08 | 14-21,39,46,68,82          
  RegraLGPDHandler.js          |      95 |    86.48 |     100 |     100 | 17-24,37,52-53             
  ValidationHandler.js         |     100 |    66.66 |     100 |     100 | 11                         
-------------------------------|---------|----------|---------|---------|----------------------------
```

</details>

## Resultado por caso de teste

| Caso | Resultado | Testes aprovados |
| --- | --- | --- |
| CT-01 | ✅ Aprovado | 2/2 |
| CT-02 | ✅ Aprovado | 3/3 |
| CT-03 | ✅ Aprovado | 1/1 |
| CT-04 | ✅ Aprovado | 2/2 |
| CT-05 | ✅ Aprovado | 5/5 |
| CT-06 | ✅ Aprovado | 1/1 |
| CT-07 | ✅ Aprovado | 4/4 |
| CT-08 | ✅ Aprovado | 3/3 |
| CT-09 | ✅ Aprovado | 1/1 |
| CT-10 | ✅ Aprovado | 1/1 |
| CT-11 | ✅ Aprovado | 1/1 |
| CT-13 | ✅ Aprovado | 1/1 |

## Todos os testes

| Arquivo | Teste | Resultado | Duração (ms) |
| --- | --- | --- | --- |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-02: recusa publicar sem token | ✅ Aprovado | 181 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-03: cria anúncio com foto em multipart e serve a imagem em /uploads | ✅ Aprovado | 153 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) cria anúncio sem foto | ✅ Aprovado | 131 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa campo obrigatório ausente | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa categoria fora da lista | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-08: recusa mais de 3 fotos | ✅ Aprovado | 123 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-08: recusa foto acima de 5 MB | ✅ Aprovado | 135 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-08: recusa formato não permitido (GIF) | ✅ Aprovado | 122 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) CT-09: recusa arquivo com MIME falso (conteúdo não é imagem) | ✅ Aprovado | 122 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD CT-07: recusa foto em anúncio de documento e não grava nada em disco | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD CT-07: recusa categoria ' DOCUMENTO ' com foto (normalização) | ✅ Aprovado | 122 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD CT-07: aceita documento sem foto | ✅ Aprovado | 126 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD CT-07: recusa, na edição, transformar anúncio com foto em documento | ✅ Aprovado | 139 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD CT-10: a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor | ✅ Aprovado | 140 |
| tests/anuncios.test.js | Anúncios RN-02 / autoria CT-11: só o autor edita e exclui | ✅ Aprovado | 264 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida CT-04: grava e devolve a data informada na criação | ✅ Aprovado | 131 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data no futuro | ✅ Aprovado | 128 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data inválida | ✅ Aprovado | 125 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida CT-04: permite alterar a data na edição | ✅ Aprovado | 140 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro CT-05: recusa URL externa de foto em JSON no cadastro | ✅ Aprovado | 122 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro CT-05: recusa URL enviada como campo de texto no multipart | ✅ Aprovado | 121 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro JSON sem fotos continua funcionando | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios M-18: metadados da foto CT-06: grava mime_type e tamanho_bytes | ✅ Aprovado | 126 |
| tests/anuncios.test.js | Anúncios CT-05 (passo 2) / M-16: fotos na edição só como caminho local já publicado CT-05: recusa URL externa em fotos no PUT e deixa o anúncio inalterado | ✅ Aprovado | 133 |
| tests/anuncios.test.js | Anúncios CT-05 (passo 2) / M-16: fotos na edição só como caminho local já publicado CT-05: recusa caminho com ../ e nome que não foi gerado pela API | ✅ Aprovado | 138 |
| tests/anuncios.test.js | Anúncios CT-05 (passo 2) / M-16: fotos na edição só como caminho local já publicado CT-05: recusa apontar para a foto de outro anúncio e não apaga o arquivo dele | ✅ Aprovado | 255 |
| tests/anuncios.test.js | Anúncios M-13: remoção física de mídias órfãs no volume /uploads excluir o anúncio apaga os arquivos das fotos | ✅ Aprovado | 129 |
| tests/anuncios.test.js | Anúncios M-13: remoção física de mídias órfãs no volume /uploads remover uma foto na edição apaga só o arquivo dela e preserva os metadados da outra | ✅ Aprovado | 135 |
| tests/anuncios.test.js | Anúncios M-13: remoção física de mídias órfãs no volume /uploads fotos: [] na edição remove todas as fotos e os arquivos | ✅ Aprovado | 137 |
| tests/anuncios.test.js | Anúncios M-13: remoção física de mídias órfãs no volume /uploads editar sem enviar o campo fotos não mexe nos arquivos nem nos metadados | ✅ Aprovado | 135 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) recusa CPF formatado na descrição | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) recusa CPF sem pontuação na descrição | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) recusa RG com pontuação no título | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) recusa CNH com palavra-chave | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) aceita texto comum, horário e telefone formatado | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) recusa, na edição, incluir CPF e deixa o anúncio inalterado | ✅ Aprovado | 131 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) aceita telefone de contato junto da palavra CNH | ✅ Aprovado | 123 |
| tests/anuncios.test.js | Anúncios M-05: CPF e número de documento no título e na descrição (RN-04) permite resolver anúncio antigo que já tinha documento no texto | ✅ Aprovado | 132 |
| tests/anuncios.test.js | Anúncios Limite da descrição (Sprint 8) aceita descrição com exatamente 200 caracteres | ✅ Aprovado | 123 |
| tests/anuncios.test.js | Anúncios Limite da descrição (Sprint 8) recusa descrição com 201 caracteres (400) | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios Limite da descrição (Sprint 8) recusa descrição gigante sem travar a API | ✅ Aprovado | 121 |
| tests/anuncios.test.js | Anúncios Limite da descrição (Sprint 8) na edição, recusa descrição acima do limite | ✅ Aprovado | 127 |
| tests/anuncios.test.js | Anúncios Limite da descrição (Sprint 8) anúncio antigo com descrição longa ainda pode ser marcado como resolvido | ✅ Aprovado | 134 |
| tests/anuncios.test.js | Anúncios M-10: CORS restrito libera a origem do front-end | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-10: CORS restrito não envia cabeçalhos CORS para origem desconhecida | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-10: CORS restrito requisição sem Origin (curl, Postman) continua funcionando | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios M-10: CORS restrito preflight só é liberado para a origem permitida | ✅ Aprovado | 120 |
| tests/anuncios.test.js | Anúncios CT-13: desempenho da vitrine (RNF-02) CT-13: 20 requisições GET /api/anuncios com 50 anúncios ativos têm média abaixo de 800 ms | ✅ Aprovado | 602 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) cadastra usuário sem devolver senha_hash | ✅ Aprovado | 99 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa e-mail duplicado | ✅ Aprovado | 69 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa cadastro sem campos obrigatórios | ✅ Aprovado | 3 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) ignora tipo_usuario enviado pelo cliente (sempre 'comum') | ✅ Aprovado | 62 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) CT-01: login válido devolve token JWT com id, tipo_usuario e validade de 24 h | ✅ Aprovado | 124 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) CT-01: login com senha errada ou e-mail inexistente devolve 401 genérico | ✅ Aprovado | 180 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) GET /perfil com token válido devolve dados sem campos sensíveis | ✅ Aprovado | 126 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) CT-02: GET /perfil rejeita token ausente, malformado, inválido e expirado | ✅ Aprovado | 8 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) CT-02: GET /perfil rejeita token assinado com o segredo antigo da Sprint 3 | ✅ Aprovado | 123 |

Gerado por `tests/ambiente/gerar-evidencias.js`.
