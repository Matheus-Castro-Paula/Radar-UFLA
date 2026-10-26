const CamposObrigatoriosHandler = require("./CamposObrigatoriosHandler");
const CategoriaEStatusHandler = require("./CategoriaEStatusHandler");
const RegraLGPDHandler = require("./RegraLGPDHandler");
const FotosHandler = require("./FotosHandler");

class AnuncioValidationChain {
  constructor() {
    this.camposObrigatorios = new CamposObrigatoriosHandler();
    this.categoriaEStatus = new CategoriaEStatusHandler();
    this.lgpdHandler = new RegraLGPDHandler();
    this.fotosHandler = new FotosHandler();

    // Encadeamento: Campos Obrigatorios -> Categoria/Status -> LGPD -> Fotos
    this.camposObrigatorios
      .definirProximo(this.categoriaEStatus)
      .definirProximo(this.lgpdHandler)
      .definirProximo(this.fotosHandler);
  }

  async executar(dados, contexto = {}) {
    // Inicia a validação pelo primeiro elo da corrente
    await this.camposObrigatorios.validar(dados, contexto);
  }
}

module.exports = new AnuncioValidationChain();
