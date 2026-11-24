const express = require("express");
const router = express.Router();
const anuncioController = require("../controllers/anuncioController");
const autenticarToken = require("../middlewares/authMiddleware");
const uploadFotos = require("../middlewares/uploadMiddleware");

// Rotas públicas (vitrine)
router.get("/", anuncioController.listar);
router.get("/:id", anuncioController.buscarPorId);

// Rotas protegidas por JWT
// Contato do autor: só para quem está logado (a vitrine pública não expõe e-mail — RN-04)
router.get("/:id/contato", autenticarToken, anuncioController.contato);
router.post("/", autenticarToken, uploadFotos, anuncioController.criar);
router.put("/:id", autenticarToken, anuncioController.atualizar);
router.delete("/:id", autenticarToken, anuncioController.excluir);

module.exports = router;
