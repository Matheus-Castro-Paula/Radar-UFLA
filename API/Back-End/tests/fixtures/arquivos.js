// Arquivos de teste do plano (seção 4), gerados em memória para não versionar
// binários grandes. Cada um respeita (ou burla, de propósito) a assinatura de
// bytes que o FotosHandler confere.
const { MAX_BYTES } = require("../../src/config/upload");

// PNG real de 1x1 pixel
const PNG_1X1 = Buffer.from(
  "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=",
  "base64",
);

// Cabeçalho JPEG (SOI + APP0/JFIF) e marcador de fim (EOI)
const JPEG_INICIO = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01,
]);
const JPEG_FIM = Buffer.from([0xff, 0xd9]);

// PNG válido e pequeno (CT-03, CT-06, CT-07, CT-08 com quatro cópias)
function pngValido() {
  return { buffer: Buffer.from(PNG_1X1), nome: "foto.png", mime: "image/png" };
}

// JPEG acima do limite de 5 MB (CT-08). Assinatura válida: o que reprova é só o tamanho.
function jpegGrande(bytes = MAX_BYTES + 1024 * 1024) {
  const recheio = Buffer.alloc(bytes - JPEG_INICIO.length - JPEG_FIM.length, 0x00);
  return {
    buffer: Buffer.concat([JPEG_INICIO, recheio, JPEG_FIM]),
    nome: "foto-grande.jpg",
    mime: "image/jpeg",
  };
}

// Texto renomeado para .png (CT-09): MIME declarado de imagem, conteúdo não
function textoDisfarcadoDePng() {
  return {
    buffer: Buffer.from("texto que finge ser uma imagem", "utf8"),
    nome: "falso.png",
    mime: "image/png",
  };
}

module.exports = { pngValido, jpegGrande, textoDisfarcadoDePng };
