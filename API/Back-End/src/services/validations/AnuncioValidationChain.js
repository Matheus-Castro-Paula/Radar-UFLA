const CamposObrigatoriosHandler = require("./CamposObrigatoriosHandler");
const DescricaoHandler = require("./DescricaoHandler");
const CategoriaEStatusHandler = require("./CategoriaEStatusHandler");
const DataOcorrenciaHandler = require("./DataOcorrenciaHandler");
const RegraLGPDHandler = require("./RegraLGPDHandler");
const FotosHandler = require("./FotosHandler");

class AnuncioValidationChain {
  constructor() {
    this.camposObrigatorios = new CamposObrigatoriosHandler();
    this.descricaoHandler = new DescricaoHandler();
    this.categoriaEStatus = new CategoriaEStatusHandler();
    this.dataOcorrencia = new DataOcorrenciaHandler();
    this.lgpdHandler = new RegraLGPDHandler();
    this.fotosHandler = new FotosHandler();

    // Campos Obrigatorios -> Descricao -> Categoria/Status -> Data -> LGPD -> Fotos
    // (o limite da descrição vem antes das regex da LGPD para barrar texto gigante cedo)
    this.camposObrigatorios
      .definirProximo(this.descricaoHandler)
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