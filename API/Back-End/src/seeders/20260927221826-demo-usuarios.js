"use strict";
const bcrypt = require("bcryptjs");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const senhaHash = await bcrypt.hash("admin321", 10);

    await queryInterface.bulkInsert(
      "usuarios",
      [
        {
          nome: "Admin Radar",
          email: "admin@ufla.br",
          senha_hash: senhaHash,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("usuarios", null, {});
  },
};
