# Evidência — Execução da suíte automatizada

- **Data:** 2026-11-16T22:56:08.850Z
- **Resultado:** ✅ suíte aprovada
- **Testes:** 31 aprovados, 0 reprovados, 0 pulados, 31 no total
- **Arquivos de teste:** 2 (0 com falha)
- **Duração:** 7.1 s
- **Ambiente:** `NODE_ENV=test`, banco `radar_ufla_test` em `127.0.0.1:3306`, Node v22.22.1, linux
- **Log completo:** [`2026-11-16_1956_suite-automatizada.log`](2026-11-16_1956_suite-automatizada.log)

## Resultado por caso de teste

_Nenhum teste cita um ID `CT-xx` no nome._

## Todos os testes

| Arquivo | Teste | Resultado | Duração (ms) |
| --- | --- | --- | --- |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa publicar sem token | ✅ Aprovado | 254 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) cria anúncio com foto em multipart e serve a imagem em /uploads | ✅ Aprovado | 200 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) cria anúncio sem foto | ✅ Aprovado | 167 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa campo obrigatório ausente | ✅ Aprovado | 137 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa categoria fora da lista | ✅ Aprovado | 148 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa mais de 3 fotos | ✅ Aprovado | 179 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa foto acima de 5 MB | ✅ Aprovado | 210 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa formato não permitido (GIF) | ✅ Aprovado | 192 |
| tests/anuncios.test.js | Anúncios Publicação e upload (RF-07, RF-08) recusa arquivo com MIME falso (conteúdo não é imagem) | ✅ Aprovado | 165 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa foto em anúncio de documento e não grava nada em disco | ✅ Aprovado | 166 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa categoria ' DOCUMENTO ' com foto (normalização) | ✅ Aprovado | 157 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD aceita documento sem foto | ✅ Aprovado | 152 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD recusa, na edição, transformar anúncio com foto em documento | ✅ Aprovado | 149 |
| tests/anuncios.test.js | Anúncios RN-04 / LGPD a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor | ✅ Aprovado | 154 |
| tests/anuncios.test.js | Anúncios RN-02 / autoria só o autor edita e exclui | ✅ Aprovado | 281 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida grava e devolve a data informada na criação | ✅ Aprovado | 147 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data no futuro | ✅ Aprovado | 129 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida recusa data inválida | ✅ Aprovado | 130 |
| tests/anuncios.test.js | Anúncios M-15: data_ocorrencia é persistida permite alterar a data na edição | ✅ Aprovado | 152 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro recusa URL externa de foto em JSON | ✅ Aprovado | 126 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro recusa URL enviada como campo de texto no multipart | ✅ Aprovado | 126 |
| tests/anuncios.test.js | Anúncios M-16: fotos só como arquivo no cadastro JSON sem fotos continua funcionando | ✅ Aprovado | 132 |
| tests/anuncios.test.js | Anúncios M-18: metadados da foto grava mime_type e tamanho_bytes | ✅ Aprovado | 137 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) cadastra usuário sem devolver senha_hash | ✅ Aprovado | 103 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa e-mail duplicado | ✅ Aprovado | 85 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) recusa cadastro sem campos obrigatórios | ✅ Aprovado | 7 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) ignora tipo_usuario enviado pelo cliente (sempre 'comum') | ✅ Aprovado | 76 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) login válido devolve token JWT | ✅ Aprovado | 131 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) login com senha errada ou e-mail inexistente devolve 401 genérico | ✅ Aprovado | 185 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) GET /perfil com token válido devolve dados sem campos sensíveis | ✅ Aprovado | 130 |
| tests/autenticacao.test.js | Autenticação JWT (RF-01, RNF-03) GET /perfil rejeita token ausente, malformado, inválido e expirado | ✅ Aprovado | 10 |

Gerado por `tests/ambiente/gerar-evidencias.js`.
