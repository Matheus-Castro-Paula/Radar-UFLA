const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncioController");
const autenticarToken = require("../middlewares/authMiddleware");

// Rotas públicas (vitrine)
router.get("/", anuncioController.listar);
router.get("/:id", anuncioController.buscarPorId);

// Rotas protegidas por JWT
router.post("/", autenticarToken, anuncioController.criar);
router.put("/:id", autenticarToken, anuncioController.atualizar);
router.delete("/:id", autenticarToken, anuncioController.excluir);

module.exports = router;
