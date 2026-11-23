const jwt = require("jsonwebtoken");
const request = require("supertest");
const { sequelize } = require("../src/models");
const { app, limparBanco, criarUsuarioLogado } = require("./helpers");

describe("Autenticação JWT (RF-01, RNF-03)", () => {
  beforeEach(limparBanco);
  afterAll(() => sequelize.close());

  it("cadastra usuário sem devolver senha_hash", async () => {
    const res = await request(app)
      .post("/api/auth/registro")
      .send({ nome: "Ana", email: "ana@jest.ufla.br", senha: "123456" });
    expect(res.status).toBe(201);
    expect(res.body.usuario.email).toBe("ana@jest.ufla.br");
    expect(JSON.stringify(res.body)).not.toContain("senha_hash");
  });

  it("recusa e-mail duplicado", async () => {
    const dados = { nome: "Ana", email: "ana@jest.ufla.br", senha: "123456" };
    await request(app).post("/api/auth/registro").send(dados);
    const res = await request(app).post("/api/auth/registro").send(dados);
    expect(res.status).toBe(400);
  });

  it("recusa cadastro sem campos obrigatórios", async () => {
    const res = await request(app).post("/api/auth/registro").send({ nome: "Ana" });
    expect(res.status).toBe(400);
  });

  it("ignora tipo_usuario enviado pelo cliente (sempre 'comum')", async () => {
    const res = await request(app)
      .post("/api/auth/registro")
      .send({ nome: "Esperto", email: "x@jest.ufla.br", senha: "123456", tipo_usuario: "admin" });
    expect(res.status).toBe(201);
    expect(res.body.usuario.tipo_usuario).toBe("comum");
  });

  it("CT-01: login válido devolve token JWT com id, tipo_usuario e validade de 24 h", async () => {
    const { token, usuario } = await criarUsuarioLogado("login");
    expect(token).toEqual(expect.any(String));
    expect(usuario.tipo_usuario).toBe("comum");

    const payload = jwt.decode(token);
    expect(payload.id).toEqual(expect.any(Number));
    expect(payload.tipo_usuario).toBe("comum");
    expect(payload.exp - payload.iat).toBe(24 * 60 * 60);
  });

  it("CT-01: login com senha errada ou e-mail inexistente devolve 401 genérico", async () => {
    await criarUsuarioLogado("login");
    const senhaErrada = await request(app)
      .post("/api/auth/login")
      .send({ email: "login@jest.ufla.br", senha: "errada" });
    const semUsuario = await request(app)
      .post("/api/auth/login")
      .send({ email: "naoexiste@jest.ufla.br", senha: "123456" });
    expect(senhaErrada.status).toBe(401);
    expect(semUsuario.status).toBe(401);
    expect(senhaErrada.body.error).toBe(semUsuario.body.error);
  });

  it("GET /perfil com token válido devolve dados sem campos sensíveis", async () => {
    const { token } = await criarUsuarioLogado("perfil");
    const res = await request(app).get("/api/auth/perfil").set("Authorization", `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body.email).toBe("perfil@jest.ufla.br");
    expect(res.body.senha_hash).toBeUndefined();
    expect(res.body.reset_password_token).toBeUndefined();
  });

  it("CT-02: GET /perfil rejeita token ausente, malformado, inválido e expirado", async () => {
    const semToken = await request(app).get("/api/auth/perfil");
    const formato = await request(app).get("/api/auth/perfil").set("Authorization", "Token abc");
    const invalido = await request(app).get("/api/auth/perfil").set("Authorization", "Bearer abc");
    const expirado = jwt.sign(
      { id: 1, exp: Math.floor(Date.now() / 1000) - 60 },
      process.env.JWT_SECRET,
    );
    const res = await request(app).get("/api/auth/perfil").set("Authorization", `Bearer ${expirado}`);
    for (const r of [semToken, formato, invalido, res]) expect(r.status).toBe(401);
  });

  it("CT-02: GET /perfil rejeita token assinado com o segredo antigo da Sprint 3", async () => {
    const { usuario } = await criarUsuarioLogado("segredo");
    const antigo = jwt.sign({ id: usuario.id }, "chave_secreta_sprint_3", { expiresIn: "24h" });
    const res = await request(app).get("/api/auth/perfil").set("Authorization", `Bearer ${antigo}`);
    expect(res.status).toBe(401);
  });
});