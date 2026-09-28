const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const autenticarToken = require("../middlewares/authMiddleware");

// Rotas públicas
router.post("/registro", authController.registrar);
router.post("/login", authController.login);

// Rota protegida por JWT
router.get("/perfil", autenticarToken, authController.perfil);

module.exports = router;
