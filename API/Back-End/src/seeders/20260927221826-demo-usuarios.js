"use strict";
const bcrypt = require("bcryptjs");

const ADMIN_EMAIL = "admin@ufla.br";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  // M-17: idempotente. Bancos criados antes da Sprint 6 não registravam os
  // seeders já executados; o db:seed:all do docker-entrypoint.sh tentava
  // recriar o admin, o e-mail único falhava e a API não subia.
  // (Consulta direta em vez de Usuario.findOrCreate: seeder não depende de
  // model, que muda com o tempo.)
  async up(queryInterface) {
    const [existentes] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = ?",
      { replacements: [ADMIN_EMAIL] },
    );
    if (existentes.length > 0) {
      console.log(`[demo-usuarios] ${ADMIN_EMAIL} já existe; nada a fazer.`);
      return;
    }

    const senhaHash = await bcrypt.hash("admin321", 10);

    await queryInterface.bulkInsert("usuarios", [
      {
        nome: "Admin Radar",
        email: ADMIN_EMAIL,
        senha_hash: senhaHash,
        tipo_usuario: "admin",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  async down(queryInterface) {
    // Remove só o que este seeder criou, não todos os usuários
    await queryInterface.bulkDelete("usuarios", { email: ADMIN_EMAIL });
  },
};
