const CamposObrigatoriosHandler = require("./CamposObrigatoriosHandler");
const CategoriaEStatusHandler = require("./CategoriaEStatusHandler");
const DataOcorrenciaHandler = require("./DataOcorrenciaHandler");
const RegraLGPDHandler = require("./RegraLGPDHandler");
const FotosHandler = require("./FotosHandler");

class AnuncioValidationChain {
  constructor() {
    this.camposObrigatorios = new CamposObrigatoriosHandler();
    this.categoriaEStatus = new CategoriaEStatusHandler();
    this.dataOcorrencia = new DataOcorrenciaHandler();
    this.lgpdHandler = new RegraLGPDHandler();
    this.fotosHandler = new FotosHandler();

    // Campos Obrigatorios -> Categoria/Status -> Data -> LGPD -> Fotos
    this.camposObrigatorios
      .definirProximo(this.categoriaEStatus)
      .definirProximo(this.dataOcorrencia)
      .definirProximo(this.lgpdHandler)
      .definirProximo(this.fotosHandler);
  }

  async executar(dados, contexto = {}) {
    await this.camposObrigatorios.validar(dados, contexto);
  }
}

module.exports = new AnuncioValidationChain();