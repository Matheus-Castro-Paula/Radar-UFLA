const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const anuncioRoutes = require("./routes/anuncioRoutes");
const { UPLOADS_DIR } = require("./config/upload");

const app = express();

// Middlewares Globais
app.use(cors());
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

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
