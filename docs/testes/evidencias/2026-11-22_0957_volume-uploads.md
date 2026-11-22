# Evidência — Persistência das fotos no volume Docker

- **Data:** 2026-11-22T12:57:35.932Z
- **Ambiente:** `docker-compose.yml` de desenvolvimento, API em `http://localhost:3000`
- **O que prova:** a foto enviada fica no volume nomeado `uploads_data` e continua disponível depois que o container da API é recriado (ADR-08).
- **Resultado:** ✅ volume persistiu a foto

|  | Passo | Detalhe |
| --- | --- | --- |
| ✅ | API de desenvolvimento no ar | http://localhost:3000 |
| ✅ | Usuário temporário autenticado | volume.1795352255933@teste.ufla.br |
| ✅ | Anúncio com foto publicado | HTTP 201, /uploads/b4fe4b56-a77b-4cef-9fe0-c4d1864b9380.png |
| ✅ | Foto servida antes de recriar | HTTP 200, sha256 63ef318d96b5… |
| ✅ | Container da API recriado | novo container 28b99592329e |
| ✅ | Foto continua servida após recriar (volume persistiu) | HTTP 200, sha256 63ef318d96b5…, 68 bytes |
| ✅ | Arquivo presente no volume uploads_data | -rw-r--r-- 1 root root 68 Nov 22 12:57 /app/uploads/b4fe4b56-a77b-4cef-9fe0-c4d1864b9380.png |
| ✅ | Limpeza do anúncio, da foto e do usuário temporários | ok |

Gerado por `tests/ambiente/validar-volume-uploads.js`.
