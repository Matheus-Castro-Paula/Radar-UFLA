// Dados de entrada reaproveitados pelos casos de teste (plano, seção 6).
const { FIXTURES } = require("../../src/seeders/test-fixtures");

let contador = 0;

// Usuários A (autor) e B do plano: cadastrados pela suíte via POST /api/auth/registro.
// E-mail único por chamada, para os testes não dependerem da ordem de execução.
function novoUsuario(apelido = "usuario") {
  contador += 1;
  return {
    nome: `Teste ${apelido}`,
    email: `${apelido}.${Date.now()}.${contador}@teste.ufla.br`,
    senha: "senha123",
  };
}

// Corpo do anúncio do CT-03 (campos de texto do multipart ou do JSON)
function anuncioValido(sobrescrever = {}) {
  return {
    titulo: "Garrafa azul",
    descricao: "Garrafa térmica azul encontrada perto da escada.",
    tipo: "ACHADO",
    categoria: "objeto",
    local_encontro: "Bloco 3",
    data_ocorrencia: "2026-11-09T17:30:00.000Z",
    ...sobrescrever,
  };
}

module.exports = { FIXTURES, novoUsuario, anuncioValido };
