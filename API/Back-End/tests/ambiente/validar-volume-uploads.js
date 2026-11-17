// Valida que as fotos sobrevivem à recriação do container da API (volume
// uploads_data, ADR-08). Roda contra o docker-compose.yml de desenvolvimento,
// que precisa estar no ar. Grava a evidência em docs/testes/evidencias/.
//
// Uso: node tests/ambiente/validar-volume-uploads.js
// Se você usa outros arquivos de compose, defina COMPOSE_FILE (o Docker lê essa variável).
const path = require("path");
const crypto = require("crypto");
const { execFileSync } = require("child_process");
const { pngValido } = require("../fixtures/arquivos");
const { anuncioValido } = require("../fixtures/dados");
const { carimbo, gravar, tabela } = require("./evidencia");

const RAIZ = path.resolve(__dirname, "../..");
const API = process.env.API_URL || "http://localhost:3000";
const passos = [];
const registrar = (passo, ok, detalhe) => {
  passos.push({ passo, ok, detalhe });
  console.log(`${ok ? "✅" : "❌"} ${passo} — ${detalhe}`);
};

function compose(...args) {
  return execFileSync("docker", ["compose", ...args], { cwd: RAIZ, encoding: "utf8", stdio: "pipe" }).trim();
}

async function esperarApi(tentativas = 40) {
  for (let i = 0; i < tentativas; i += 1) {
    try {
      if ((await fetch(API)).ok) return true;
    } catch {}
    await new Promise((r) => setTimeout(r, 1500));
  }
  return false;
}

async function baixar(url) {
  const resposta = await fetch(`${API}${url}`);
  return { status: resposta.status, bytes: Buffer.from(await resposta.arrayBuffer()) };
}

async function main() {
  const inicio = new Date();
  const foto = pngValido();
  const hashOriginal = crypto.createHash("sha256").update(foto.buffer).digest("hex");
  const email = `volume.${Date.now()}@teste.ufla.br`;
  let token;
  let anuncio;

  try {
    if (!(await esperarApi(3))) throw new Error(`API fora do ar em ${API}. Suba o docker-compose.yml antes.`);
    registrar("API de desenvolvimento no ar", true, API);

    await fetch(`${API}/api/auth/registro`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nome: "Teste Volume", email, senha: "senha123" }),
    });
    const login = await (
      await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, senha: "senha123" }),
      })
    ).json();
    token = login.token;
    registrar("Usuário temporário autenticado", Boolean(token), email);

    const form = new FormData();
    for (const [campo, valor] of Object.entries(anuncioValido({ titulo: "Teste de volume" }))) form.append(campo, valor);
    form.append("fotos", new Blob([foto.buffer], { type: foto.mime }), foto.nome);
    const criacao = await fetch(`${API}/api/anuncios`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });
    anuncio = (await criacao.json()).anuncio;
    const url = anuncio?.fotos?.[0]?.url_imagem;
    registrar("Anúncio com foto publicado", criacao.status === 201 && Boolean(url), `HTTP ${criacao.status}, ${url}`);

    const antes = await baixar(url);
    const hashAntes = crypto.createHash("sha256").update(antes.bytes).digest("hex");
    registrar("Foto servida antes de recriar", antes.status === 200 && hashAntes === hashOriginal, `HTTP ${antes.status}, sha256 ${hashAntes.slice(0, 12)}…`);

    compose("up", "-d", "--force-recreate", "--no-deps", "backend");
    const idNovo = compose("ps", "-q", "backend").slice(0, 12);
    registrar("Container da API recriado", await esperarApi(), `novo container ${idNovo}`);

    const depois = await baixar(url);
    const hashDepois = crypto.createHash("sha256").update(depois.bytes).digest("hex");
    registrar(
      "Foto continua servida após recriar (volume persistiu)",
      depois.status === 200 && hashDepois === hashOriginal,
      `HTTP ${depois.status}, sha256 ${hashDepois.slice(0, 12)}…, ${depois.bytes.length} bytes`,
    );

    const nomeArquivo = path.posix.basename(url);
    const noVolume = compose("exec", "-T", "backend", "ls", "-l", `/app/uploads/${nomeArquivo}`);
    registrar("Arquivo presente no volume uploads_data", true, noVolume.replace(/\s+/g, " "));
  } catch (erro) {
    registrar("Execução", false, erro.message.split("\n")[0]);
  } finally {
    // Limpeza: não deixar lixo no ambiente de desenvolvimento
    try {
      if (anuncio?.id) {
        await fetch(`${API}/api/anuncios/${anuncio.id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
        // A exclusão não apaga o arquivo (débito M-13), então removemos à mão
        const nomeArquivo = path.posix.basename(anuncio.fotos?.[0]?.url_imagem || "");
        if (nomeArquivo) compose("exec", "-T", "backend", "rm", "-f", `/app/uploads/${nomeArquivo}`);
      }
      // O usuário não tem rota de exclusão; removemos direto no banco do container
      compose("exec", "-T", "db", "sh", "-c", `mysql -uroot -p"$MYSQL_ROOT_PASSWORD" radar_ufla -e "DELETE FROM usuarios WHERE email='${email}'" 2>/dev/null`);
      registrar("Limpeza do anúncio, da foto e do usuário temporários", true, "ok");
    } catch (erro) {
      registrar("Limpeza", false, erro.message.split("\n")[0]);
    }
  }

  const tudoOk = passos.every((p) => p.ok);
  const md = [
    "# Evidência — Persistência das fotos no volume Docker",
    "",
    `- **Data:** ${inicio.toISOString()}`,
    `- **Ambiente:** \`docker-compose.yml\` de desenvolvimento, API em \`${API}\``,
    "- **O que prova:** a foto enviada fica no volume nomeado `uploads_data` e continua disponível depois que o container da API é recriado (ADR-08).",
    `- **Resultado:** ${tudoOk ? "✅ volume persistiu a foto" : "❌ falhou"}`,
    "",
    tabela(["", "Passo", "Detalhe"], passos.map((p) => [p.ok ? "✅" : "❌", p.passo, p.detalhe])),
    "",
    "Gerado por `tests/ambiente/validar-volume-uploads.js`.",
    "",
  ].join("\n");
  console.log(`>> Evidência: ${await gravar(`${carimbo(inicio)}_volume-uploads.md`, md)}`);
  process.exit(tudoOk ? 0 : 1);
}

main();
