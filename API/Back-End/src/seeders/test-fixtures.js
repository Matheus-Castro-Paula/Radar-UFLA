"use strict";
const bcrypt = require("bcryptjs");
const { test: configTeste } = require("../config/config");

// Massa de dados da suíte automatizada (Sprint 7, plano de testes seção 4).
// Os usuários A e B do plano são cadastrados pela própria suíte via rota;
// aqui ficam só os dados que os testes precisam encontrar prontos no banco.
// Categoria não é tabela (lista fixa no AnuncioService), então não tem fixture.
const CATEGORIAS = ["objeto", "eletronico", "documento", "material", "outro"];
const LOCAIS = ["Bloco 3", "Biblioteca Central", "Restaurante Universitário", "Pavilhão 2", "DCC"];

const FIXTURES = {
  // Dono dos anúncios da vitrine (CT-13 precisa de 50 anúncios ativos)
  autorVitrine: { nome: "Fixture Vitrine", email: "fixture.vitrine@teste.ufla.br", senha: "fixture123" },
  // Administrador Geral, para testes de papel (RF-02, RN-02)
  admin: { nome: "Fixture Admin", email: "fixture.admin@teste.ufla.br", senha: "fixture123" },
  totalAnunciosVitrine: 50,
};

// O docker-entrypoint.sh roda db:seed:all no banco de desenvolvimento: sem
// esta trava, os dados falsos iriam parar no banco de todo mundo.
function ehBancoDeTeste(queryInterface) {
  return queryInterface.sequelize.config.database === configTeste.database;
}

module.exports = {
  FIXTURES,

  async up(queryInterface) {
    if (!ehBancoDeTeste(queryInterface)) {
      console.log("[test-fixtures] Ignorado: só roda no banco de teste.");
      return;
    }

    // Idempotente (M-17): se já carregou antes, não duplica
    const [existentes] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = ?",
      { replacements: [FIXTURES.autorVitrine.email] },
    );
    if (existentes.length > 0) {
      console.log("[test-fixtures] Fixtures já carregadas; nada a fazer.");
      return;
    }

    const agora = new Date();
    const [hashVitrine, hashAdmin] = await Promise.all([
      bcrypt.hash(FIXTURES.autorVitrine.senha, 10),
      bcrypt.hash(FIXTURES.admin.senha, 10),
    ]);

    await queryInterface.bulkInsert("usuarios", [
      {
        nome: FIXTURES.autorVitrine.nome,
        email: FIXTURES.autorVitrine.email,
        senha_hash: hashVitrine,
        tipo_usuario: "comum",
        created_at: agora,
        updated_at: agora,
      },
      {
        nome: FIXTURES.admin.nome,
        email: FIXTURES.admin.email,
        senha_hash: hashAdmin,
        tipo_usuario: "admin",
        created_at: agora,
        updated_at: agora,
      },
    ]);

    const [[autor]] = await queryInterface.sequelize.query(
      "SELECT id FROM usuarios WHERE email = ?",
      { replacements: [FIXTURES.autorVitrine.email] },
    );

    // Sem fotos: foto exige arquivo real em UPLOADS_DIR, e os testes de
    // upload criam as suas próprias pela rota.
    const anuncios = Array.from({ length: FIXTURES.totalAnunciosVitrine }, (_, i) => {
      const n = i + 1;
      return {
        usuario_id: autor.id,
        titulo: `Item de teste ${n}`,
        descricao: `Anúncio gerado pela fixture de teste nº ${n}.`,
        tipo: n % 2 === 0 ? "PERDIDO" : "ACHADO",
        categoria: CATEGORIAS[i % CATEGORIAS.length],
        local_encontro: LOCAIS[i % LOCAIS.length],
        data_ocorrencia: new Date(agora.getTime() - n * 60 * 60 * 1000),
        status: "ATIVO",
        criado_em: agora,
        atualizado_em: agora,
      };
    });

    await queryInterface.bulkInsert("anuncio", anuncios);
  },

  async down(queryInterface) {
    if (!ehBancoDeTeste(queryInterface)) return;
    const emails = [FIXTURES.autorVitrine.email, FIXTURES.admin.email];
    // ON DELETE CASCADE remove os anúncios desses usuários
    await queryInterface.bulkDelete("usuarios", { email: emails });
  },
};
