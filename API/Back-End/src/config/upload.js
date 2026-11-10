const path = require("path");

module.exports = {
  MAX_FOTOS: 3,
  MAX_BYTES: 5 * 1024 * 1024, // 5 MB por foto
  MIMES_PERMITIDOS: {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
  },
  UPLOADS_DIR:
    process.env.UPLOADS_DIR || path.resolve(__dirname, "../../uploads"),
  URL_PUBLICA: "/uploads",
};
