const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { Usuario } = require("../models");

const { obterJwtSecret } = require("../config/config");

const JWT_SECRET = obterJwtSecret();

module.exports = {
  async registrar(req, res) {
    try {
      // tipo_usuario NÃO vem do corpo: senão qualquer um se cadastraria como admin
      const { nome, email, senha, telefone } = req.body;

      if (!nome || !email || !senha) {
        return res
          .status(400)
          .json({ error: "Nome, e-mail e senha são obrigatórios." });
      }

      const usuarioExistente = await Usuario.findOne({ where: { email } });
      if (usuarioExistente) {
        return res.status(400).json({ error: "E-mail já cadastrado." });
      }

      const senha_hash = await bcrypt.hash(senha, 10);

      const novoUsuario = await Usuario.create({
        nome,
        email,
        senha_hash,
        telefone,
        tipo_usuario: "comum",
      });

      const usuarioResponse = {
        id: novoUsuario.id,
        nome: novoUsuario.nome,
        email: novoUsuario.email,
        telefone: novoUsuario.telefone,
        tipo_usuario: novoUsuario.tipo_usuario,
      };

      return res.status(201).json({
        message: "Usuário cadastrado com sucesso!",
        usuario: usuarioResponse,
      });
    } catch (error) {
      console.error("[authController.registrar]", error);
      return res.status(500).json({ error: "Erro ao registrar usuário." });
    }
  },

  async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res
          .status(400)
          .json({ error: "E-mail e senha são obrigatórios." });
      }

      const usuario = await Usuario.findOne({ where: { email } });
      if (!usuario) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const senhaValida = await bcrypt.compare(senha, usuario.senha_hash);
      if (!senhaValida) {
        return res.status(401).json({ error: "Credenciais inválidas." });
      }

      const token = jwt.sign(
        {
          id: usuario.id,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
        },
        JWT_SECRET,
        { expiresIn: "24h" },
      );

      return res.status(200).json({
        message: "Login realizado com sucesso!",
        token,
        usuario: {
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          tipo_usuario: usuario.tipo_usuario,
        },
      });
    } catch (error) {
      console.error("[authController.login]", error);
      return res.status(500).json({ error: "Erro ao realizar login." });
    }
  },

  async perfil(req, res) {
    try {
      const usuario = await Usuario.findByPk(req.usuarioId, {
        attributes: {
          exclude: [
            "senha_hash",
            "reset_password_token",
            "reset_password_expires",
          ],
        },
      });

      if (!usuario) {
        return res.status(404).json({ error: "Usuário não encontrado." });
      }

      return res.status(200).json(usuario);
    } catch (error) {
      console.error("[authController.perfil]", error);
      return res.status(500).json({ error: "Erro ao buscar perfil." });
    }
  },
};
