const request = require("supertest");
const { sequelize, FotoAnuncio } = require("../src/models");
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
    it("recusa publicar sem token", async () => {
      const res = await request(app).post("/api/anuncios").send(ANUNCIO_BASE);
      expect(res.status).toBe(401);
    });

    it("cria anúncio com foto em multipart e serve a imagem em /uploads", async () => {
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

    it("recusa mais de 3 fotos", async () => {
      const fotos = [1, 2, 3, 4].map((n) => foto(`f${n}.jpg`, "image/jpeg", JPEG));
      const res = await publicar(autor.token, { fotos });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/no máximo 3 fotos/);
      expect(listarUploads()).toHaveLength(0);
    });

    it("recusa foto acima de 5 MB", async () => {
      const grande = Buffer.concat([JPEG, Buffer.alloc(5 * 1024 * 1024)]);
      const res = await publicar(autor.token, { fotos: [foto("g.jpg", "image/jpeg", grande)] });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/5 MB/);
    });

    it("recusa formato não permitido (GIF)", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("a.gif", "image/gif", Buffer.from("GIF89a"))],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/JPG, PNG ou WEBP/);
    });

    it("recusa arquivo com MIME falso (conteúdo não é imagem)", async () => {
      const res = await publicar(autor.token, {
        fotos: [foto("falsa.jpg", "image/jpeg", Buffer.from("isto não é uma imagem"))],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/não é uma imagem válida/);
      expect(listarUploads()).toHaveLength(0);
    });
  });

  describe("RN-04 / LGPD", () => {
    it("recusa foto em anúncio de documento e não grava nada em disco", async () => {
      const res = await publicar(autor.token, {
        campos: { categoria: "documento" },
        fotos: [foto("rg.jpg", "image/jpeg", JPEG)],
      });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/RN-04/);
      expect(listarUploads()).toHaveLength(0);
    });

    it("recusa categoria ' DOCUMENTO ' com foto (normalização)", async () => {
      const res = await publicar(autor.token, {
        campos: { categoria: " DOCUMENTO " },
        fotos: [foto("rg.jpg", "image/jpeg", JPEG)],
      });
      expect(res.status).toBe(400);
    });

    it("aceita documento sem foto", async () => {
      const res = await publicar(autor.token, { campos: { categoria: "documento" } });
      expect(res.status).toBe(201);
    });

    it("recusa, na edição, transformar anúncio com foto em documento", async () => {
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

    it("a vitrine pública não expõe e-mail, telefone nem senha_hash de nenhum autor", async () => {
      const criado = await publicar(autor.token);
      const res = await request(app).get("/api/anuncios");
      expect(res.status).toBe(200);
      expect(res.body.some((a) => a.id === criado.body.anuncio.id)).toBe(true);

      for (const anuncio of res.body) {
        expect(Object.keys(anuncio.usuario).sort()).toEqual(["id", "nome"]);
      }
      const texto = JSON.stringify(res.body);
      expect(texto).not.toContain(autor.email);
      expect(texto).not.toContain("fixture.vitrine@teste.ufla.br");
      expect(texto).not.toContain(TELEFONE);
      expect(texto).not.toContain("senha_hash");
    });
  });

  describe("RN-02 / autoria", () => {
    it("só o autor edita e exclui", async () => {
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
      expect(delOutro.status).toBe(403);

      const delAutor = await request(app)
        .delete(`/api/anuncios/${id}`)
        .set("Authorization", `Bearer ${autor.token}`);
      expect(delAutor.status).toBe(204);
      expect((await request(app).get(`/api/anuncios/${id}`)).status).toBe(404);
    });
  });

  describe("M-15: data_ocorrencia é persistida", () => {
    it("grava e devolve a data informada na criação", async () => {
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

    it("permite alterar a data na edição", async () => {
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
    it("recusa URL externa de foto em JSON", async () => {
      const res = await request(app)
        .post("/api/anuncios")
        .set("Authorization", `Bearer ${autor.token}`)
        .send({ ...ANUNCIO_BASE, fotos: ["https://exemplo.com/foto.jpg"] });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/arquivos/);
    });

    it("recusa URL enviada como campo de texto no multipart", async () => {
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
    it("grava mime_type e tamanho_bytes", async () => {
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
});