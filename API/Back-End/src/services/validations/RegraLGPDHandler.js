const ValidationHandler = require("./ValidationHandler");
const RegraNegocioError = require("../RegraNegocioError");

// M-05 (RN-04): CPF e número de documento não podem aparecer em título nem descrição.
// Candidato a CPF: 11 dígitos, com ou sem pontos e traço
const CANDIDATO_CPF = /(?<!\d)\d{3}\.?\d{3}\.?\d{3}-?\d{2}(?!\d)/g;
const CPF_FORMATADO = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
// RG com pontuação (ex.: 12.345.678-9)
const RG_FORMATADO = /(?<![\d.])\d{1,2}\.\d{3}\.\d{3}-?[\dxX](?!\d)/;
// Palavra de documento seguida de um número (ex.: "RG MG-12.345.678", "CNH: 12345678900")
const DOCUMENTO_COM_PALAVRA =
  /\b(cpf|rg|cnh|identidade|passaporte|titulo de eleitor)\b[^\d\n]{0,20}\d[\d.\-/ ]{5,}\d/;

function semAcento(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

// Confere os dois dígitos verificadores, para não barrar telefone ou matrícula com 11 dígitos
function cpfValido(digitos) {
  if (digitos.length !== 11 || /^(\d)\1{10}$/.test(digitos)) return false;
  for (const tamanho of [9, 10]) {
    let soma = 0;
    for (let i = 0; i < tamanho; i += 1) {
      soma += Number(digitos[i]) * (tamanho + 1 - i);
    }
    if (((soma * 10) % 11) % 10 !== Number(digitos[tamanho])) return false;
  }
  return true;
}

function contemDocumentoPessoal(texto) {
  const limpo = semAcento(texto).toLowerCase();
  if (!limpo) return false;

  for (const [candidato] of limpo.matchAll(CANDIDATO_CPF)) {
    if (CPF_FORMATADO.test(candidato) || cpfValido(candidato.replace(/\D/g, ""))) {
      return true;
    }
  }
  return RG_FORMATADO.test(limpo) || DOCUMENTO_COM_PALAVRA.test(limpo);
}

class RegraLGPDHandler extends ValidationHandler {
  async validar(dados, contexto = {}) {
    const categoria = String(dados.categoria || "")
      .trim()
      .toLowerCase();
    const fotos = dados.fotos || [];
    const arquivos = contexto.arquivos || [];
    const ehDocumento = categoria === "documento";
    const temFotos =
      (Array.isArray(fotos) && fotos.length > 0) || arquivos.length > 0;

    if (ehDocumento && temFotos) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.LGPD,
        "Não é permitido enviar foto de documento pessoal (RN-04 / LGPD). Publique apenas a descrição.",
      );
    }

    // M-05: vale na criação e na edição (na edição, dados é o estado final)
    if (contemDocumentoPessoal(dados.titulo) || contemDocumentoPessoal(dados.descricao)) {
      throw new RegraNegocioError(
        RegraNegocioError.CODIGOS.LGPD,
        "Não informe CPF nem número de documento pessoal no título ou na descrição (RN-04 / LGPD).",
      );
    }

    await super.validar(dados, contexto);
  }
}

RegraLGPDHandler.contemDocumentoPessoal = contemDocumentoPessoal;

module.exports = RegraLGPDHandler;