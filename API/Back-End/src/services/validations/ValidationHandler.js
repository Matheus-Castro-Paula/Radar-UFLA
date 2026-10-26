class ValidationHandler {
  constructor() {
    this.proximo = null;
  }

  definirProximo(handler) {
    this.proximo = handler;
    return handler;
  }

  async validar(dados, contexto = {}) {
    if (this.proximo) {
      await this.proximo.validar(dados, contexto);
    }
  }
}

module.exports = ValidationHandler;
