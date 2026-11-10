const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { UPLOADS_DIR, MIMES_PERMITIDOS, URL_PUBLICA } = require("../config/upload");

// Grava no disco os arquivos que JÁ passaram pela corrente de validação.
// Devolve URLs relativas (/uploads/<nome>), que vão para foto_anuncio.url_imagem.
async function salvar(arquivos = []) {
  if (arquivos.length === 0) return [];

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const urls = [];
  try {
    for (const arquivo of arquivos) {
      // Nome gerado por nós: o nome enviado pelo cliente nunca chega ao disco
      const nome = `${crypto.randomUUID()}.${MIMES_PERMITIDOS[arquivo.mimetype]}`;
      await fs.writeFile(path.join(UPLOADS_DIR, nome), arquivo.buffer);
      urls.push(`${URL_PUBLICA}/${nome}`);
    }
    return urls;
  } catch (erro) {
    await remover(urls); // não deixa arquivo órfão se um dos writes falhar
    throw erro;
  }
}

async function remover(urls = []) {
  await Promise.all(
    urls.map((url) =>
      // basename impede que uma URL malformada aponte para fora de UPLOADS_DIR
      fs.unlink(path.join(UPLOADS_DIR, path.basename(url))).catch(() => {}),
    ),
  );
}

module.exports = { salvar, remover };