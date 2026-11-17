const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");
const { UPLOADS_DIR, MIMES_PERMITIDOS, URL_PUBLICA } = require("../config/upload");

// Grava no disco os arquivos que JÁ passaram pela corrente de validação.
// Devolve URLs relativas (/uploads/<nome>), que vão para foto_anuncio.url_imagem.
async function salvar(arquivos = []) {
  if (arquivos.length === 0) return [];

  await fs.mkdir(UPLOADS_DIR, { recursive: true });
  const fotos = [];
  try {
    for (const arquivo of arquivos) {
      const nome = `${crypto.randomUUID()}.${MIMES_PERMITIDOS[arquivo.mimetype]}`;
      await fs.writeFile(path.join(UPLOADS_DIR, nome), arquivo.buffer);
      fotos.push({
        url_imagem: `${URL_PUBLICA}/${nome}`,
        mime_type: arquivo.mimetype, 
        tamanho_bytes: arquivo.buffer.length, 
      });
    }
    return fotos;
  } catch (erro) {
    await remover(fotos.map((foto) => foto.url_imagem)); // não deixa arquivo órfão
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