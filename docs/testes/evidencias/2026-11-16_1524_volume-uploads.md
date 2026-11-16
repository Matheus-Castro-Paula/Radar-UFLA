# Evidência — Persistência das fotos no volume Docker

- **Data:** 2026-11-16T18:24:02.261Z
- **Ambiente:** `docker-compose.yml` de desenvolvimento, API em `http://localhost:3000`
- **O que prova:** a foto enviada fica no volume nomeado `uploads_data` e continua disponível depois que o container da API é recriado (ADR-08).
- **Resultado:** ✅ volume persistiu a foto

|  | Passo | Detalhe |
| --- | --- | --- |
| ✅ | API de desenvolvimento no ar | http://localhost:3000 |
| ✅ | Usuário temporário autenticado | volume.1794853442261@teste.ufla.br |
| ✅ | Anúncio com foto publicado | HTTP 201, /uploads/c80f6d88-cd30-4d61-be6f-735b10e4eb1e.png |
| ✅ | Foto servida antes de recriar | HTTP 200, sha256 63ef318d96b5… |
| ✅ | Container da API recriado | novo container c91798406a8e |
| ✅ | Foto continua servida após recriar (volume persistiu) | HTTP 200, sha256 63ef318d96b5…, 68 bytes |
| ✅ | Arquivo presente no volume uploads_data | -rw-r--r-- 1 root root 68 Nov 16 18:24 /app/uploads/c80f6d88-cd30-4d61-be6f-735b10e4eb1e.png |
| ✅ | Limpeza do anúncio, da foto e do usuário temporários | ok |

Gerado por `tests/ambiente/validar-volume-uploads.js`.
