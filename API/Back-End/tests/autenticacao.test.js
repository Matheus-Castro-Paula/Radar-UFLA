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

  it("login válido devolve token JWT", async () => {
    const { token, usuario } = await criarUsuarioLogado("login");
    expect(token).toEqual(expect.any(String));
    expect(usuario.tipo_usuario).toBe("comum");
  });

  it("login com senha errada ou e-mail inexistente devolve 401 genérico", async () => {
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

  it("GET /perfil rejeita token ausente, malformado, inválido e expirado", async () => {
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
});