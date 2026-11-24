const path = require("path");
const request = require("supertest");
const { sequelize, Anuncio, FotoAnuncio } = require("../src/models");
const {
  app, TELEFONE, JPEG, PNG, ANUNCIO_BASE,
  limparBanco, limparUploads, listarUploads, criarUsuarioLogado, publicar, horasAtras,
} = require("./helpers");

const foto = (nome, tipo, buffer) => ({ nome, tipo, buffer });

describe("Anúncios", () => {
  let autor;

  beforeEach(async () => {
    await limparBanco();
    limparUploads();
    autor = await criarUsuarioLogado("autor");
  });

  afterAll(async () => {
    limparUploads();
    await sequelize.close();
  });

  describe("Publicação e upload (RF-07, RF-08)", () => {
    it("CT-02: recusa publicar sem token", async () => {
      const res = await request(app).post("/api/anuncios").send(ANUNCIO_BASE);
      expect(res.status).toBe(401);
    });

    it("CT-03: cria anúncio com foto em multipart e serve a imagem em /uploads", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("garrafa.jpg", "image/jpeg", JPEG)],
      });
      expect(res.status).toBe(201);
      expect(res.body.anuncio.status).toBe("ATIVO");

      const [f] = res.body.anuncio.fotos;
      expect(f.url_imagem).toMatch(/^\/uploads\/[0-9a-f-]+\.jpg$/);
      expect(listarUploads()).toHaveLength(1);

      const img = await request(app).get(f.url_imagem);
      expect(img.status).toBe(200);
      expect(img.headers["x-content-type-options"]).toBe("nosniff");
    });

    it("cria anúncio sem foto", async () => {
      const res = await publicar(autor.token);
      expect(res.status).toBe(201);
      expect(res.body.anuncio.fotos).toEqual([]);
    });

    it("recusa campo obrigatório ausente", async () => {
      const res = await request(app)
        .post("/api/anuncios")
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ titulo: "x", tipo: "ACHADO", categoria: "outro" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/descricao, local_encontro/);
    });

    it("recusa categoria fora da lista", async () => {
      const res = await publicar(autor.token, { campos: { categoria: "carteira" } });
      expect(res.status).toBe(400);
    });

    it("CT-08: recusa mais de 3 fotos", async () => {
      const fotos = [1, 2, 3, 4].map((n) => foto(`f${n}.jpg`, "image/jpeg", JPEG));
      const res = await publicar(autor.token, { fotos });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/no máximo 3 fotos/);
      expect(listarUploads()).toHaveLength(0);
    });

    it("CT-08: recusa foto acima de 5 MB", async () => {
      const grande = Buffer.concat([JPEG, Buffer.alloc(5 * 1024 * 1024)]);
      const res = await publicar(autor.token, { fotos: [foto("g.jpg", "image/jpeg", grande)] });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/5 MB/);
    });

    it("CT-08: recusa formato não permitido (GIF)", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("a.gif", "image/gif", Buffer.from("GIF89a"))],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/JPG, PNG ou WEBP/);
    });

    it("CT-09: recusa arquivo com MIME falso (conteúdo não é imagem)", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("falsa.jpg", "image/jpeg", Buffer.from("isto não é uma imagem"))],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/não é uma imagem válida/);
      expect(listarUploads()).toHaveLength(0);
    });
  });

  describe("RN-04 / LGPD", () => {
    it("CT-07: recusa foto em anúncio de documento e não grava nada em disco", async () => {
      const res = await publicar(autor.token, {
        campos: { categoria: "documento" },
        fotos: [foto("rg.jpg", "image/jpeg", JPEG)],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/RN-04/);
      expect(listarUploads()).toHaveLength(0);
    });

    it("CT-07: recusa categoria ' DOCUMENTO ' com foto (normalização)", async () => {
      const res = await publicar(autor.token, {
        campos: { categoria: " DOCUMENTO " },
        fotos: [foto("rg.jpg", "image/jpeg", JPEG)],
      });
      expect(res.status).toBe(400);
    });

    it("CT-07: aceita documento sem foto", async () => {
      const res = await publicar(autor.token, { campos: { categoria: "documento" } });
      expect(res.status).toBe(201);
    });

    it("CT-07: recusa, na edição, transformar anúncio com foto em documento", async () => {
      const criado = await publicar(autor.token, {
        fotos: [foto("a.png", "image/png", PNG)],
      });
      const res = await request(app)
        .put(`/api/anuncios/${criado.body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ categoria: "documento" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/RN-04/);
    });

    it("CT-10: a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor", async () => {
      const criado = await publicar(autor.token);
      const res = await request(app).get("/api/anuncios");
      expect(res.status).toBe(200);
      expect(res.body.some((a) => a.id === criado.body.anuncio.id)).toBe(true);

      for (const anuncio of res.body) {
        expect(Object.keys(anuncio.usuario).sort()).toEqual(["id", "nome"]);
      }
      const detalhe = await request(app).get(`/api/anuncios/${criado.body.anuncio.id}`);
      expect(detalhe.status).toBe(200);
      expect(Object.keys(detalhe.body.usuario).sort()).toEqual(["id", "nome"]);

      const texto = JSON.stringify(res.body);
      expect(texto).not.toContain(autor.email);
      expect(texto).not.toContain("fixture.vitrine@teste.ufla.br");
      expect(texto).not.toContain(TELEFONE);
      expect(texto).not.toContain("senha_hash");
    });
  });

  describe("RN-02 / autoria", () => {
    it("CT-11: só o autor edita e exclui", async () => {
      const outro = await criarUsuarioLogado("outro");
      const { body } = await publicar(autor.token);
      const id = body.anuncio.id;

      const putOutro = await request(app)
        .put(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${outro.token}`)
        .send({ titulo: "invadido" });
      const delOutro = await request(app)
        .delete(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${outro.token}`);
      expect(putOutro.status).toBe(403);
      expect(putOutro.body.error).toBe("Apenas o autor pode alterar este anúncio.");
      expect(delOutro.status).toBe(403);

      const intacto = await request(app).get(`/api/anuncios/${id}`);
      expect(intacto.status).toBe(200);
      expect(intacto.body.titulo).toBe(ANUNCIO_BASE.titulo);

      const delAutor = await request(app)
        .delete(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`);
      expect(delAutor.status).toBe(204);
      expect((await request(app).get(`/api/anuncios/${id}`)).status).toBe(404);
    });
  });

  describe("M-15: data_ocorrencia é persistida", () => {
    it("CT-04: grava e devolve a data informada na criação", async () => {
      const data = horasAtras(2);
      const res = await publicar(autor.token, { campos: { data_ocorrencia: data } });
      expect(res.status).toBe(201);
      expect(new Date(res.body.anuncio.data_ocorrencia).toISOString()).toBe(data);

      const consulta = await request(app).get(`/api/anuncios/${res.body.anuncio.id}`);
      expect(new Date(consulta.body.data_ocorrencia).toISOString()).toBe(data);
    });

    it("recusa data no futuro", async () => {
      const futuro = new Date(Date.now() + 24 * 3600 * 1000).toISOString();
      const res = await publicar(autor.token, { campos: { data_ocorrencia: futuro } });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/futuro/);
    });

    it("recusa data inválida", async () => {
      const res = await publicar(autor.token, { campos: { data_ocorrencia: "ontem" } });
      expect(res.status).toBe(400);
    });

    it("CT-04: permite alterar a data na edição", async () => {
      const criado = await publicar(autor.token, { campos: { data_ocorrencia: horasAtras(5) } });
      const nova = horasAtras(1);
      const res = await request(app)
        .put(`/api/anuncios/${criado.body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ data_ocorrencia: nova });
      expect(res.status).toBe(200);
      expect(new Date(res.body.anuncio.data_ocorrencia).toISOString()).toBe(nova);
    });
  });

  describe("M-16: fotos só como arquivo no cadastro", () => {
    it("CT-05: recusa URL externa de foto em JSON no cadastro", async () => {
      const res = await request(app)
        .post("/api/anuncios")
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ ...ANUNCIO_BASE, fotos: ["https://exemplo.com/foto.jpg"] });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/arquivos/);
    });

    it("CT-05: recusa URL enviada como campo de texto no multipart", async () => {
      const res = await publicar(autor.token, {
        campos: { fotos: ["https://exemplo.com/a.jpg", "https://exemplo.com/b.jpg"] },
      });
      expect(res.status).toBe(400);
    });

    it("JSON sem fotos continua funcionando", async () => {
      const res = await request(app)
        .post("/api/anuncios")
        .set("Authorization", `Bearer ${autor.token}`)
        .send(ANUNCIO_BASE);
      expect(res.status).toBe(201);
    });
  });

  describe("M-18: metadados da foto", () => {
    it("CT-06: grava mime_type e tamanho_bytes", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("a.jpg", "image/jpeg", JPEG), foto("b.png", "image/png", PNG)],
      });
      expect(res.status).toBe(201);

      const linhas = await FotoAnuncio.findAll({
        where: { anuncio_id: res.body.anuncio.id },
        order: [["id", "ASC"]],
      });
      expect(linhas.map((l) => l.mime_type)).toEqual(["image/jpeg", "image/png"]);
      expect(linhas.map((l) => l.tamanho_bytes)).toEqual([JPEG.length, PNG.length]);
    });
  });

  const urlsDe = (anuncio) => anuncio.fotos.map((f) => f.url_imagem);

  describe("CT-05 (passo 2) / M-16: fotos na edição só como caminho local já publicado", () => {
    it("CT-05: recusa URL externa em fotos no PUT e deixa o anúncio inalterado", async () => {
      const criado = await publicar(autor.token);
      const id = criado.body.anuncio.id;
      const res = await request(app)
        .put(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ fotos: ["https://exemplo.com/x.png"] });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/URLs externas/);

      const depois = await request(app).get(`/api/anuncios/${id}`);
      expect(depois.body.fotos).toEqual([]);
    });

    it("CT-05: recusa caminho com ../ e nome que não foi gerado pela API", async () => {
      const criado = await publicar(autor.token);
      for (const url of ["/uploads/../../etc/passwd.png", "/uploads/qualquer.png", "uploads/x.jpg"]) {
        const res = await request(app)
          .put(`/api/anuncios/${criado.body.anuncio.id}`)
          .set("Authorization", `Bearer ${autor.token}`)
          .send({ fotos: [url] });
        expect(res.status).toBe(400);
      }
    });

    it("CT-05: recusa apontar para a foto de outro anúncio e não apaga o arquivo dele", async () => {
      const outro = await criarUsuarioLogado("outro");
      const alheio = await publicar(outro.token, { fotos: [foto("a.png", "image/png", PNG)] });
      const [urlAlheia] = urlsDe(alheio.body.anuncio);
      const meu = await publicar(autor.token);

      const res = await request(app)
        .put(`/api/anuncios/${meu.body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ fotos: [urlAlheia] });
      expect(res.status).toBe(400);
      expect(listarUploads()).toHaveLength(1);
      expect((await request(app).get(urlAlheia)).status).toBe(200);
    });
  });

  describe("M-13: remoção física de mídias órfãs no volume /uploads", () => {
    const publicarComDuasFotos = () =>
      publicar(autor.token, {
        fotos: [foto("a.jpg", "image/jpeg", JPEG), foto("b.png", "image/png", PNG)],
      });

    it("excluir o anúncio apaga os arquivos das fotos", async () => {
      const { body } = await publicarComDuasFotos();
      expect(listarUploads()).toHaveLength(2);

      const res = await request(app)
        .delete(`/api/anuncios/${body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`);
      expect(res.status).toBe(204);
      expect(listarUploads()).toHaveLength(0);
    });

    it("remover uma foto na edição apaga só o arquivo dela e preserva os metadados da outra", async () => {
      const { body } = await publicarComDuasFotos();
      const manter = body.anuncio.fotos.find((f) => f.url_imagem.endsWith(".png"));

      const res = await request(app)
        .put(`/api/anuncios/${body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ fotos: [manter.url_imagem] });
      expect(res.status).toBe(200);
      expect(urlsDe(res.body.anuncio)).toEqual([manter.url_imagem]);
      expect(listarUploads()).toEqual([path.basename(manter.url_imagem)]);

      const linhas = await FotoAnuncio.findAll({ where: { anuncio_id: body.anuncio.id } });
      expect(linhas).toHaveLength(1);
      expect(linhas[0].mime_type).toBe("image/png");
      expect(linhas[0].tamanho_bytes).toBe(PNG.length);
    });

    it("fotos: [] na edição remove todas as fotos e os arquivos", async () => {
      const { body } = await publicarComDuasFotos();
      const res = await request(app)
        .put(`/api/anuncios/${body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ fotos: [] });
      expect(res.status).toBe(200);
      expect(res.body.anuncio.fotos).toEqual([]);
      expect(listarUploads()).toHaveLength(0);
    });

    it("editar sem enviar o campo fotos não mexe nos arquivos nem nos metadados", async () => {
      const { body } = await publicarComDuasFotos();
      const res = await request(app)
        .put(`/api/anuncios/${body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ titulo: "Título novo" });
      expect(res.status).toBe(200);
      expect(listarUploads()).toHaveLength(2);

      const linhas = await FotoAnuncio.findAll({ where: { anuncio_id: body.anuncio.id } });
      expect(linhas.every((l) => l.mime_type && l.tamanho_bytes > 0)).toBe(true);
    });
  });

  describe("M-05: CPF e número de documento no título e na descrição (RN-04)", () => {
    it.each([
      ["CPF formatado na descrição", { descricao: "Achei a carteira, CPF 123.456.789-09" }],
      ["CPF sem pontuação na descrição", { descricao: "Dono: 12345678909" }],
      ["RG com pontuação no título", { titulo: "Carteira RG 12.345.678-9" }],
      ["CNH com palavra-chave", { descricao: "CNH: 12345678900" }],
    ])("recusa %s", async (_nome, campos) => {
      const res = await publicar(autor.token, { campos });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/RN-04/);
    });

    it("aceita texto comum, horário e telefone formatado", async () => {
      const res = await publicar(autor.token, {
        campos: { descricao: "Achei na sala 203 do bloco 5, às 14h30. Contato (35) 99999-0000" },
      });
      expect(res.status).toBe(201);
    });

    it("recusa, na edição, incluir CPF e deixa o anúncio inalterado", async () => {
      const criado = await publicar(autor.token);
      const id = criado.body.anuncio.id;
      const res = await request(app)
        .put(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ descricao: "CPF 123.456.789-09" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/RN-04/);

      const depois = await request(app).get(`/api/anuncios/${id}`);
      expect(depois.body.descricao).toBe(ANUNCIO_BASE.descricao);
    });

    it("aceita telefone de contato junto da palavra CNH", async () => {
      const res = await publicar(autor.token, {
        campos: { categoria: "documento", descricao: "Achei uma CNH, me chama no 35 99876-5432" },
      });
      expect(res.status).toBe(201);
    });

    it("permite resolver anúncio antigo que já tinha documento no texto", async () => {
      const criado = await publicar(autor.token);
      const id = criado.body.anuncio.id;
      // Simula anúncio gravado antes do M-05, direto no banco
      await Anuncio.update({ descricao: "CPF 123.456.789-09" }, { where: { id } });

      const res = await request(app)
        .put(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ status: "RESOLVIDO" });
      expect(res.status).toBe(200);
      expect(res.body.anuncio.status).toBe("RESOLVIDO");
    });
  });

  describe("Limite da descrição (Sprint 8)", () => {
    const LIMITE = 200;

    it("aceita descrição com exatamente 200 caracteres", async () => {
      const res = await publicar(autor.token, { campos: { descricao: "a".repeat(LIMITE) } });
      expect(res.status).toBe(201);
    });

    it("recusa descrição com 201 caracteres (400)", async () => {
      const res = await publicar(autor.token, { campos: { descricao: "a".repeat(LIMITE + 1) } });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/200 caracteres/);
    });

    it("recusa descrição gigante sem travar a API", async () => {
      const inicio = Date.now();
      const res = await publicar(autor.token, { campos: { descricao: "a".repeat(50000) } });
      expect(res.status).toBe(400);
      expect(Date.now() - inicio).toBeLessThan(2000);
    });

    it("na edição, recusa descrição acima do limite", async () => {
      const criado = await publicar(autor.token);
      const res = await request(app)
        .put(`/api/anuncios/${criado.body.anuncio.id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ descricao: "a".repeat(LIMITE + 1) });
      expect(res.status).toBe(400);
    });

    it("anúncio antigo com descrição longa ainda pode ser marcado como resolvido", async () => {
      const criado = await publicar(autor.token);
      const id = criado.body.anuncio.id;
      await Anuncio.update({ descricao: "a".repeat(500) }, { where: { id } });
      const res = await request(app)
        .put(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ status: "RESOLVIDO" });
      expect(res.status).toBe(200);
    });
  });

  describe("M-10: CORS restrito", () => {
    const origemPermitida = () => (process.env.CORS_ORIGINS || "http://localhost:8000").split(",")[0].trim();

    it("libera a origem do front-end", async () => {
      const res = await request(app).get("/").set("Origin", origemPermitida());
      expect(res.status).toBe(200);
      expect(res.headers["access-control-allow-origin"]).toBe(origemPermitida());
    });

    it("não envia cabeçalhos CORS para origem desconhecida", async () => {
      const res = await request(app).get("/").set("Origin", "https://site-malicioso.example");
      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });

    it("requisição sem Origin (curl, Postman) continua funcionando", async () => {
      const res = await request(app).get("/");
      expect(res.status).toBe(200);
    });

    it("preflight só é liberado para a origem permitida", async () => {
      const ok = await request(app)
        .options("/api/anuncios")
        .set("Origin", origemPermitida())
        .set("Access-Control-Request-Method", "POST");
      expect(ok.headers["access-control-allow-origin"]).toBe(origemPermitida());

      const negado = await request(app)
        .options("/api/anuncios")
        .set("Origin", "https://site-malicioso.example")
        .set("Access-Control-Request-Method", "POST");
      expect(negado.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("CT-13: desempenho da vitrine (RNF-02)", () => {
    it("CT-13: 20 requisições GET /api/anuncios com 50 anúncios ativos têm média abaixo de 800 ms", async () => {
      for (let n = 1; n <= 50; n += 1) {
        const criado = await publicar(autor.token, { campos: { titulo: `Item ${n}` } });
        expect(criado.status).toBe(201);
      }

      const tempos = [];
      for (let n = 0; n < 20; n += 1) {
        const inicio = process.hrtime.bigint();
        const res = await request(app).get("/api/anuncios");
        tempos.push(Number(process.hrtime.bigint() - inicio) / 1e6);
        expect(res.status).toBe(200);
        expect(res.body.length).toBeGreaterThanOrEqual(50);
      }

      const media = tempos.reduce((soma, ms) => soma + ms, 0) / tempos.length;
      console.info(
        `[CT-13] média ${media.toFixed(1)} ms (mín ${Math.min(...tempos).toFixed(1)} ms, máx ${Math.max(...tempos).toFixed(1)} ms) em ${tempos.length} requisições`,
      );
      expect(media).toBeLessThan(800);
    });
  });
});