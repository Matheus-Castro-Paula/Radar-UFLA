// Erro lançado pelos services quando uma regra de negócio é violada.
// O código é semântico (não é status HTTP): quem traduz para HTTP é o controller.
class RegraNegocioError extends Error {
  constructor(codigo, mensagem) {
    super(mensagem);
    this.name = "RegraNegocioError";
    this.codigo = codigo;
  }
}

RegraNegocioError.CODIGOS = {
  VALIDACAO: "VALIDACAO",
  LGPD: "LGPD",
  NAO_ENCONTRADO: "NAO_ENCONTRADO",
  PROIBIDO: "PROIBIDO",
};

module.exports = RegraNegocioError;
