'use strict';

// RF-02 (papéis) e RN-02: o authController já lia e gravava estes campos,
// mas eles não existiam na tabela — o papel nunca era salvo e o JWT saía
// com tipo_usuario indefinido.
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('usuarios', 'tipo_usuario', {
      type: Sequelize.ENUM('comum', 'admin'),
      allowNull: false,
      defaultValue: 'comum',
      after: 'senha_hash',
    });
    // Dado pessoal: nunca exibir na vitrine pública (RN-04)
    await queryInterface.addColumn('usuarios', 'telefone', {
      type: Sequelize.STRING(20),
      allowNull: true,
      after: 'tipo_usuario',
    });
  },

  async down(queryInterface) {
    await queryInterface.removeColumn('usuarios', 'telefone');
    await queryInterface.removeColumn('usuarios', 'tipo_usuario');
  },
};
