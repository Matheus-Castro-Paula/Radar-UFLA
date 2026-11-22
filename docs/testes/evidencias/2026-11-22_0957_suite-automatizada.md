# Evidência — Execução da suíte automatizada

- **Data:** 2026-11-22T12:57:00.799Z
- **Resultado:** ✅ suíte aprovada
- **Testes:** 31 aprovados, 0 reprovados, 0 pulados, 31 no total
- **Arquivos de teste:** 2 (0 com falha)
- **Duração:** 7.8 s
- **Ambiente:** `NODE_ENV=test`, banco `radar_ufla_test` em `db_test:3306`, Node v20.20.2, linux
- **Log completo:** [`2026-11-22_0957_suite-automatizada.log`](2026-11-22_0957_suite-automatizada.log)

## Cobertura de código

- Statements   : 88.06% ( 332/377 )
- Branches     : 69.58% ( 135/194 )
- Functions    : 84.48% ( 49/58 )
- Lines        : 88.88% ( 328/369 )

<details><summary>Cobertura por arquivo</summary>

```
-------------------------------|---------|----------|---------|---------|----------------------------
File                           | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s          
-------------------------------|---------|----------|---------|---------|----------------------------
All files                      |   88.06 |    69.58 |   84.48 |   88.88 |                            
 src                           |   83.33 |       50 |   33.33 |   83.33 |                            
  server.js                    |   83.33 |       50 |   33.33 |   83.33 | 24,32-33                   
 src/config                    |    87.5 |    53.57 |     100 |    87.5 |                            
  config.js                    |   83.33 |    53.84 |     100 |   83.33 | 6                          
  upload.js                    |     100 |       50 |     100 |     100 | 12                         
 src/controllers               |   84.05 |     82.6 |     100 |   84.05 |                            
  anuncioController.js         |   89.65 |    66.66 |     100 |   89.65 | 21-22,31                   
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
 src/services                  |   81.39 |    65.62 |   66.66 |   83.95 |                            
  AnuncioService.js            |   81.96 |    67.85 |   83.33 |   84.48 | 19,40-41,99-100,148-151    
  MidiaStorage.js              |      75 |       50 |      20 |   77.77 | 25-34                      
  RegraNegocioError.js         |     100 |      100 |     100 |     100 |                            
 src/services/validations      |   88.67 |    70.78 |    92.3 |   89.42 |                            
  AnuncioValidationChain.js    |     100 |        0 |     100 |     100 | 23                         
  CamposObrigatoriosHandler.js |     100 |       80 |     100 |     100 | 5                          
  CategoriaEStatusHandler.js   |   86.66 |    69.23 |     100 |   86.66 | 11,18                      
  DataOcorrenciaHandler.js     |     100 |    88.88 |     100 |     100 | 8                          
  FotosHandler.js              |   74.35 |    63.63 |   66.66 |   76.31 | 15-22,40,47,54,58,69,83    
  RegraLGPDHandler.js          |     100 |    85.71 |     100 |     100 | 5-6                        
  ValidationHandler.js         |     100 |    66.66 |     100 |     100 | 11                         
-------------------------------|---------|----------|---------|---------|----------------------------
```

</details>

## Resultado por caso de teste

_Nenhum teste cita um ID `CT-xx` no nome._

## Todos os testes

| Arquivo | Teste | Resultado | Duração (ms) |
| --- | --- | --- | --- |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa publicar sem token | ✅ Aprovado | 174 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) cria anúncio com foto em multipart e serve a imagem em /uploads | ✅ Aprovado | 145 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) cria anúncio sem foto | ✅ Aprovado | 129 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa campo obrigatório ausente | ✅ Aprovado | 118 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa categoria fora da lista | ✅ Aprovado | 119 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa mais de 3 fotos | ✅ Aprovado | 125 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa foto acima de 5 MB | ✅ Aprovado | 134 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa formato não permitido (GIF) | ✅ Aprovado | 116 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa arquivo com MIME falso (conteúdo não é imagem) | ✅ Aprovado | 117 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa foto em anúncio de documento e não grava nada em disco | ✅ Aprovado | 116 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa categoria ' DOCUMENTO ' com foto (normalização) | ✅ Aprovado | 115 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD aceita documento sem foto | ✅ Aprovado | 124 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa, na edição, transformar anúncio com foto em documento | ✅ Aprovado | 131 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor | ✅ Aprovado | 131 |
| tests/anuncios.test.js | Anúncios RN-02 / autoria só o autor edita e exclui | ✅ Aprovado | 248 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida grava e devolve a data informada na criação | ✅ Aprovado | 121 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data no futuro | ✅ Aprovado | 117 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data inválida | ✅ Aprovado | 117 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida permite alterar a data na edição | ✅ Aprovado | 129 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro recusa URL externa de foto em JSON | ✅ Aprovado | 113 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro recusa URL enviada como campo de texto no multipart | ✅ Aprovado | 118 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro JSON sem fotos continua funcionando | ✅ Aprovado | 116 |
| tests/anuncios.test.js | Anúncios M-18: metadados da foto grava mime_type e tamanho_bytes | ✅ Aprovado | 122 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) cadastra usuário sem devolver senha_hash | ✅ Aprovado | 119 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa e-mail duplicado | ✅ Aprovado | 64 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa cadastro sem campos obrigatórios | ✅ Aprovado | 4 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) ignora tipo_usuario enviado pelo cliente (sempre 'comum') | ✅ Aprovado | 61 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) login válido devolve token JWT | ✅ Aprovado | 117 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) login com senha errada ou e-mail inexistente devolve 401 genérico | ✅ Aprovado | 174 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) GET /perfil com token válido devolve dados sem campos sensíveis | ✅ Aprovado | 116 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) GET /perfil rejeita token ausente, malformado, inválido e expirado | ✅ Aprovado | 6 |

Gerado por `tests/ambiente/gerar-evidencias.js`.
