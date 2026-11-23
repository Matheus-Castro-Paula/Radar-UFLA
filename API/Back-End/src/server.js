const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const anuncioRoutes = require("./routes/anuncioRoutes");
const { UPLOADS_DIR } = require("./config/upload");

const app = express();

// M-10: CORS restrito. As origens permitidas vêm de CORS_ORIGINS
const ORIGENS_PADRAO = "http://localhost:8000,http://127.0.0.1:8000";
const ORIGENS_PERMITIDAS = (process.env.CORS_ORIGINS || ORIGENS_PADRAO)
  .split(",")
  .map((origem) => origem.trim())
  .filter(Boolean);

const PORT = Number(process.env.PORT) || 3000;

// Middlewares Globais
app.use(
  cors({
    // Requisição sem Origin (curl, Postman, Supertest) não é do navegador: passa.
    // Origem fora da lista não recebe os cabeçalhos CORS e o navegador bloqueia.
    origin: (origem, callback) =>
      callback(null, !origem || ORIGENS_PERMITIDAS.includes(origem)),
  }),
);
app.use(express.json());

// Fotos enviadas (RF-08): servidas como arquivos estáticos em /uploads/<arquivo>
app.use(
  "/uploads",
  express.static(UPLOADS_DIR, {
    index: false,
    setHeaders: (res) => res.setHeader("X-Content-Type-Options", "nosniff"),
  }),
);

// Rota de Teste Simples
app.get("/", (req, res) => {
  res.send("API Radar UFLA - Rodando");
});

// Agrupamento das Rotas de Autenticação
app.use("/api/auth", authRoutes);
app.use("/api/anuncios", anuncioRoutes);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

module.exports = app;