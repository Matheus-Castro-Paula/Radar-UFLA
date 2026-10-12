const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const anuncioRoutes = require("./routes/anuncioRoutes");

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

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
