const multer = require("multer");
const { MAX_FOTOS, MAX_BYTES } = require("../config/upload");

const receberFotos = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: MAX_BYTES, files: MAX_FOTOS, fields: 20 },
}).array("fotos", MAX_FOTOS);

const MENSAGENS = {
  LIMIT_FILE_SIZE: `Cada foto deve ter no máximo ${MAX_BYTES / (1024 * 1024)} MB.`,
  LIMIT_FILE_COUNT: `Envie no máximo ${MAX_FOTOS} fotos.`,
  LIMIT_UNEXPECTED_FILE: `Envie no máximo ${MAX_FOTOS} fotos, no campo "fotos".`,
};

module.exports = (req, res, next) => {
  receberFotos(req, res, (erro) => {
    if (!erro) return next();

    if (erro instanceof multer.MulterError) {
      return res.status(400).json({
        error: MENSAGENS[erro.code] || "Falha ao processar o envio das fotos.",
      });
    }

    console.error("[uploadMiddleware]", erro);
    return res.status(500).json({ error: "Erro ao receber as fotos." });
  });
};
